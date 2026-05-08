import React from "react";
import { Database, Sparkles } from "lucide-react";

const PROVIDER_LABELS = {
  groq: "Groq",
  gemini: "Gemini",
  canned: "Demo-Daten",
};

function formatLatency(ms) {
  if (typeof ms !== "number" || !Number.isFinite(ms) || ms < 0) return null;
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}

export default function DemoBadge({ source, latencyMs }) {
  if (!source) return null;
  const isCanned = source === "canned";
  const providerLabel = PROVIDER_LABELS[source] || source;
  const latency = formatLatency(latencyMs);

  if (isCanned) {
    return (
      <span
        role="status"
        aria-label="Demo-Daten — vorgefertigtes Beispiel"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-800 text-[11px] font-medium tracking-wide"
      >
        <Database className="w-3 h-3" aria-hidden="true" />
        Demo-Daten · vorgefertigt
      </span>
    );
  }

  return (
    <span
      role="status"
      aria-label={`Live-Verarbeitung über ${providerLabel}${latency ? ` in ${latency}` : ""}`}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 text-[11px] font-medium tracking-wide"
    >
      <Sparkles className="w-3 h-3" aria-hidden="true" />
      <span>Live · {providerLabel}</span>
      {latency && (
        <span className="font-mono-tight text-emerald-700/80">· {latency}</span>
      )}
    </span>
  );
}
