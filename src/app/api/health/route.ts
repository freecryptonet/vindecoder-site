import { NextResponse } from "next/server";
import { dbPing } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const db = await dbPing();
  return NextResponse.json(
    {
      app: "vindecoder.site",
      time: new Date().toISOString(),
      db,
    },
    { status: db.ok ? 200 : 503 },
  );
}
