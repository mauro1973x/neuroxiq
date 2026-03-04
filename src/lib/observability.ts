import { supabase } from "@/integrations/supabase/client";

type EventLevel = "info" | "warn" | "error";

interface LogEventInput {
  event: string;
  level?: EventLevel;
  category?: string;
  path?: string;
  message?: string;
  metadata?: Record<string, unknown>;
}

const SESSION_ID_KEY = "nx_observability_session_id";
const MAX_TRACK_CALLS_PER_SESSION = 500;
const TRACK_COUNT_KEY = "nx_observability_track_count";

const getSessionId = (): string => {
  const existing = sessionStorage.getItem(SESSION_ID_KEY);
  if (existing) return existing;
  const created = crypto.randomUUID();
  sessionStorage.setItem(SESSION_ID_KEY, created);
  return created;
};

const canTrack = (): boolean => {
  const count = Number(sessionStorage.getItem(TRACK_COUNT_KEY) || "0");
  if (count >= MAX_TRACK_CALLS_PER_SESSION) return false;
  sessionStorage.setItem(TRACK_COUNT_KEY, String(count + 1));
  return true;
};

export const logClientEvent = async (input: LogEventInput): Promise<void> => {
  const payload: LogEventInput = {
    level: "info",
    category: "frontend",
    path: window.location.pathname,
    ...input,
    metadata: {
      sessionId: getSessionId(),
      ...input.metadata,
    },
  };

  if (import.meta.env.DEV) {
    const method = payload.level === "error" ? "error" : payload.level === "warn" ? "warn" : "log";
    // eslint-disable-next-line no-console
    console[method]("[OBS]", payload.event, payload);
  }

  if (!canTrack()) return;

  try {
    await supabase.functions.invoke("track-event", { body: payload });
  } catch {
    // Do not block UI if logging fails.
  }
};

export const initClientObservability = (): void => {
  window.addEventListener("error", (event) => {
    void logClientEvent({
      event: "window_error",
      level: "error",
      message: event.message,
      metadata: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason instanceof Error ? event.reason.message : String(event.reason);
    void logClientEvent({
      event: "unhandled_promise_rejection",
      level: "error",
      message: reason,
    });
  });
};
