import { createVisitHandler } from "@/lib/visit-handler";
import { readVisits, registerVisit } from "@/lib/visits";

// Server-only Node.js runtime. The Upstash REST URL/token are read from the
// server environment per request (via getConfig below), never baked at build
// time and never exposed to the client.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handler = createVisitHandler({
  getConfig: () => ({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  }),
  read: readVisits,
  register: registerVisit,
  newUUID: () => crypto.randomUUID(),
});

// Read-only total; no cookie and no writes.
export async function GET(): Promise<Response> {
  return handler.GET();
}

// Register a visit for the request's own origin; sets portfolio_visit only on a
// successful register.
export async function POST(request: Request): Promise<Response> {
  return handler.POST(request);
}
