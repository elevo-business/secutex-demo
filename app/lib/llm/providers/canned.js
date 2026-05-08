import { promises as fs } from "node:fs";
import path from "node:path";

const CANNED_DIR = path.join(process.cwd(), "app", "lib", "canned");

const MAIL_FILES = {
  m1: "m1-chemtec.json",
  m2: "m2-bauplanung.json",
  m3: "m3-molkerei.json",
  m4: "m4-logistik.json",
  m5: "m5-tunnel.json",
};
const GENERIC_FILE = "generic.json";

const cache = new Map();

async function loadFile(filename) {
  if (cache.has(filename)) return cache.get(filename);
  const fullPath = path.join(CANNED_DIR, filename);
  const raw = await fs.readFile(fullPath, "utf8");
  const parsed = JSON.parse(raw);
  cache.set(filename, parsed);
  return parsed;
}

export const name = "canned";

export function isConfigured() {
  return true;
}

export async function call({ mailId }) {
  const filename = MAIL_FILES[mailId] || GENERIC_FILE;
  return loadFile(filename);
}
