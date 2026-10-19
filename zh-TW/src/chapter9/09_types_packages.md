# `@types` 套件

## 本集目標

安裝 `@types/node`，讓 TypeScript 認得 Node.js 的功能，並看懂 `types` 這個設定。

## 正文

### TypeScript 不認得 `process`

Node.js 有很多 JavaScript 本身沒有的功能，例如 `process.argv` 可以拿到執行指令時多打的參數，`node:fs/promises` 可以讀檔案。建立 `args.ts`：

```ts,ignore
import { readFile } from "node:fs/promises";

const name = process.argv[2] ?? "朋友";
console.log(`你好，${name}`);

const text = await readFile("package.json", "utf8");
const pkg = JSON.parse(text);
console.log(`這個資料夾的名稱是 ${pkg.name}`);
```

- `process.argv[2]` 是 `node args.ts` 後面接的第一個字。
- `readFile` 讀出 `package.json` 的內容，再用 `JSON.parse` 取出裡面的 `name`。
- `await` 直接寫在檔案最外層，這在模組裡是允許的。

執行看看：

```bash
node args.ts 小明
```

```text
你好，小明
這個資料夾的名稱是 ts-practice
```

Node.js 執行得很好。但 `npx tsc`：

```text
args.ts:1:26 - error TS2591: Cannot find name 'node:fs/promises'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node` and then add 'node' to the types field in your tsconfig.

1 import { readFile } from "node:fs/promises";
                           ~~~~~~~~~~~~~~~~~~

args.ts:3:14 - error TS2591: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node` and then add 'node' to the types field in your tsconfig.

3 const name = process.argv[2] ?? "朋友";
               ~~~~~~~


Found 2 errors in the same file, starting at: args.ts:1
```

「找不到 `process`。你是不是需要安裝 Node.js 的型別定義？試試 `npm i --save-dev @types/node`，然後在 tsconfig 的 `types` 加上 `'node'`。」

TypeScript 內建的宣告檔只描述 JavaScript 本身和瀏覽器的功能。Node.js 專屬的功能，要另外安裝它們的宣告檔。錯誤訊息連該怎麼做都告訴你了。

### `@types` 套件

npm 上有一群名稱以 `@types/` 開頭的套件，裡面**只有 `.d.ts` 宣告檔**，替各種用 JavaScript 寫的東西補上型別。它們由社群在一個叫 DefinitelyTyped 的專案裡統一維護。`@types/node` 就是 Node.js 的型別。

照錯誤訊息的建議安裝：

```bash
npm install -D @types/node@24
```

`@24` 是指定版本。`@types/node` 的版本號碼跟著 Node.js 走，你用的是 Node.js 24，就裝 24 版的型別，這樣型別描述的功能才會跟你實際能用的一致。

裝完再執行 `npx tsc`，你會發現**錯誤還在**。這就是錯誤訊息後半句「然後在 tsconfig 的 `types` 加上 `'node'`」的意思。

### `types` 設定

第 2 集說過，練習用的設定有一行 `"types": []`，意思是「不要自動載入任何型別套件」。所以就算 `@types/node` 裝好了，TypeScript 也不會去讀它。把那一行改成：

```json
"types": ["node"],
```

再執行 `npx tsc`，什麼都沒印，`process` 和 `readFile` 都認得了。把游標移到 `readFile` 上，還能看到它的參數和回傳型別。

為什麼要這樣一個一個列出來？因為有些型別套件會把東西加進**全域**，例如 `@types/node` 讓 `process` 不用匯入就能用。如果什麼都自動載入，裝了一個不相干的套件，全域就可能多出一堆你不知道從哪來的名稱。明確列出要用哪些，比較不會出意外。

### 看完改回來

接下來的章節不需要 Node.js 的功能。為了讓之後的範例結果跟書上完全一樣，**請把 `types` 改回 `[]`，並刪掉 `args.ts`**。`@types/node` 留在 `node_modules` 裡沒關係，`types` 是空的，它就不會被載入。

以後你寫自己的 Node.js 專案，需要 `process`、`fs` 這些功能時，就照這一集的兩個步驟：安裝 `@types/node`，在 `types` 加上 `"node"`。

### 套件自己附型別

不是每個套件都要另外裝 `@types`。現在很多套件是用 TypeScript 寫的，或是在套件裡直接附上 `.d.ts`，裝好就有型別，不用多做什麼。

想知道一個套件要不要另外裝 `@types`，最簡單的方法是直接 `import` 它，看 `npx tsc` 有沒有抱怨。下一集會看到抱怨的時候該怎麼辦。

## 重點整理

- `@types/` 開頭的套件只有宣告檔，替用 JavaScript 寫的東西補上型別。
- Node.js 的型別在 `@types/node`，版本號碼跟 Node.js 一致。
- 練習設定的 `"types": []` 不自動載入型別套件；要用 `@types/node`，得在 `types` 加上 `"node"`。
- 很多套件自己附型別，不需要另外裝 `@types`。
