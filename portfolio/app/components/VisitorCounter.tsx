"use client";

import { useEffect, useState } from "react";

// Client-side visit counter for the shared footer.
//
// On mount it makes exactly ONE same-origin POST to /api/visits, aborts after
// six seconds and never retries. The rendered number is always the validated
// integer the server returned — there is no localStorage, no fabricated count
// and no optimistic increment. Every failure mode (non-2xx, invalid JSON, a
// malformed count, a network error or a hang) renders the same unavailable
// label. The component makes no unique-visitor, Nth-visitor or badge claim.

const REQUEST_TIMEOUT_MS = 6000;
const CAPTION =
  "Repeat visits from the same browser count at most once every 24 hours.";

const countFormatter = new Intl.NumberFormat("en-US");

type State =
  | { status: "loading" }
  | { status: "ready"; count: number }
  | { status: "unavailable" };

function isSafeCount(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function parseCount(payload: unknown): number | null {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return null;
  }
  const count = (payload as Record<string, unknown>).count;
  return isSafeCount(count) ? count : null;
}

export default function VisitorCounter() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let active = true;

    (async () => {
      try {
        const response = await fetch("/api/visits", {
          method: "POST",
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("unavailable");
        }
        const count = parseCount(await response.json());
        if (active) {
          setState(
            count === null ? { status: "unavailable" } : { status: "ready", count },
          );
        }
      } catch {
        if (active) {
          setState({ status: "unavailable" });
        }
      } finally {
        clearTimeout(timer);
      }
    })();

    return () => {
      active = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, []);

  return (
    <div
      data-visitor-counter
      className="flex flex-col gap-0.5 text-sm normal-case tracking-normal text-muted"
    >
      <p data-visitor-status>
        {state.status === "loading" && "Visits: loading"}
        {state.status === "ready" && `${countFormatter.format(state.count)} visits`}
        {state.status === "unavailable" && "Visits unavailable"}
      </p>
      <p data-visitor-caption className="text-xs text-muted/80">
        {CAPTION}
      </p>
    </div>
  );
}
