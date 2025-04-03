import { NextResponse } from "next/server";
import database from "@/lib/database";

let adminExistsCache: boolean | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION_MS = 0;

export async function GET() {                        
  const now = Date.now();

  if (
    adminExistsCache !== null &&
    cacheTimestamp !== null &&   
    now - cacheTimestamp < CACHE_DURATION_MS
  ) {
    return NextResponse.json({ adminExists: adminExistsCache });
  }

  try {
    const firstAdmin = await database.adminUser.findFirst({
      select: { id: true },
    });
    adminExistsCache = !!firstAdmin;
    cacheTimestamp = now;
    return NextResponse.json({ adminExists: adminExistsCache });
  } catch (error) {
    console.error("API route DB check failed:", error);
    return NextResponse.json(
      { error: "Failed to check admin status" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";