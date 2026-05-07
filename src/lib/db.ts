/**
 * Database layer — VPS-local MariaDB. All tables are caches of NHTSA data;
 * empty MariaDB works fine and warms up organically as users hit pages.
 *
 * Design notes:
 *   - Tagged-template `sql` adapter ports the `@neondatabase/serverless` shape
 *     used in the archive (so callers stay clean). Splices values as `?`
 *     placeholders for mysql2.
 *   - MariaDB returns JSON columns as TEXT, not parsed objects — `reviveJsonColumns`
 *     auto-parses any string field whose first char is `{` or `[`.
 *   - All read functions tolerate DB-down by returning null/[] so the page
 *     can fall through to a live NHTSA fetch.
 */

import mysql, { type Pool, type RowDataPacket } from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL || "";
const CACHE_EXPIRY_DAYS = 7;

let cachedPool: Pool | null = null;

function getPool(): Pool | null {
  if (cachedPool) return cachedPool;
  if (!DATABASE_URL) return null;
  cachedPool = mysql.createPool({
    uri: DATABASE_URL,
    connectionLimit: 8,
    waitForConnections: true,
    queueLimit: 0,
    dateStrings: false,
  });
  return cachedPool;
}

export type SqlFn = ((
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<Record<string, unknown>[]>) & { _isSqlFn: true };

function maybeParseJson(v: unknown): unknown {
  if (typeof v !== "string") return v;
  const t = v.trim();
  if (!t) return v;
  const c = t[0];
  if (c !== "{" && c !== "[") return v;
  try {
    return JSON.parse(t);
  } catch {
    return v;
  }
}

function reviveJsonColumns(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(row)) out[k] = maybeParseJson(row[k]);
  return out;
}

export function getDb(): SqlFn | null {
  const pool = getPool();
  if (!pool) return null;
  const fn = (async (strings: TemplateStringsArray, ...values: unknown[]) => {
    let q = "";
    for (let i = 0; i < strings.length; i++) {
      q += strings[i];
      if (i < values.length) q += "?";
    }
    const [rows] = await pool.query<RowDataPacket[]>(q, values);
    if (!Array.isArray(rows)) return [];
    return (rows as unknown as Record<string, unknown>[]).map(reviveJsonColumns);
  }) as SqlFn;
  fn._isSqlFn = true;
  return fn;
}

