const CONTROL_CHAR_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function stripControlChars(value) {
  if (typeof value !== "string") return value;
  return value.replace(CONTROL_CHAR_PATTERN, "");
}

export function sanitizeInput({ subject, from, body, mailId }) {
  return {
    subject: stripControlChars(subject || "").trim(),
    from: stripControlChars(from || "").trim(),
    body: stripControlChars(body || "").trim(),
    mailId: typeof mailId === "string" ? mailId.trim() : null,
  };
}

export function totalInputLength({ subject, from, body }) {
  return (subject?.length || 0) + (from?.length || 0) + (body?.length || 0);
}
