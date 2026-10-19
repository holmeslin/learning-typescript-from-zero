// 比對每個 ts,fails 區塊貼出的錯誤訊息，和 tsc 實際印出的全文是否一字不差。
// 檔名取自錯誤訊息的第一行，例如 typo.ts:1:7 就把區塊存成 typo.ts 再跑 tsc。
// check_code_blocks.mjs 只比對錯誤代碼；這支比較慢，改錯誤訊息時再跑。
import { spawnSync } from "node:child_process";
import { copyFile, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const REPO = new URL("..", import.meta.url).pathname;
const ROOT = join(REPO, "zh-TW/src/");
const TMP = join(REPO, ".check-errors");

async function* markdownFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* markdownFiles(path);
    else if (entry.name.endsWith(".md")) yield path;
  }
}

function* failsBlocks(markdown) {
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
    if (block.lang !== "ts" || !block.attrs.includes("fails")) continue;
    // 和 check_code_blocks.mjs 同一條規則：下一個 ts,fails 之前第一個含 error TS 的 text
    let output = "";
    for (const next of blocks.slice(index + 1)) {
      if (next.lang === "ts" && next.attrs.includes("fails")) break;
      if (next.lang === "text" && /error TS\d+/.test(next.code)) {
        output = next.code;
        break;
      }
    }
    yield { line: block.line, code: block.code, output };
  }
}

await rm(TMP, { recursive: true, force: true });
await mkdir(TMP);
await copyFile(join(REPO, "tsconfig.json"), join(TMP, "tsconfig.json"));

let checked = 0;
const problems = [];
for await (const file of markdownFiles(ROOT)) {
  const relative = file.slice(ROOT.length);
  for (const block of failsBlocks(await readFile(file, "utf8"))) {
    const where = `${relative}:${block.line}`;
    const name = block.output.match(/^(\S+\.ts):\d+:\d+ - error/m)?.[1];
    if (!name) {
      problems.push(`${where}: 錯誤訊息裡找不到檔名`);
      continue;
    }
    checked++;
    const path = join(TMP, name);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, block.code + "\n");
    const tsc = spawnSync(join(REPO, "node_modules/.bin/tsc"), ["--pretty"], {
      cwd: TMP,
      encoding: "utf8",
    });
    if (tsc.error) throw tsc.error;
    await rm(path);
    const actual = tsc.stdout.replace(/\x1b\[[0-9;]*m/g, "").trimEnd();
    if (actual !== block.output.trimEnd()) {
      problems.push(`${where}: 錯誤訊息和 tsc 實際輸出不同，實際是：\n${actual}`);
    }
  }
}

await rm(TMP, { recursive: true, force: true });
for (const problem of problems) console.error(problem);
console.log(`checked ${checked} error messages, ${problems.length} problems`);
process.exit(problems.length ? 1 : 0);
