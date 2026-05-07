import mysql, { type Pool, type RowDataPacket } from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL || "";

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

// MariaDB returns JSON as a LONGTEXT string; revive shaped strings to
// objects so call sites read parsed values regardless of underlying engine.
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

/** Returns { ok, message } so a healthcheck route can show DB status. */
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
