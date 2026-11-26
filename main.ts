import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CHARS = 120;

function entryLine(): string {
  return "★☆☆☆☆ Shows up closer twice a year, gets called 'super' for it. I try that at work and HR calls it hovering.";
}

function validate(line: string): void {
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (line.length === 0) {
    throw new Error("entry must not be empty");
  }
  if (line !== line.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  if (!line.startsWith("★☆☆☆☆")) {
    throw new Error("entry must open with a one-star rating");
  }
  if (line.length > MAX_CHARS) {
    throw new Error(`entry exceeds ${MAX_CHARS} characters: ${line.length}`);
  }
}

function main(): void {
  const line = entryLine();
  validate(line);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, line, "utf8");

  const written = readFileSync(outPath, "utf8");
  if (written !== line) {
    throw new Error("read-back verification failed");
  }
  const sha256 = createHash("sha256").update(written, "utf8").digest("hex");
  console.log(written);
  console.log(`chars=${written.length} sha256=${sha256}`);
}

main();
