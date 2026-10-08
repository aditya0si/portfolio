import { getContributions } from "@/lib/contributions";

// Runtime-only GET: the token is read from the server environment per request,
// never baked at build time and never exposed to the client.
const UNAVAILABLE = { error: "Contributions unavailable" } as const;

const NO_STORE = {
  "Cache-Control": "no-store",
} as const;

const PUBLIC_CACHE = {
  "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
} as const;

export async function GET(): Promise<Response> {
  const token = process.env.GITHUB_TOKEN;

  if (typeof token !== "string" || token.trim().length === 0) {
    return Response.json(UNAVAILABLE, { status: 503, headers: NO_STORE });
  }

  try {
    const contributions = await getContributions(token);
    return Response.json(contributions, { status: 200, headers: PUBLIC_CACHE });
  } catch {
    // Fail closed: surface a single safe message, never the upstream error,
    // token, headers or stack.
    return Response.json(UNAVAILABLE, { status: 503, headers: NO_STORE });
  }
}
