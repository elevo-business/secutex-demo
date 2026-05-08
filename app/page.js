"use client";

import React, { useState } from "react";
import {
  Mail, Sparkles, Database, Calculator, FileText, Paperclip, Send,
  CheckCircle2, AlertTriangle, Loader2, Inbox, Package,
  ChevronRight, Edit3, RotateCcw, Eye, ShieldCheck, Workflow, CircleDot
} from "lucide-react";
import DemoBadge from "./components/DemoBadge.jsx";
import ErrorBanner from "./components/ErrorBanner.jsx";
import { MAX_INPUT_CHARS } from "./lib/constants.js";

// ─────────────────────────────────────────────────────────────────────────
// PREISLISTE
// ─────────────────────────────────────────────────────────────────────────

const PRICELIST = [
  { artikel: "PUREA-SG100", name: "Polyurea SG-100", kategorie: "Polyurea", desc: "Spritzbeschichtung Standard, schnellhärtend, Shore D 50", preis: 22.50, einheit: "EUR/kg", lieferzeit: 5, anwendung: "Korrosionsschutz, Behälterauskleidung" },
  { artikel: "PUREA-HT120", name: "Polyurea HT-120", kategorie: "Polyurea", desc: "Hochtemperaturbeständig bis 150°C, Shore D 55", preis: 28.90, einheit: "EUR/kg", lieferzeit: 7, anwendung: "Heiße Industrieanlagen, Rohrleitungen" },
  { artikel: "PUREA-FC80", name: "Polyurea FC-80 Food", kategorie: "Polyurea", desc: "Lebensmittelecht nach EU 10/2011, geruchsneutral", preis: 34.50, einheit: "EUR/kg", lieferzeit: 10, anwendung: "Trinkwasser, Lebensmittel" },
  { artikel: "PUREA-CR150", name: "Polyurea CR-150", kategorie: "Polyurea", desc: "Chemikalienresistent gegen Säuren und Laugen", preis: 31.20, einheit: "EUR/kg", lieferzeit: 7, anwendung: "Chemische Industrie, Auffangwannen" },
  { artikel: "PUREA-UV200", name: "Polyurea UV-200", kategorie: "Polyurea", desc: "UV-stabil, aliphatisch, farbecht", preis: 38.00, einheit: "EUR/kg", lieferzeit: 10, anwendung: "Außenbereich, Dächer" },
  { artikel: "PUREA-FR110", name: "Polyurea FR-110", kategorie: "Polyurea", desc: "Flammhemmend nach DIN EN 13501-1 B-s1,d0", preis: 32.40, einheit: "EUR/kg", lieferzeit: 10, anwendung: "Tunnel, Brandschutz, ÖPNV" },
  { artikel: "PURFLEX-S400", name: "Polyurethan S-400", kategorie: "Polyurethan", desc: "PU-Bodenbeschichtung Standard, selbstverlaufend", preis: 12.80, einheit: "EUR/kg", lieferzeit: 3, anwendung: "Industrieböden, Lager, Werkstätten" },
  { artikel: "PURFLEX-H600", name: "Polyurethan H-600", kategorie: "Polyurethan", desc: "Hartbeschichtung, abriebfest, Shore D 75", preis: 16.40, einheit: "EUR/kg", lieferzeit: 5, anwendung: "Mechanisch belastete Böden" },
  { artikel: "PURFLEX-EL250", name: "Polyurethan EL-250", kategorie: "Polyurethan", desc: "Elastisch, 250 % Dehnung, rissüberbrückend", preis: 18.90, einheit: "EUR/kg", lieferzeit: 5, anwendung: "Parkdecks, Brücken" },
  { artikel: "PUR-VERS-V100", name: "PU-Versiegelung V-100", kategorie: "Versiegelung", desc: "Klare 2K-Versiegelung, hochglänzend", preis: 15.20, einheit: "EUR/kg", lieferzeit: 3, anwendung: "Schutzversiegelung" },
  { artikel: "PUR-VERS-V200", name: "PU-Versiegelung V-200", kategorie: "Versiegelung", desc: "Farbige 2K-Versiegelung, RAL nach Wahl", preis: 17.80, einheit: "EUR/kg", lieferzeit: 7, anwendung: "Farbgebung, Markierungen" },
  { artikel: "PUR-PRIMER-P100", name: "PU-Primer P-100", kategorie: "Primer", desc: "Haftvermittler für mineralische Untergründe", preis: 11.40, einheit: "EUR/kg", lieferzeit: 3, anwendung: "Vorbehandlung Beton, Estrich" },
  { artikel: "PUR-PRIMER-P200", name: "PU-Primer P-200 Metall", kategorie: "Primer", desc: "Haftvermittler für Stahl und Metallflächen", preis: 14.60, einheit: "EUR/kg", lieferzeit: 5, anwendung: "Vorbehandlung Stahl, Metallkonstruktionen" },
];

// ─────────────────────────────────────────────────────────────────────────
// BEISPIEL-INBOX
// ─────────────────────────────────────────────────────────────────────────

