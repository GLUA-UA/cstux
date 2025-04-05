import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

// #region Placeholder Data/Logic ---
const VALID_ACCESS_CODE = "A23G12LK";
const MOCK_USER_DB: Record<string, { name: string }> = {
  [VALID_ACCESS_CODE]: { name: "Alice" },
};
const ACTIVE_TOKENS = new Set<string>();
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
// #endregion

export async function GET(request: NextRequest, context: { params: { action: string } }) {
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

  const user = MOCK_USER_DB[accessCode];
  if (user) {
    const token = randomUUID();
    ACTIVE_TOKENS.add(token);

    console.log(`Login successful for ${user.name}, token: ${token}`);

    return createPlainTextResponse({
      status: "valid",
      token: token,
      name: user.name,
    });
  } else {
    console.log(`Login failed for access code: ${accessCode}`);
    return createPlainTextResponse({ status: "invalid" }, 401);
  }
}

async function actionLogout(token: string) {
  if (!token) {
    return createPlainTextResponse({ status: "invalid" }, 400); // Bad Request
  }

  if (ACTIVE_TOKENS.has(token)) {
    ACTIVE_TOKENS.delete(token); // Simulate invalidating the token
    console.log(`Logout successful for token: ${token}`); // Server log
    return createPlainTextResponse({ status: "valid" });
  } else {
    console.log(`Logout attempt with invalid/inactive token: ${token}`); // Server log
    return createPlainTextResponse({ status: "invalid" }, 401); // Unauthorized
  }
}
