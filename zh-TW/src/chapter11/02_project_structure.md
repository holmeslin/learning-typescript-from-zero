# 專案結構與 Vite 的 `tsconfig`

## 本集目標

看懂 Vite 專案裡每個檔案的用途，比較它的 `tsconfig.json` 和 `ts-practice` 的差別，再把範例清乾淨。

## 正文

### 專案裡有什麼

`hello-ts` 裡的檔案（不算 `node_modules`）：

```text
hello-ts/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── counter.ts
│   ├── main.ts
│   └── style.css
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
└── tsconfig.json
```

- **`index.html`**：網頁的入口。裡面有一行 `<script type="module" src="/src/main.ts">`，直接載入 `.ts` 檔，Vite 會在中間幫你轉成 JavaScript。
- **`src/`**：你的 TypeScript 程式碼放這裡，`main.ts` 是第一個被執行的檔案。
- **`public/`**：原封不動提供給瀏覽器的檔案，例如網站圖示。第 7 集會在這裡放一個 JSON 檔。

`package.json` 裡的 `scripts` 就是上一集用的指令：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

`build` 的 `tsc && vite build` 意思是「先跑 `tsc`，成功了才跑 `vite build`」，這就是上一集型別有錯就不建置的原因。`preview` 可以在本機預覽建置好的結果。

### Vite 的 `tsconfig.json`

Vite 產生的 `tsconfig.json` 長這樣：

```json
{
  "compilerOptions": {
    "target": "es2023",
    "module": "esnext",
    "lib": ["ES2023", "DOM"],
    "types": ["vite/client"],
    "allowArbitraryExtensions": true,
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

`/* */` 是註解。`tsconfig.json` 允許寫註解，一般的 JSON 檔不行。

很多設定你在 `ts-practice` 裡已經看過了：`noEmit`、`allowImportingTsExtensions`、`verbatimModuleSyntax`、`moduleDetection`、`erasableSyntaxOnly`、`skipLibCheck`。意思都一樣。不一樣的地方是這些：

| 設定 | 意思 |
| --- | --- |
| `"lib": ["ES2023", "DOM"]` | 明確說要用網頁的 API（`document`、`HTMLElement` 這些） |
| `"types": ["vite/client"]` | 載入 Vite 提供的型別，讓 TypeScript 看得懂 `import "./style.css"` 這種匯入 |
| `"moduleResolution": "bundler"` | 怎麼找到 `import` 的檔案，交給 Vite 這類打包工具的規則 |
| `"noUnusedLocals": true` | 宣告了卻沒用到的變數，算成錯誤 |
| `"noUnusedParameters": true` | 沒用到的函式參數，算成錯誤 |
| `"noFallthroughCasesInSwitch": true` | `switch` 的 `case` 忘了寫 `break` 時報錯 |
| `"include": ["src"]` | 只檢查 `src` 資料夾 |

你可能注意到，這裡**沒有** `"strict": true`。在 TypeScript 7，`strict` 不寫也是開著的，效果跟 `ts-practice` 一樣。

`noUnusedLocals` 和 `noUnusedParameters` 是 `ts-practice` 沒有的。在 Vite 專案裡宣告了變數卻沒用到，`npm run build` 會失敗。寫到一半時看到這種錯誤不用緊張，用到它或刪掉它就好。

### 把範例清乾淨

範例頁面的程式碼這一章用不到，先清掉：

1. 刪掉 `src/assets` 資料夾、`src/counter.ts`、`src/style.css`。
2. 刪掉 `public/icons.svg`（`favicon.svg` 留著）。
3. 把 `index.html` 改成：

```html
<!doctype html>
<html lang="zh-Hant-TW">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>hello-ts</title>
  </head>
  <body>
    <h1 id="title">標題</h1>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

4. 把 `src/main.ts` 的內容整個換成：

```ts
console.log("Vite 專案準備好了");
```

執行 `npm run dev`，打開瀏覽器，會看到「標題」兩個字。按 `F12` 打開瀏覽器的開發者工具，切到 Console（主控台）分頁，會看到 `Vite 專案準備好了`。網頁裡的 `console.log` 會印在這裡，不是印在終端機。

之後每一集都會給你 `index.html` 的 `<body>` 和 `src/main.ts` 的內容，照著換掉就好。`<head>` 不用動，`<body>` 最後那行載入 `main.ts` 的 `<script>` 要留著。

## 重點整理

- `index.html` 是入口，它直接載入 `src/main.ts`，由 Vite 轉成 JavaScript。
- `npm run build` 是 `tsc && vite build`：先檢查型別，再建置。
- Vite 的 `tsconfig.json` 多了網頁的 API、Vite 的型別，以及「沒用到的變數算錯誤」這類檢查。
- 在 TypeScript 7，`strict` 不寫也是開著的。
- 網頁裡的 `console.log` 印在瀏覽器開發者工具的 Console 分頁。