const INBOX = [
  {
    id: "m1", time: "08:14", fromName: "Thomas Müller", fromEmail: "t.mueller@chemtec-leverkusen.de",
    firma: "Chemtec Industries GmbH",
    subject: "Anfrage Polyurea-Beschichtung Industrieboden",
    body: `Sehr geehrte Damen und Herren,

für unser neues Werk in Leverkusen suchen wir eine chemikalienbeständige Bodenbeschichtung. Konkret benötigen wir Polyurea für ca. 180 m² Industrieboden, der regelmäßig mit Säuren und Laugen in Kontakt kommt. Schichtdicke 2 mm, das wären rund 250 kg Material.

Bitte um Angebot, Lieferung idealerweise in 4–5 Wochen.

Mit freundlichen Grüßen
Thomas Müller
Chemtec Industries GmbH
Bayer-Allee 12
51368 Leverkusen`,
  },
  {
    id: "m2", time: "08:31", fromName: "Dr. Klaus Weber", fromEmail: "k.weber@bauplanung-stuttgart.de",
    firma: "Bauplanung Weber GmbH",
    subject: "Angebot Dachbeschichtung 450 m²",
    body: `Guten Tag,

für die Sanierung eines Flachdachs (ca. 450 m²) suchen wir eine UV-stabile Polyurea-Beschichtung. Menge wäre etwa 600 kg. Wann könnten Sie liefern?

Mit freundlichen Grüßen
Dr. K. Weber
Bauplanung Weber GmbH
Hauptstraße 88
70173 Stuttgart`,
  },
  {
    id: "m3", time: "09:02", fromName: "Anna Hofmeier", fromEmail: "a.hofmeier@molkerei-hofmeier.de",
    firma: "Molkerei Hofmeier KG",
    subject: "Tankbeschichtung lebensmittelecht",
    body: `Sehr geehrte Damen und Herren,

wir betreiben eine Molkerei und müssen einen Lagertank (innen) neu beschichten. Es muss lebensmittelecht sein. Innenfläche ca. 95 m², geschätzter Bedarf 130 kg.

Bitte um Angebot.

Mit freundlichen Grüßen
Anna Hofmeier
Molkerei Hofmeier KG
Dorfstraße 4
84034 Landshut`,
  },
  {
    id: "m4", time: "09:18", fromName: "Markus Schneider", fromEmail: "schneider@logistik-ost.de",
    firma: "Logistik Ost GmbH",
    subject: "PU-Bodenbeschichtung Lagerhalle",
    body: `Hallo,

für unsere neue Lagerhalle in Frankfurt/Oder (ca. 1.200 m²) benötigen wir eine robuste PU-Bodenbeschichtung Standard. Geschätzter Bedarf ca. 800 kg. Wann können Sie liefern?

Markus Schneider
Logistik Ost GmbH
Industriestraße 22
15230 Frankfurt/Oder`,
  },
  {
    id: "m5", time: "10:05", fromName: "Peter Berger", fromEmail: "p.berger@tunnel-bau-ag.at",
    firma: "Tunnelbau AG",
    subject: "Brandschutzbeschichtung – flammhemmende Polyurea",
    body: `Sehr geehrte Damen und Herren,

im Rahmen einer Tunnelsanierung benötigen wir eine flammhemmende Polyurea-Beschichtung nach DIN EN 13501-1. Bedarf ca. 400 kg.

Bitte um zeitnahes Angebot, da Vergabe in 2 Wochen ansteht.

Peter Berger
Tunnelbau AG
Wienerstraße 145
1230 Wien`,
  },
  {
    id: "m6", time: "11:13", fromName: "K. Wagner", fromEmail: "info@wagner-bau.de",
    firma: "Wagner Bau",
    subject: "brauche angebot",
    body: `hi, brauchen 50 kg von eurem zeug für nen boden bei uns. macht mal angebot.

gruss`,
  },
];

const PIPELINE = [
  { id: "receive", label: "E-Mail empfangen", icon: Inbox },
  { id: "extract", label: "Claude extrahiert Daten", icon: Sparkles },
  { id: "lookup", label: "Preisliste durchsuchen", icon: Database },
  { id: "calc", label: "Mengen × Preis berechnen", icon: Calculator },
  { id: "fill", label: "Word-Vorlage befüllen", icon: FileText },
  { id: "attach", label: "Datenblatt anhängen", icon: Paperclip },
  { id: "draft", label: "Outlook-Entwurf erstellen", icon: Send },
];

const fmtEUR = (n) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Server-seitiger API-Aufruf ──────────────────────────────────────────
// Liefert { data, _meta } gemäß Adapter-Vertrag (siehe app/lib/llm/index.js).
// Wirft im Fehlerfall einen Error mit zusätzlichem .code (Backend-Fehlercode).
async function callExtract({ subject, from, body, mailId }) {
  let response;
  try {
    response = await fetch("/api/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, from, body, mailId }),
    });
  } catch (networkErr) {
    const err = new Error("Netzwerkfehler – Server nicht erreichbar.");
    err.code = "network_error";
    throw err;
  }

  if (!response.ok) {
    let parsed = null;
    try {
      parsed = await response.json();
    } catch {}
    const code = parsed?.code || `http_${response.status}`;
    const message = parsed?.error || `HTTP ${response.status}`;
    const err = new Error(message);
    err.code = code;
    err.status = response.status;
    throw err;
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    const err = new Error("Antwort konnte nicht gelesen werden.");
    err.code = "invalid_response";
    throw err;
  }

  return {
    data: payload?.data ?? payload,
    _meta: payload?._meta ?? null,
  };
}

