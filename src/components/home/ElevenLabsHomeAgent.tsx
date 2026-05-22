"use client";

import {
  startTransition,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useKeyraSession } from "@/contexts/KeyraSessionContext";
import { resolveElevenLabsAgentId } from "@/lib/elevenLabsAgentConfig";

/**
 * ElevenLabs ConvAI widget — same agent as keyra.ie (`NEXT_PUBLIC_ELEVENLABS_AGENT_ID`).
 * @see https://elevenlabs.io/docs/agents-platform/customization/widget
 */

export const KEYRA_ELEVENLABS_CONVAI_WIDGET_ID = "keyra-elevenlabs-convai";

const ELEVENLABS_EMBED_SCRIPT_ID = "keyra-elevenlabs-convai-embed-script";
const ELEVENLABS_EMBED_SRC = "https://unpkg.com/@elevenlabs/convai-widget-embed";

export function openKeyraElevenLabsConvai() {
  if (typeof document === "undefined") return;
  const widget = document.getElementById(KEYRA_ELEVENLABS_CONVAI_WIDGET_ID);
  if (!widget) return;
  const candidates = ["open", "expand", "start", "startCall", "begin"] as const;
  for (const name of candidates) {
    try {
      const fn = (widget as unknown as Record<string, unknown>)[name];
      if (typeof fn === "function") {
        (fn as () => void).call(widget);
        return;
      }
    } catch {
      /* ignore */
    }
  }
  try {
    widget.scrollIntoView({ behavior: "smooth", block: "center" });
    widget.click();
  } catch {
    /* ignore */
  }
}

export function ElevenLabsHomeAgent() {
  const { user } = useKeyraSession();
  const agentId = useMemo(() => resolveElevenLabsAgentId(), []);
  const [embedReady, setEmbedReady] = useState(false);
  const widgetHostRef = useRef<HTMLElement | null>(null);

  const convaiMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!convaiMounted) return;

    const existing =
      (document.getElementById(ELEVENLABS_EMBED_SCRIPT_ID) as HTMLScriptElement | null) ??
      (document.querySelector(`script[src*="convai-widget-embed"]`) as HTMLScriptElement | null);

    if (existing) {
      if (!existing.id) existing.id = ELEVENLABS_EMBED_SCRIPT_ID;
      if (existing.dataset.loaded === "true") {
        startTransition(() => setEmbedReady(true));
        return;
      }
      const done = () => {
        existing.dataset.loaded = "true";
        startTransition(() => setEmbedReady(true));
      };
      existing.addEventListener("load", done, { once: true });
      existing.addEventListener("error", done, { once: true });
      return;
    }

    const s = document.createElement("script");
    s.id = ELEVENLABS_EMBED_SCRIPT_ID;
    s.async = true;
    s.src = ELEVENLABS_EMBED_SRC;
    s.onload = () => {
      s.dataset.loaded = "true";
      startTransition(() => setEmbedReady(true));
    };
    s.onerror = () => startTransition(() => setEmbedReady(true));
    document.body.appendChild(s);
  }, [convaiMounted]);

  const dynamicVariables = useMemo(
    () => ({
      employee_id: "",
      employee_name: user?.displayName?.trim() ?? "",
      phone_number: user?.phoneE164?.trim() ?? "",
      is_widget: "1",
    }),
    [user?.phoneE164, user?.displayName],
  );

  const dynamicVariablesJson = useMemo(
    () => JSON.stringify(dynamicVariables),
    [dynamicVariables],
  );

  useLayoutEffect(() => {
    if (!convaiMounted || !embedReady) return;
    const el =
      widgetHostRef.current ??
      (typeof document !== "undefined"
        ? document.getElementById(KEYRA_ELEVENLABS_CONVAI_WIDGET_ID)
        : null);
    if (!el) return;
    try {
      el.setAttribute("dynamic-variables", dynamicVariablesJson);
    } catch {
      /* ignore */
    }
  }, [convaiMounted, embedReady, dynamicVariablesJson]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development" || typeof window === "undefined") return;
    if (!convaiMounted || !embedReady) return;
    try {
      (
        window as Window & {
          __KEYRA_ELEVENLABS_CONVAI_DYNAMIC_VARS__?: Record<string, string>;
        }
      ).__KEYRA_ELEVENLABS_CONVAI_DYNAMIC_VARS__ = { ...dynamicVariables };
    } catch {
      /* ignore */
    }
  }, [convaiMounted, embedReady, dynamicVariables]);

  if (!convaiMounted || !embedReady) return null;

  return (
    <elevenlabs-convai
      ref={(el) => {
        widgetHostRef.current = el;
      }}
      id={KEYRA_ELEVENLABS_CONVAI_WIDGET_ID}
      agent-id={agentId}
      variant="floating"
      action-text="Talk to the agent"
      start-call-text="Start"
      end-call-text="End"
      expand-text="Open"
      listening-text="Listening…"
      speaking-text="Speaking…"
      dynamic-variables={dynamicVariablesJson}
    />
  );
}
