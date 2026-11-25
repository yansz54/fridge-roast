// Fridge Roast: One Line, Biggest Laugh
// Writes a single roast line (max 200 chars) to /output/entry.txt.
// Deterministic: no clock, no network, no randomness, stdlib only.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROAST =
  "The fridge's camera took a photo of my rotting lettuce and sent me a notification: 'We need to talk.'";

// Gate (mirrors the house gate): UTF-8 text of 1 to 200 characters,
// not only white space. Fail loudly instead of shipping a bad entry.
const chars = [...ROAST].length;
if (chars < 1 || chars > 200 || ROAST.trim().length === 0) {
  throw new Error(`roast fails the 1-200 char gate: ${chars} characters`);
}

// No trailing newline on purpose: the ranking tie-break favours the
// smaller text, so the file holds exactly the roast, nothing else.
const outDir = process.env.MAKEFUN_OUTPUT_DIR?.trim() || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ROAST, "utf8");

// Read back and prove the shipped bytes are exactly the roast:
// a silent truncation or newline would change the judged text.
const written = readFileSync(outPath, "utf8");
if (written !== ROAST) {
  throw new Error(
    `entry.txt does not match the roast (${written.length} vs ${chars} chars)`,
  );
}
const bytes = Buffer.byteLength(written, "utf8");
if (bytes > 200) {
  throw new Error(`entry.txt is ${bytes} bytes, over the 200-char gate`);
}
console.log(`wrote entry.txt (${chars} chars, ${bytes} bytes, verified)`);