function findProduct(suggestion, kategorie) {
  if (suggestion) {
    const exact = PRICELIST.find((p) => p.artikel === suggestion);
    if (exact) return exact;
  }
  if (kategorie) {
    const matches = PRICELIST.filter((p) => p.kategorie.toLowerCase() === kategorie.toLowerCase());
    if (matches.length === 1) return matches[0];
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────
// HAUPTKOMPONENTE
// ─────────────────────────────────────────────────────────────────────────

export default function Demo() {
  const [mode, setMode] = useState("inbox");
  const [selectedId, setSelectedId] = useState(INBOX[0].id);
  const [customMail, setCustomMail] = useState({ fromEmail: "", fromName: "", subject: "", body: "" });

  const [running, setRunning] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const selectedMail = INBOX.find((m) => m.id === selectedId);
  const currentMail = mode === "inbox" ? selectedMail : {
    fromEmail: customMail.fromEmail || "kunde@beispiel.de",
    fromName: customMail.fromName || "",
    firma: "",
    subject: customMail.subject || "(ohne Betreff)",
    body: customMail.body,
    time: "—",
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setPipelineStep(-1);
    setRunning(false);
  };

  const selectMail = (id) => { setSelectedId(id); reset(); };
  const setMailMode = (m) => { setMode(m); reset(); };

  const run = async () => {
    if (!currentMail.body || !currentMail.body.trim()) return;
    reset();
    setRunning(true);
    try {
      setPipelineStep(0); await sleep(250);
      setPipelineStep(1);
      const { data: ki, _meta } = await callExtract({
        subject: currentMail.subject,
        from: `${currentMail.fromName || ""} <${currentMail.fromEmail || ""}>`.trim(),
        body: currentMail.body,
        mailId: mode === "inbox" ? selectedId : undefined,
      });

      if (ki.confidence < 0.75) {
        setResult({ eskalation: true, ki, _meta });
        setRunning(false); setPipelineStep(-1); return;
      }

      const pos = ki.positionen?.[0];
      if (!pos) {
        setResult({ eskalation: true, ki: { ...ki, begruendung_kurz: "Keine Position erkannt." }, _meta });
        setRunning(false); setPipelineStep(-1); return;
      }

      setPipelineStep(2); await sleep(450);
      const product = findProduct(pos.artikelnummer_vorschlag, pos.kategorie);
      if (!product) {
        setResult({ eskalation: true, ki: { ...ki, begruendung_kurz: "Produkt nicht eindeutig zuordenbar – manuelle Prüfung notwendig." }, _meta });
        setRunning(false); setPipelineStep(-1); return;
      }

      setPipelineStep(3); await sleep(300);
      const menge = pos.menge || 0;
      const netto = menge * product.preis;
      const mwst = netto * 0.19;
      const brutto = netto + mwst;

      setPipelineStep(4); await sleep(450);
      setPipelineStep(5); await sleep(350);
      setPipelineStep(6); await sleep(300);

      const today = new Date();
      const angNr = `ANG-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      setResult({
        eskalation: false, ki, produkt: product, menge,
        einheit: pos.einheit || "kg", einzelpreis: product.preis,
        netto, mwst, brutto, angebotsnummer: angNr,
        datum: today.toLocaleDateString("de-DE"),
        _meta,
      });
      setPipelineStep(-1);
    } catch (e) {
      setError({
        code: e.code || "unknown",
        message: e.message || "Unbekannter Fehler bei der Verarbeitung",
      });
      setPipelineStep(-1);
    } finally {
      setRunning(false);
    }
  };

  const customBodyLength = customMail.body?.length || 0;
  const customBodyTooLong = customBodyLength > MAX_INPUT_CHARS;
  const canRun = mode === "inbox"
    ? !!selectedMail
    : !!customMail.body.trim() && !customBodyTooLong;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-[1400px] mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-md bg-stone-900 text-white flex items-center justify-center">
              <Workflow className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-stone-500 mb-0.5">Funktionsdemo</div>
              <h1 className="text-base font-semibold leading-tight">Angebotsbearbeitung — Polyurea / Polyurethan</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <CircleDot className="w-3 h-3 text-emerald-500" />
            <span>Live · echte LLM-Verarbeitung</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="mb-6 text-sm text-stone-600 leading-relaxed max-w-3xl">
          Diese Demo zeigt den realen Verarbeitungsweg: jede E-Mail wird tatsächlich durch ein
          LLM gelesen und in strukturierte Angebotsdaten überführt. Die Preisliste, die Word-Vorlage
          und die Datenblatt-Anbindung entsprechen dem späteren Produktivsystem in Make.
        </div>

        <div className="grid grid-cols-12 gap-5 mb-8">
          {/* LINKS: Inbox / Custom-Toggle */}
          <aside className="col-span-12 lg:col-span-3 bg-white border border-stone-200 rounded-lg overflow-hidden self-start">
            <div className="border-b border-stone-200">
              <div className="grid grid-cols-2">
                <button
                  onClick={() => setMailMode("inbox")}
                  className={`text-xs font-medium py-3 px-3 transition ${
                    mode === "inbox" ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <Inbox className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                  Beispiele
                </button>
                <button
                  onClick={() => setMailMode("custom")}
                  className={`text-xs font-medium py-3 px-3 transition ${
                    mode === "custom" ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                  Eigene Anfrage
                </button>
              </div>
            </div>

            {mode === "inbox" ? (
              <div className="max-h-[640px] overflow-y-auto scrollbar-thin">
                {INBOX.map((m) => {
                  const isActive = m.id === selectedId;
                  return (
                    <button
                      key={m.id}
                      onClick={() => selectMail(m.id)}
                      className={`w-full text-left p-3 border-b border-stone-100 transition ${
                        isActive ? "bg-amber-50 border-l-2 border-l-amber-500" : "hover:bg-stone-50"
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-2 mb-0.5">
                        <span className="text-[13px] font-semibold text-stone-900 truncate">{m.fromName}</span>
                        <span className="text-[10px] text-stone-500 flex-shrink-0">{m.time}</span>
                      </div>
                      <div className="text-[12px] text-stone-700 truncate font-medium">{m.subject}</div>
                      <div className="text-[11px] text-stone-500 truncate mt-0.5">{m.body.slice(0, 60)}…</div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 space-y-3">
                <div className="text-xs text-stone-600 leading-relaxed mb-2 pb-3 border-b border-stone-100">
                  Fügen Sie eine echte Anfrage aus Ihrem Posteingang ein — sie wird live durch Claude verarbeitet.
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-stone-500 mb-1 block">Absender (E-Mail)</label>
                  <input
                    type="text"
                    value={customMail.fromEmail}
                    onChange={(e) => setCustomMail({ ...customMail, fromEmail: e.target.value })}
                    placeholder="kunde@firma.de"
                    className="w-full px-2.5 py-1.5 text-sm border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                    disabled={running}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-stone-500 mb-1 block">Betreff</label>
                  <input
                    type="text"
                    value={customMail.subject}
                    onChange={(e) => setCustomMail({ ...customMail, subject: e.target.value })}
                    placeholder="Anfrage Beschichtung..."
                    className="w-full px-2.5 py-1.5 text-sm border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                    disabled={running}
                  />
                </div>
                <div>
                  <label
                    htmlFor="custom-mail-body"
                    className="text-[10px] uppercase tracking-wider text-stone-500 mb-1 block"
                  >
                    Nachricht
                  </label>
                  <textarea
                    id="custom-mail-body"
                    value={customMail.body}
                    onChange={(e) => setCustomMail({ ...customMail, body: e.target.value })}
                    rows={12}
                    placeholder="Sehr geehrte Damen und Herren..."
                    maxLength={MAX_INPUT_CHARS + 200}
                    aria-invalid={customBodyTooLong || undefined}
                    aria-describedby="custom-mail-counter"
                    className={`w-full px-2.5 py-2 text-sm border rounded focus:outline-none resize-none transition-colors ${
                      customBodyTooLong
                        ? "border-red-400 focus:border-red-500"
                        : "border-stone-300 focus:border-stone-900"
                    }`}
                    disabled={running}
                  />
                  <div
                    id="custom-mail-counter"
                    className="mt-1 flex items-center justify-between text-[11px]"
                  >
                    <span
                      className={
                        customBodyTooLong ? "text-red-600 font-medium" : "text-stone-400"
                      }
                    >
                      {customBodyTooLong ? "E-Mail zu lang" : ""}
                    </span>
                    <span
                      className={`font-mono-tight ${
                        customBodyTooLong ? "text-red-600 font-medium" : "text-stone-400"
                      }`}
                      aria-live="polite"
                    >
                      {customBodyLength.toLocaleString("de-DE")} / {MAX_INPUT_CHARS.toLocaleString("de-DE")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* MITTE: Mail */}
          <section className="col-span-12 lg:col-span-5 bg-white border border-stone-200 rounded-lg overflow-hidden self-start">
            <div className="border-b border-stone-200 px-5 py-3 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-stone-500">
                <Mail className="w-3.5 h-3.5" />
                {mode === "inbox" ? "Eingegangene Anfrage" : "Vorschau Ihrer Anfrage"}
              </div>
              <div className="flex items-center gap-2">
                {result && (
                  <button onClick={reset} className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1">
                    <RotateCcw className="w-3 h-3" /> Zurücksetzen
                  </button>
                )}
                <button
                  onClick={run}
                  disabled={running || !canRun}
                  className="bg-stone-900 text-white text-xs font-medium px-4 py-1.5 rounded flex items-center gap-1.5 hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  {running ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Verarbeitung…</>
                  ) : (
                    <><Sparkles className="w-3.5 h-3.5" /> Anfrage verarbeiten</>
                  )}
                </button>
              </div>
            </div>

            <div className="p-5">
              <div className="space-y-2 mb-4 text-sm">
                <FieldRow label="Von" value={`${currentMail.fromName ? currentMail.fromName + " " : ""}<${currentMail.fromEmail}>`} mono />
                {currentMail.firma && <FieldRow label="Firma" value={currentMail.firma} />}
                <FieldRow label="Betreff" value={currentMail.subject} bold />
                <FieldRow label="Eingang" value={currentMail.time} />
              </div>
              <div className="border-t border-stone-200 pt-4">
                <pre className="font-serif-display text-[15px] text-stone-800 whitespace-pre-wrap leading-relaxed">
{currentMail.body || (mode === "custom" ? "(Bitte Nachricht links eingeben)" : "")}
                </pre>
              </div>
            </div>
          </section>

          {/* RECHTS: Pipeline */}
          <aside className="col-span-12 lg:col-span-4 self-start">
            <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
              <div className="border-b border-stone-200 px-5 py-3 bg-stone-50">
                <div className="text-xs uppercase tracking-wider text-stone-500 flex items-center gap-2">
                  <Workflow className="w-3.5 h-3.5" />
                  Verarbeitungs-Pipeline
                </div>
              </div>

              <ol className="p-3">
                {PIPELINE.map((step, i) => {
                  const Icon = step.icon;
                  const isActive = pipelineStep === i;
                  const isDone = result && !result.eskalation && !running && pipelineStep === -1
                    ? true
                    : pipelineStep > i;
                  const skipped = result?.eskalation && i > 1;
                  return (
                    <li
                      key={step.id}
                      className={`flex items-center gap-3 px-3 py-2 rounded transition ${
                        isActive ? "bg-amber-50" : ""
                      } ${skipped ? "opacity-30" : ""}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition ${
                          isActive
                            ? "bg-amber-500 text-white"
                            : isDone && !skipped
                            ? "bg-emerald-600 text-white"
                            : "bg-stone-100 text-stone-400"
                        }`}
                      >
                        {isActive ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : isDone && !skipped ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Icon className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span
                        className={`text-sm flex-1 ${
                          isActive ? "text-stone-900 font-medium" : isDone && !skipped ? "text-stone-700" : "text-stone-500"
                        }`}
                      >
                        {step.label}
                      </span>
                      {i === 1 && (isActive || (isDone && !skipped)) && (
                        <span className="text-[10px] font-mono-tight text-stone-400">
                          {result?._meta?.source === "canned"
                            ? "Demo-Daten"
                            : result?._meta?.source === "groq"
                            ? "Groq"
                            : result?._meta?.source === "gemini"
                            ? "Gemini"
                            : "LLM"}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>

              {error && (
                <div className="mx-3 mb-3">
                  <ErrorBanner
                    code={error.code}
                    message={error.message}
                    onRetry={running ? undefined : run}
                  />
                </div>
              )}
            </div>

            <div className="mt-3 p-4 bg-stone-100 border border-stone-200 rounded-lg text-xs text-stone-600 leading-relaxed">
              <div className="font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Was diese Demo zeigt
              </div>
              Identische Logik wie das Make-Szenario im Live-Betrieb: KI-Extraktion, Preislisten-Lookup,
              automatische Berechnung, Word-Vorlage, Datenblatt-Anhang, Outlook-Entwurf. Bei niedriger
              Confidence wird eskaliert — der Sachbearbeiter prüft manuell.
            </div>
          </aside>
        </div>

        {/* ESKALATION */}
        {result && result.eskalation && (
          <div className="bg-white border-l-4 border-amber-500 border-y border-r border-stone-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-3 mb-2">
                  <h2 className="text-lg font-semibold">Manuelle Prüfung erforderlich</h2>
                  <span className="text-xs font-mono-tight text-stone-500">
                    Konfidenz: {Math.round((result.ki.confidence || 0) * 100)} %
                  </span>
                  {result._meta?.source && (
                    <DemoBadge source={result._meta.source} latencyMs={result._meta.latencyMs} />
                  )}
                </div>
                <p className="text-sm text-stone-700 mb-3 leading-relaxed">
                  Das System hat erkannt, dass die Anfrage nicht eindeutig zugeordnet werden kann.
                  Statt ein möglicherweise falsches Angebot zu erzeugen, wird die E-Mail an den
                  zuständigen Sachbearbeiter weitergeleitet — mit dem Hinweis auf die Unklarheit.
                </p>
                <div className="bg-stone-50 border border-stone-200 rounded p-3 text-sm text-stone-700">
                  <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">Begründung</div>
                  <div className="font-serif-display italic">{result.ki.begruendung_kurz}</div>
                </div>
                <div className="mt-3 text-xs text-stone-600">
                  → Anfrage wird ins Postfach des Sachbearbeiters verschoben, gekennzeichnet als „Manuell prüfen".
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ERGEBNIS */}
        {result && !result.eskalation && (
          <div className="space-y-5 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <div className="text-xs uppercase tracking-[0.18em] text-stone-500">Ergebnis der Verarbeitung</div>
              {result._meta?.source && (
                <DemoBadge source={result._meta.source} latencyMs={result._meta.latencyMs} />
              )}
            </div>

            <div className="grid grid-cols-12 gap-5">
              <Card title="Aus der E-Mail erkannt" icon={Sparkles} confidence={result.ki.confidence}>
                <DataRow label="Firma" value={result.ki.kunde?.firma} />
                <DataRow label="Ansprechpartner" value={[result.ki.kunde?.anrede, result.ki.kunde?.name].filter(Boolean).join(" ")} />
                <DataRow label="E-Mail" value={result.ki.kunde?.email} mono />
                <DataRow label="Adresse" value={[result.ki.kunde?.strasse, result.ki.kunde?.plz_ort].filter(Boolean).join(", ")} />
                <Divider />
                <DataRow label="Anwendungsfall" value={result.ki.anwendungsfall} />
                <DataRow label="Produktwunsch" value={result.ki.positionen?.[0]?.produktbeschreibung_kunde} />
                <DataRow label="Menge laut Anfrage" value={`${result.menge} ${result.einheit}`} />
                {result.ki.sonderwuensche && <DataRow label="Sonderwunsch" value={result.ki.sonderwuensche} />}
              </Card>

              <Card title="Aus Preisliste gefunden" icon={Database}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div className="flex-1">
                    <div className="font-serif-display text-xl leading-tight">{result.produkt.name}</div>
                    <div className="font-mono-tight text-[11px] text-stone-500 mt-0.5">{result.produkt.artikel}</div>
                  </div>
                </div>
                <p className="text-sm text-stone-700 mb-3 leading-relaxed">{result.produkt.desc}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <KV label="Kategorie" value={result.produkt.kategorie} />
                  <KV label="Lieferzeit" value={`${result.produkt.lieferzeit} Werktage`} />
                  <KV label="Anwendung" value={result.produkt.anwendung} fullSpan />
                </div>
                <Divider />
                <DataRow label="Listenpreis" value={fmtEUR(result.produkt.preis) + " / kg"} mono />
                <DataRow label="Datenblatt" value={`SharePoint: ${result.produkt.artikel}.pdf`} mono />
              </Card>

              <Card title="Berechnung" icon={Calculator}>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-stone-600">Menge</span>
                    <span className="tnum">{result.menge} {result.einheit}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-600">Einzelpreis</span>
                    <span className="tnum font-mono-tight text-[13px]">{fmtEUR(result.einzelpreis)}</span>
                  </div>
                  <Divider />
                  <div className="flex justify-between py-1">
                    <span className="text-stone-600">Zwischensumme netto</span>
                    <span className="tnum font-medium">{fmtEUR(result.netto)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-600">19 % MwSt.</span>
                    <span className="tnum">{fmtEUR(result.mwst)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-stone-200 mt-2">
                    <span className="font-semibold">Gesamt brutto</span>
                    <span className="tnum font-serif-display text-xl text-stone-900">{fmtEUR(result.brutto)}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Outlook-Entwurf */}
            <div className="bg-white border border-stone-300 rounded-lg overflow-hidden">
              <div className="bg-[#0f6cbd] text-white px-5 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Send className="w-4 h-4" />
                  <span className="font-medium">Outlook · Entwurf bereit zur Prüfung</span>
                </div>
                <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded">Im Ordner „Entwürfe"</span>
              </div>

              <div className="p-5 border-b border-stone-200 bg-stone-50">
                <div className="grid grid-cols-[100px_1fr] gap-y-1.5 text-sm">
                  <span className="text-stone-500">An</span>
                  <span className="font-mono-tight text-[13px]">{result.ki.kunde?.email || "—"}</span>
                  <span className="text-stone-500">Cc</span>
                  <span className="font-mono-tight text-[13px] text-stone-600">[Sachbearbeiter:in]</span>
                  <span className="text-stone-500">Betreff</span>
                  <span className="font-medium">Angebot {result.angebotsnummer} – {result.produkt.name}</span>
                  <span className="text-stone-500">Anhänge</span>
                  <span className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 bg-white border border-stone-300 px-2 py-1 rounded text-[12px]">
                      <FileText className="w-3 h-3 text-blue-700" /> Angebot_{result.angebotsnummer}.docx
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white border border-stone-300 px-2 py-1 rounded text-[12px]">
                      <Paperclip className="w-3 h-3 text-stone-600" /> {result.produkt.artikel}.pdf
                    </span>
                  </span>
                </div>
              </div>

              <div className="p-10 max-w-3xl mx-auto font-serif-display">
                <div className="border-b-2 border-stone-300 pb-3 mb-8 text-[11px] text-stone-500" style={{ fontFamily: "Inter" }}>
                  [Firmenname] · [Strasse] · [PLZ Ort]
                </div>
                <div className="text-[14px] mb-1">{result.ki.kunde?.firma}</div>
                <div className="text-[14px] mb-1">{[result.ki.kunde?.anrede, result.ki.kunde?.name].filter(Boolean).join(" ")}</div>
                <div className="text-[14px] mb-1">{result.ki.kunde?.strasse}</div>
                <div className="text-[14px] mb-10">{result.ki.kunde?.plz_ort}</div>

                <div className="text-right text-[13px] text-stone-600 mb-8" style={{ fontFamily: "Inter" }}>
                  Datum: {result.datum} &nbsp;&nbsp; Angebot: <span className="font-mono-tight">{result.angebotsnummer}</span>
                </div>

                <h2 className="text-3xl font-medium text-[#1f4e79] mb-5">Angebot</h2>

                <p className="text-[14px] mb-3">
                  {[result.ki.kunde?.anrede, result.ki.kunde?.name].filter(Boolean).join(" ")},
                </p>
                <p className="text-[14px] leading-relaxed mb-7">
                  vielen Dank für Ihre Anfrage zum Anwendungsfall <em>{result.ki.anwendungsfall}</em>. Gerne unterbreiten wir Ihnen folgendes Angebot:
                </p>

                <table className="w-full text-[13px] mb-6 border-collapse" style={{ fontFamily: "Inter" }}>
                  <thead>
                    <tr className="bg-[#1f4e79] text-white text-[11px]">
                      <th className="text-left p-2 font-medium w-12">Pos.</th>
                      <th className="text-left p-2 font-medium">Art.-Nr.</th>
                      <th className="text-left p-2 font-medium">Bezeichnung</th>
                      <th className="text-right p-2 font-medium">Menge</th>
                      <th className="text-right p-2 font-medium">Einzelpreis</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-stone-200">
                      <td className="p-2 align-top">1</td>
                      <td className="p-2 align-top font-mono-tight text-[11px]">{result.produkt.artikel}</td>
                      <td className="p-2 align-top">
                        <div className="font-medium">{result.produkt.name}</div>
                        <div className="text-[11px] text-stone-500 italic">{result.produkt.desc}</div>
                      </td>
                      <td className="p-2 align-top text-right tnum">{result.menge} {result.einheit}</td>
                      <td className="p-2 align-top text-right tnum">{fmtEUR(result.einzelpreis)}</td>
                    </tr>
                  </tbody>
                </table>

                <table className="text-[13px] mb-6 ml-auto" style={{ width: "60%", fontFamily: "Inter" }}>
                  <tbody>
                    <tr className="bg-stone-100">
                      <td className="text-right p-2">Zwischensumme netto</td>
                      <td className="text-right p-2 tnum w-32">{fmtEUR(result.netto)}</td>
                    </tr>
                    <tr>
                      <td className="text-right p-2">zzgl. 19 % MwSt.</td>
                      <td className="text-right p-2 tnum">{fmtEUR(result.mwst)}</td>
                    </tr>
                    <tr className="bg-[#1f4e79] text-white">
                      <td className="text-right p-2 font-medium">Gesamtbetrag brutto</td>
                      <td className="text-right p-2 font-medium tnum">{fmtEUR(result.brutto)}</td>
                    </tr>
                  </tbody>
                </table>

                <h3 className="text-lg font-medium text-[#1f4e79] mb-2 mt-8">Konditionen</h3>
                <div className="text-[13px] space-y-1 mb-6" style={{ fontFamily: "Inter" }}>
                  <div><strong>Lieferzeit:</strong> {result.produkt.lieferzeit} Werktage nach Auftragseingang</div>
                  <div><strong>Lieferung:</strong> frei Haus innerhalb Deutschland ab 500 € Nettowert</div>
                  <div><strong>Zahlung:</strong> 30 Tage netto nach Rechnungsstellung</div>
                  <div><strong>Gültigkeit:</strong> 30 Tage</div>
                  <div><strong>Anhang:</strong> Technisches Datenblatt zu {result.produkt.artikel}</div>
                </div>

                {result.ki.sonderwuensche && (
                  <p className="text-[13px] mb-5 italic">Hinweis zu Ihren Sonderwünschen: {result.ki.sonderwuensche}</p>
                )}

                <p className="text-[14px] mb-8">
                  Für Rückfragen stehen wir Ihnen gerne zur Verfügung. Wir freuen uns auf Ihren Auftrag.
                </p>

                <p className="text-[14px]">Mit freundlichen Grüßen</p>
                <p className="text-[12px] mt-6 text-stone-500" style={{ fontFamily: "Inter" }}>[Sachbearbeiter:in] · [Telefon] · [E-Mail]</p>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg p-6">
              <div className="text-xs uppercase tracking-[0.18em] text-stone-500 mb-3">Verbleibender manueller Anteil</div>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <ManualStep n="1" title="Sachprüfung">
                  Sachbearbeiter:in öffnet den Outlook-Entwurf, prüft Produkt, Menge, Preis und Adresse.
                </ManualStep>
                <ManualStep n="2" title="Individualisierung">
                  Bei Bedarf Sonderkondition, Mengenrabatt oder zusätzliche Position eintragen.
                </ManualStep>
                <ManualStep n="3" title="Versand">
                  Auf „Senden" klicken. Der Vorgang wird im System abgelegt.
                </ManualStep>
              </div>
            </div>
          </div>
        )}

        {/* AUFTEILUNG */}
        <section className="grid md:grid-cols-2 gap-5 mb-8">
          <div className="bg-white border border-stone-200 rounded-lg p-6">
            <div className="text-xs uppercase tracking-[0.18em] text-stone-500 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Make übernimmt automatisch
            </div>
            <ul className="space-y-2 text-sm">
              {[
                "E-Mail aus Outlook lesen und filtern",
                "Inhalt durch Claude / GPT extrahieren (Kunde, Produkt, Menge, Anwendung, Sonderwünsche)",
                "Preis und Artikeldaten aus Excel-Preisliste abrufen",
                "Word-Angebotsvorlage mit Variablen befüllen",
                "Technisches Datenblatt aus SharePoint anhängen",
                "Outlook-Entwurf erstellen — fertig zur manuellen Prüfung",
              ].map((t, i) => (
                <li key={i} className="flex gap-2">
                  <ChevronRight className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-stone-200 rounded-lg p-6">
            <div className="text-xs uppercase tracking-[0.18em] text-stone-500 mb-3 flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-amber-600" />
              Beim Sachbearbeiter bleibt
            </div>
            <ul className="space-y-2 text-sm">
              {[
                "Sonderpreise und projektabhängige Konditionen ergänzen",
                "Technische Sonderlösungen bewerten",
                "Angebot kurz inhaltlich prüfen und freigeben",
                "Manueller Versand der E-Mail",
                "Rückfragen des Kunden beantworten",
                "Eskalierte Anfragen (zu vage / mehrdeutig) bearbeiten",
              ].map((t, i) => (
                <li key={i} className="flex gap-2">
                  <ChevronRight className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ECKDATEN */}
        <section className="bg-white border border-stone-200 rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
            <h2 className="text-base font-semibold">Technische Eckdaten</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 p-6 text-sm">
            <KeyValue k="Plattform" v="Make (vormals Integromat) — Cloud-Workflow" />
            <KeyValue k="KI-Modell" v="Claude Sonnet 4.5 oder GPT-4 (austauschbar)" />
            <KeyValue k="Datenquelle Preise" v="Excel auf OneDrive — strukturiert, eindeutige Spalten" />
            <KeyValue k="Datenquelle Datenblätter" v="SharePoint — Dateiname = Artikelnummer" />
            <KeyValue k="Mail-Anbindung" v="Microsoft 365 / Outlook (Funktionspostfach empfohlen)" />
            <KeyValue k="Vorlage" v="Word-Datei mit {{Variablen}}" />
            <KeyValue k="Operationen pro Anfrage" v="ca. 9 Make-Operationen" />
            <KeyValue k="Operationen pro Monat" v="ca. 3.900 (bei 100 Anfragen/Woche)" />
            <KeyValue k="Make-Plan" v="Core-Plan (10.000 Operationen) — ausreichend Reserve" />
            <KeyValue k="Eskalationspfad" v="Konfidenz < 75 % → Sachbearbeiter-Postfach" />
            <KeyValue k="Einrichtungsaufwand (einmalig)" v="ca. 8–16 Stunden" />
            <KeyValue k="Laufende Pflege" v="ca. 1 Stunde pro Monat" />
          </div>
        </section>

        {/* ROADMAP */}
        <section className="bg-white border border-stone-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
            <h2 className="text-base font-semibold">Ausbaustufen</h2>
            <p className="text-xs text-stone-500 mt-1">
              Phase 1 ist der Funktionsumfang dieser Demo. Die weiteren Phasen sind optional und können nach erfolgreichem Start angegangen werden.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            <Phase n="1" title="MVP — Excel + Outlook" active items={[
              "Anfragen aus Outlook",
              "Preise aus Excel-Liste",
              "Datenblätter aus SharePoint",
              "Outlook-Entwurf zur Prüfung",
            ]} />
            <Phase n="2" title="ERP-Anbindung" items={[
              "Preisliste aus Infor LN statt Excel",
              "Lagerbestand-Prüfung im Angebot",
              "Kundenstamm aus ERP",
              "Angebotsablage im ERP",
            ]} hasRightBorder />
            <Phase n="3" title="CRM-Integration" items={[
              "Salesforce als Lead-Quelle",
              "Versand über Salesforce",
              "Status-Tracking pro Angebot",
              "Pipeline-Reporting",
            ]} />
          </div>
        </section>
      </main>

      <footer className="max-w-[1400px] mx-auto px-6 py-6 text-xs text-stone-500 flex justify-between items-center border-t border-stone-200 mt-8">
        <span>Funktionsdemo · Polyurea / Polyurethan Angebotsbearbeitung</span>
        <span className="font-mono-tight">Stand: {new Date().toLocaleDateString("de-DE")}</span>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────

function FieldRow({ label, value, mono, bold }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[80px_1fr] gap-3 text-[13px]">
      <span className="text-stone-500">{label}</span>
      <span className={`${mono ? "font-mono-tight text-[12px]" : ""} ${bold ? "font-semibold" : ""}`}>{value}</span>
    </div>
  );
}

function Card({ title, icon: Icon, confidence, children }) {
  return (
    <div className="col-span-12 md:col-span-4 bg-white border border-stone-200 rounded-lg overflow-hidden">
      <div className="px-5 py-3 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-stone-500" />
          <span className="text-xs font-medium uppercase tracking-wider text-stone-700">{title}</span>
        </div>
        {typeof confidence === "number" && (
          <span className="text-[10px] font-mono-tight text-stone-500 bg-white px-1.5 py-0.5 rounded border border-stone-200">
            Konfidenz {Math.round(confidence * 100)}%
          </span>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function DataRow({ label, value, mono }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 py-1 text-[13px]">
      <span className="text-stone-500 text-[11px] uppercase tracking-wider pt-0.5">{label}</span>
      <span className={`${mono ? "font-mono-tight text-[12px]" : ""} text-stone-800`}>{value}</span>
    </div>
  );
}

function Divider() {
  return <div className="my-3 border-t border-stone-100" />;
}

function KV({ label, value, fullSpan }) {
  return (
    <div className={`bg-stone-50 rounded p-2 ${fullSpan ? "col-span-2" : ""}`}>
      <div className="text-[10px] uppercase tracking-wider text-stone-500">{label}</div>
      <div className="text-[12px] text-stone-800 mt-0.5">{value}</div>
    </div>
  );
}

function ManualStep({ n, title, children }) {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-stone-700">
        {n}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-stone-900 mb-1">{title}</div>
        <div className="text-stone-600 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function KeyValue({ k, v }) {
  return (
    <div className="grid grid-cols-[210px_1fr] gap-3">
      <span className="text-stone-500">{k}</span>
      <span className="text-stone-800">{v}</span>
    </div>
  );
}

function Phase({ n, title, active, items, hasRightBorder }) {
  return (
    <div className={`p-6 ${active ? "bg-stone-50" : ""} ${hasRightBorder ? "md:border-r" : ""} ${n !== "3" ? "md:border-r" : ""} border-stone-200 border-b md:border-b-0`}>
      <div className="flex items-baseline gap-3 mb-3">
        <span className={`font-mono-tight text-[11px] ${active ? "bg-stone-900 text-white" : "bg-stone-200 text-stone-700"} px-2 py-0.5 rounded`}>
          Phase {n}
        </span>
        {active && <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold">Diese Demo</span>}
      </div>
      <h3 className="font-serif-display text-xl mb-3">{title}</h3>
      <ul className="space-y-1.5 text-sm text-stone-700">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 flex-shrink-0 mt-0.5" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
