import React from "react";
import { AlertTriangle, AlertOctagon, Clock, RotateCcw } from "lucide-react";

const VARIANTS = {
  warning: {
    container:
      "bg-amber-50 border-amber-200 text-amber-900",
    iconWrap: "text-amber-700",
    button:
      "border-amber-300 text-amber-900 hover:bg-amber-100 focus-visible:outline-amber-600",
  },
  error: {
    container: "bg-red-50 border-red-200 text-red-900",
    iconWrap: "text-red-700",
    button:
      "border-red-300 text-red-900 hover:bg-red-100 focus-visible:outline-red-600",
  },
};

const CODE_MAP = {
  rate_limited: {
    title: "Zu viele Anfragen",
    description: "Bitte etwa 60 Sekunden warten und erneut versuchen.",
    icon: Clock,
    variant: "warning",
  },
  RATE_LIMIT: {
    title: "Zu viele Anfragen",
    description: "Bitte etwa 60 Sekunden warten und erneut versuchen.",
    icon: Clock,
    variant: "warning",
  },
  input_too_long: {
    title: "E-Mail-Inhalt zu lang",
    description: "Maximal 4.000 Zeichen pro Anfrage.",
    icon: AlertTriangle,
    variant: "warning",
  },
  INPUT_TOO_LONG: {
    title: "E-Mail-Inhalt zu lang",
    description: "Maximal 4.000 Zeichen pro Anfrage.",
    icon: AlertTriangle,
    variant: "warning",
  },
  forbidden_origin: {
    title: "Anfrage nicht zulässig",
    description: "Diese Domain ist für die Demo nicht freigeschaltet.",
    icon: AlertOctagon,
    variant: "error",
  },
  BAD_ORIGIN: {
    title: "Anfrage nicht zulässig",
    description: "Diese Domain ist für die Demo nicht freigeschaltet.",
    icon: AlertOctagon,
    variant: "error",
  },
};

const FALLBACK = {
  title: "Verarbeitung fehlgeschlagen",
  description: "Bitte erneut versuchen. Das Ereignis wurde protokolliert.",
  icon: AlertTriangle,
  variant: "error",
};

// `message` (Server-Originalnachricht) wird bewusst NICHT gerendert,
// damit keine API-/Stack-Details ins UI leaken (ELE-396 Akzeptanzkriterium 5xx).
// Der Param bleibt im Interface, damit Caller stabil sind.
// eslint-disable-next-line no-unused-vars
export default function ErrorBanner({ code, message, onRetry }) {
  const mapped = (code && CODE_MAP[code]) || FALLBACK;
  const variant = VARIANTS[mapped.variant];
  const Icon = mapped.icon;
  const showRetry = typeof onRetry === "function";

  return (
    <div
      role="alert"
      aria-live="polite"
      data-error-code={code || "GENERIC"}
      className={`flex flex-col sm:flex-row sm:items-start gap-3 p-4 border rounded-lg ${variant.container}`}
    >
      <div className={`flex-shrink-0 ${variant.iconWrap}`}>
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold leading-tight">{mapped.title}</div>
        <div className="text-xs leading-relaxed mt-0.5 break-words">
          {mapped.description}
        </div>
      </div>
      {showRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={`inline-flex items-center gap-1.5 self-start text-xs font-medium px-3 py-1.5 rounded border bg-white/60 hover:bg-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${variant.button}`}
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          Erneut versuchen
        </button>
      )}
    </div>
  );
}
