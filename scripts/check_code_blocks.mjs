// 抽出 zh-TW/src 底下所有 ts 程式碼區塊，用 tsc 做型別檢查。
// 一般區塊不能有錯誤；標成 ts,fails 的區塊一定要有錯誤，
// 而且錯誤代碼要和後面貼出的錯誤訊息（text 區塊）一樣。
// 片段或多檔範例加上 ignore，例如 ```ts,ignore
import { spawnSync } from "node:child_process";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const REPO = new URL("..", import.meta.url).pathname;
const ROOT = join(REPO, "zh-TW/src/");
const TMP = join(REPO, ".check");

async function* markdownFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* markdownFiles(path);
    else if (entry.name.endsWith(".md")) yield path;
  }
}

function* codeBlocks(markdown) {
  const lines = markdown.split("\n");
  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    const open = lines[i].match(/^```(\S*)/);
    if (!open) continue;
    const [lang, ...attrs] = open[1].split(",");
    const start = i;
    const body = [];
    while (++i < lines.length && !lines[i].startsWith("```")) body.push(lines[i]);
    blocks.push({ lang, attrs, line: start + 1, code: body.join("\n") });
  }
  for (const [index, block] of blocks.entries()) {
    if (block.lang !== "ts" || block.attrs.includes("ignore")) continue;
    const fails = block.attrs.includes("fails");
    // 錯誤訊息在下一個 ts,fails 區塊之前、第一個含 error TS 的 text 區塊裡
    let output = "";
    for (const next of blocks.slice(index + 1)) {
      if (next.lang === "ts" && next.attrs.includes("fails")) break;
      if (next.lang === "text" && /error TS\d+/.test(next.code)) {
        output = next.code;
        break;
      }
    }
    const codes = [...output.matchAll(/\berror (TS\d+)/g)].map((m) => m[1]);
    const expected = new Set(fails ? codes : []);
    yield { line: block.line, code: block.code, fails, expected };
  }
}

await rm(TMP, { recursive: true, force: true });
await mkdir(TMP);
await writeFile(
  join(TMP, "tsconfig.json"),
  JSON.stringify({ extends: "../tsconfig.json", include: ["*.ts"] }),
);

const blocks = new Map();
for await (const file of markdownFiles(ROOT)) {
  const relative = file.slice(ROOT.length);
  for (const block of codeBlocks(await readFile(file, "utf8"))) {
    const name = `${relative.replace(/[/.]/g, "_")}_${block.line}.ts`;
    blocks.set(name, { ...block, relative, actual: [] });
    await writeFile(join(TMP, name), block.code + "\n");
  }
}

const tsc = spawnSync(
  join(REPO, "node_modules/.bin/tsc"),
  ["-p", join(TMP, "tsconfig.json"), "--pretty", "false"],
  { encoding: "utf8" },
);
if (tsc.error) throw tsc.error;

const problems = [];
for (const text of tsc.stdout.split("\n")) {
  const match = text.match(/([^/\\]+\.ts)\((\d+),\d+\): error (TS\d+): (.*)$/);
  const block = match && blocks.get(match[1]);
  if (block) block.actual.push({ line: Number(match[2]), code: match[3], message: match[4] });
  else if (/error TS\d+/.test(text)) problems.push(text);
}

for (const block of blocks.values()) {
  const where = `${block.relative}:${block.line}`;
  if (!block.fails) {
    for (const { line, code, message } of block.actual) {
      problems.push(`${block.relative}:${block.line + line}: ${code} ${message}`);
    }
    continue;
  }
  const actual = new Set(block.actual.map((error) => error.code));
  if (block.expected.size === 0) {
    problems.push(`${where}: fails 區塊後面要有寫出錯誤代碼的 text 區塊`);
  } else if (actual.size === 0) {
    problems.push(`${where}: 標成 fails，但 tsc 沒有報錯`);
  } else if ([...actual].sort().join() !== [...block.expected].sort().join()) {
    problems.push(
      `${where}: 預期 ${[...block.expected].join(", ")}，實際是 ${[...actual].join(", ")}`,
    );
  }
}

for (const problem of problems) console.error(problem);
console.log(`checked ${blocks.size} code blocks, ${problems.length} problems`);
process.exit(problems.length ? 1 : 0);
