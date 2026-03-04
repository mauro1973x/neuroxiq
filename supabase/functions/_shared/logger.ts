type LogLevel = "debug" | "info" | "warn" | "error";

interface LoggerContext {
  requestId: string;
  scope: string;
}

const sanitizeDetails = (value: unknown): unknown => {
  if (value === null || value === undefined) return value;
  if (typeof value === "string") {
    if (value.length > 500) return `${value.slice(0, 500)}...[truncated]`;
    return value;
  }
  if (Array.isArray(value)) return value.map((item) => sanitizeDetails(item));
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      const lower = k.toLowerCase();
      if (
        lower.includes("token") ||
        lower.includes("secret") ||
        lower.includes("password") ||
        lower.includes("authorization")
      ) {
        out[k] = "[redacted]";
      } else {
        out[k] = sanitizeDetails(v);
      }
    }
    return out;
  }
  return value;
};

export const createLogger = (scope: string, req?: Request) => {
  const requestId =
    req?.headers.get("x-request-id") ||
    req?.headers.get("x-correlation-id") ||
    crypto.randomUUID();

  const log = (level: LogLevel, event: string, details?: unknown) => {
    const payload = {
      ts: new Date().toISOString(),
      level,
      scope,
      event,
      requestId,
      details: sanitizeDetails(details),
    };
    console.log(JSON.stringify(payload));
  };

  return {
    requestId,
    log,
    logStep: (event: string, details?: unknown) => log("info", event, details),
    warn: (event: string, details?: unknown) => log("warn", event, details),
    error: (event: string, details?: unknown) => log("error", event, details),
  };
};

export type { LoggerContext };
