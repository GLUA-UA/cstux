import { NextResponse } from "next/server";

function createPlainTextResponse(
  data: Record<string, string>,
  status: number = 200
): NextResponse {
  const body = Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .join(" ");

  // Define CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  return new NextResponse(body, {
    status: status,
    headers: {
      "Content-Type": "text/plain",
      ...corsHeaders,
    },
  });
}

export default createPlainTextResponse;