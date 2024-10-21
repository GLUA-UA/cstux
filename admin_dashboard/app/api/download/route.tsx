// Routes:
// - /api/download?platform=windows
// - /api/download?platform=linux
//
// The download route is used to serve the SuperTux client for Windows and Linux.
// If the platform is not specified, the route will return a 400 error.

export async function GET(request: Request) {
    const platform = new URL(request.url).searchParams.get("platform");
    if (!platform) {
        return new Response("Platform not specified", { status: 400 });
    }

    const repo = "GLUA-UA/cstux";
    const file = platform === "windows" ? "cstux_windows.zip" : "cstux_linux.zip";
    return Response.redirect(`
        https://github.com/${repo}/releases/latest/download/${file}
    `);
}
