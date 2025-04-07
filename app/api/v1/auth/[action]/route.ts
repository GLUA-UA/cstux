import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import database from "@/lib/database";

// Set of active tokens for logged-in users
const ACTIVE_TOKENS = new Set<string>();

// Helper function to create consistent plain text responses
function createPlainTextResponse(
  data: Record<string, string>,
  status: number = 200
): NextResponse {
  const body = Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .join(" ");
    
  return new NextResponse(body, {
    status: status,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

export async function GET(
  request: NextRequest, 
  context: { params: { action: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const { params } = await context;
  const { action } = await params;

  switch (action) {
    case "login": {
      const accessCode = searchParams.get("accesscode") || "";
      return actionLogin(accessCode);
    }
    case "logout": {
      const token = searchParams.get("token") || "";
      return actionLogout(token);
    }
    default: {
      return createPlainTextResponse({ status: "invalid_action" }, 404);
    }
  }
}

async function actionLogin(accessCode: string) {
  if (!accessCode) {
    return createPlainTextResponse({ status: "invalid" }, 400);
  }

  try {
    // Find user by access code
    const user = await database.user.findUnique({
      where: { accessCode },
      include: {
        statuses: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!user) {
      console.log(`Login failed for access code: ${accessCode}`);
      return createPlainTextResponse({ status: "invalid" }, 401);
    }

    // Generate a new token
    const token = randomUUID();
    ACTIVE_TOKENS.add(token);

    // Update user status to LOGGED_IN
    await database.userStatus.create({
      data: {
        userId: user.id,
        status: "LOGGED_IN"
      }
    });

    // Create or update token in the database
    await database.token.upsert({
      where: { userId: user.id },
      update: {
        token,
        expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000) // 3 hours from now
      },
      create: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000) // 3 hours from now
      }
    });

    console.log(`Login successful for ${user.name}, token: ${token}`);
    
    return createPlainTextResponse({
      status: "valid",
      token: token,
      name: user.name,
    });
  } catch (error) {
    console.error("Database error during login:", error);
    return createPlainTextResponse({ 
      status: "error", 
      message: "Internal server error" 
    }, 500);
  }
}

async function actionLogout(token: string) {
  if (!token) {
    return createPlainTextResponse({ status: "invalid" }, 400);
  }

  try {
    // Find the token in the database
    const tokenRecord = await database.token.findFirst({
      where: { token },
      include: { user: true }
    });

    if (!tokenRecord) {
      console.log(`Logout attempt with invalid token: ${token}`);
      return createPlainTextResponse({ status: "invalid" }, 401);
    }

    // Remove from active tokens list
    if (ACTIVE_TOKENS.has(token)) {
      ACTIVE_TOKENS.delete(token);
    }

    // Update user status to LOGGED_OUT
    await database.userStatus.create({
      data: {
        userId: tokenRecord.userId,
        status: "LOGGED_OUT"
      }
    });

    console.log(`Logout successful for user: ${tokenRecord.user.name}`);
    return createPlainTextResponse({ status: "valid" });
  } catch (error) {
    console.error("Database error during logout:", error);
    return createPlainTextResponse({ 
      status: "error", 
      message: "Internal server error" 
    }, 500);
  }
}

export const dynamic = "force-dynamic";