export async function dbPing(): Promise<{ ok: boolean; message: string }> {
  const sql = getDb();
  if (!sql) return { ok: false, message: "DATABASE_URL not set" };
  try {
    const rows = await sql`SELECT 1 AS ok`;
    return { ok: rows.length === 1, message: "ok" };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}

// ============================================================
// Schema (idempotent — safe to call on every cold start)
// ============================================================

let schemaInitPromise: Promise<void> | null = null;

export async function initializeDatabase(): Promise<void> {
  if (schemaInitPromise) return schemaInitPromise;
  schemaInitPromise = (async () => {
    const sql = getDb();
    if (!sql) return;

    await sql`
      CREATE TABLE IF NOT EXISTS vin_cache (
        id INT AUTO_INCREMENT PRIMARY KEY,
        vin VARCHAR(17) NOT NULL,
        decode_data JSON,
        make VARCHAR(100),
        model VARCHAR(100),
        year VARCHAR(4),
        last_fetched TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_vin (vin),
        INDEX idx_vin (vin)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS vehicle_cache (
        id INT AUTO_INCREMENT PRIMARY KEY,
        make VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        year VARCHAR(4) NOT NULL,
        recalls_count INT DEFAULT 0,
        complaints_count INT DEFAULT 0,
        safety_rating VARCHAR(10),
        investigations_count INT DEFAULT 0,
        mfr_comms_count INT DEFAULT 0,
        recalls_data JSON,
        complaints_data JSON,
        safety_data JSON,
        investigations_data JSON,
        mfr_comms_data JSON,
        epa_data JSON,
        has_data BOOLEAN DEFAULT FALSE,
        last_fetched TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_make_model_year (make, model, year),
        INDEX idx_has_data (has_data)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS not_found_log (
        path VARCHAR(255) NOT NULL,
        hit_count INT NOT NULL DEFAULT 1,
        first_seen TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_seen TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (path),
        INDEX idx_404_last_seen (last_seen DESC)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
  })();
  return schemaInitPromise;
}

// ============================================================
// VIN cache
// ============================================================

export async function getCachedVin(vin: string): Promise<unknown | null> {
  const sql = getDb();
  if (!sql) return null;
  try {
    const rows = await sql`
      SELECT decode_data, last_fetched FROM vin_cache
      WHERE vin = ${vin.toUpperCase()}
      LIMIT 1
    `;
    if (rows.length === 0) return null;
    const last = new Date(rows[0].last_fetched as string);
    const days = (Date.now() - last.getTime()) / (1000 * 60 * 60 * 24);
    if (days > CACHE_EXPIRY_DAYS) return null;
    return rows[0].decode_data;
  } catch {
    return null;
  }
}

export async function saveVinCache(
  vin: string,
  decodeData: unknown,
  make: string,
  model: string,
  year: string,
): Promise<void> {
  const sql = getDb();
  if (!sql) return;
  try {
    await sql`
      INSERT INTO vin_cache (vin, decode_data, make, model, year, last_fetched)
      VALUES (${vin.toUpperCase()}, ${JSON.stringify(decodeData)}, ${make}, ${model}, ${year}, NOW())
      ON DUPLICATE KEY UPDATE
        decode_data = VALUES(decode_data),
        make = VALUES(make),
        model = VALUES(model),
        year = VALUES(year),
        last_fetched = NOW()
    `;
  } catch {
    // Best-effort cache; don't fail the page on DB write error.
  }
}

// ============================================================
// Vehicle (make/model/year) cache
// ============================================================

export interface CachedVehicle {
  make: string;
  model: string;
  year: string;
  recalls_count: number;
  complaints_count: number;
  safety_rating: string | null;
  investigations_count: number;
  mfr_comms_count: number;
  recalls_data: unknown;
  complaints_data: unknown;
  safety_data: unknown;
  investigations_data: unknown;
  mfr_comms_data: unknown;
  epa_data: unknown;
  has_data: boolean;
  last_fetched: Date;
}

export async function getCachedVehicle(
  make: string,
  model: string,
  year: string,
): Promise<CachedVehicle | null> {
  const sql = getDb();
  if (!sql) return null;
  try {
    const rows = await sql`
      SELECT * FROM vehicle_cache
      WHERE make = ${make} AND model = ${model} AND year = ${year}
      LIMIT 1
    `;
    if (rows.length === 0) return null;
    const last = new Date(rows[0].last_fetched as string);
    const days = (Date.now() - last.getTime()) / (1000 * 60 * 60 * 24);
    if (days > CACHE_EXPIRY_DAYS) return null;
    return rows[0] as unknown as CachedVehicle;
  } catch {
    return null;
  }
}

export interface SaveVehicleData {
  make: string;
  model: string;
  year: string;
  recalls_count: number;
  complaints_count: number;
  safety_rating: string | null;
  investigations_count: number;
  mfr_comms_count: number;
  recalls_data: unknown;
  complaints_data: unknown;
  safety_data: unknown;
  investigations_data: unknown;
  mfr_comms_data: unknown;
  epa_data: unknown;
}

export async function saveVehicleCache(d: SaveVehicleData): Promise<void> {
  const sql = getDb();
  if (!sql) return;
  // Reject obvious garbage years (NHTSA's 9999 sentinel + bot-fuzzed futures).
  const yr = parseInt(d.year, 10);
  if (!Number.isFinite(yr) || yr < 1975 || yr > new Date().getFullYear() + 2) return;

  const hasData =
    d.recalls_count > 0 ||
    d.complaints_count > 0 ||
    !!d.safety_rating ||
    d.investigations_count > 0 ||
    d.mfr_comms_count > 0 ||
    d.epa_data != null;

  try {
    await sql`
      INSERT INTO vehicle_cache (
        make, model, year, recalls_count, complaints_count,
        safety_rating, investigations_count, mfr_comms_count,
        recalls_data, complaints_data, safety_data,
        investigations_data, mfr_comms_data, epa_data,
        has_data, last_fetched
      ) VALUES (
        ${d.make}, ${d.model}, ${d.year},
        ${d.recalls_count}, ${d.complaints_count},
        ${d.safety_rating}, ${d.investigations_count}, ${d.mfr_comms_count},
        ${d.recalls_data != null ? JSON.stringify(d.recalls_data) : null},
        ${d.complaints_data != null ? JSON.stringify(d.complaints_data) : null},
        ${d.safety_data != null ? JSON.stringify(d.safety_data) : null},
        ${d.investigations_data != null ? JSON.stringify(d.investigations_data) : null},
        ${d.mfr_comms_data != null ? JSON.stringify(d.mfr_comms_data) : null},
        ${d.epa_data != null ? JSON.stringify(d.epa_data) : null},
        ${hasData}, NOW()
      )
      ON DUPLICATE KEY UPDATE
        recalls_count = VALUES(recalls_count),
        complaints_count = VALUES(complaints_count),
        safety_rating = VALUES(safety_rating),
        investigations_count = VALUES(investigations_count),
        mfr_comms_count = VALUES(mfr_comms_count),
        recalls_data = VALUES(recalls_data),
        complaints_data = VALUES(complaints_data),
        safety_data = VALUES(safety_data),
        investigations_data = COALESCE(VALUES(investigations_data), investigations_data),
        mfr_comms_data = COALESCE(VALUES(mfr_comms_data), mfr_comms_data),
        epa_data = COALESCE(VALUES(epa_data), epa_data),
        has_data = VALUES(has_data),
        last_fetched = NOW()
    `;
  } catch {
    // best-effort
  }
}
