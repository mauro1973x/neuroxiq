import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { createLogger } from "../_shared/logger.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface TrackEventRequest {
  event: string;
  level?: "info" | "warn" | "error";
  category?: string;
  path?: string;
  message?: string;
  metadata?: Record<string, unknown>;
}

serve(async (req) => {
  const logger = createLogger("track-event", req);
  const { logStep, requestId } = logger;

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed", requestId }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    const authClient = createClient(supabaseUrl, anonKey);
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    let userId: string | null = null;

    if (token) {
      const { data } = await authClient.auth.getUser(token);
      userId = data.user?.id ?? null;
    }

    const payload = (await req.json()) as TrackEventRequest;
    const event = (payload.event || "").trim();
    const level = payload.level || "info";

    if (!event) {
      return new Response(JSON.stringify({ error: "event is required", requestId }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const safeMetadata = payload.metadata && typeof payload.metadata === "object" ? payload.metadata : {};
    const ua = req.headers.get("user-agent");

    const { error } = await adminClient.from("app_events").insert({
      user_id: userId,
      event_name: event.slice(0, 120),
      event_level: level,
      event_category: payload.category?.slice(0, 80) || "frontend",
      path: payload.path?.slice(0, 500) || null,
      message: payload.message?.slice(0, 1000) || null,
      metadata: {
        ...safeMetadata,
        requestId,
        userAgent: ua,
      },
      source: "web",
    });

    if (error) {
      logger.error("track_event_insert_failed", { message: error.message });
      return new Response(JSON.stringify({ error: error.message, requestId }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    logStep("track_event_inserted", { event, level, userId });

    return new Response(JSON.stringify({ ok: true, requestId }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("track_event_failed", { message });
    return new Response(JSON.stringify({ error: message, requestId }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
