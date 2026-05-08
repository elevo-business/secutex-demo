import { z } from "zod";

const positionSchema = z.object({
  produktbeschreibung_kunde: z.string(),
  artikelnummer_vorschlag: z.string().nullable(),
  kategorie: z.string().nullable(),
  menge: z.number().nullable(),
  einheit: z.string().nullable(),
});

const kundeSchema = z.object({
  firma: z.string().nullable(),
  anrede: z.string().nullable(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  strasse: z.string().nullable(),
  plz_ort: z.string().nullable(),
});

export const quoteSchema = z.object({
  kunde: kundeSchema,
  anwendungsfall: z.string(),
  positionen: z.array(positionSchema),
  sonderwuensche: z.string(),
  confidence: z.number().min(0).max(1),
  begruendung_kurz: z.string(),
});

export function safeParseQuote(raw) {
  const result = quoteSchema.safeParse(raw);
  if (result.success) {
    return { ok: true, data: result.data };
  }
  return {
    ok: false,
    error: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
  };
}
