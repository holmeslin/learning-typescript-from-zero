# 全書大綱

這是規劃用的大綱。正文已全部寫完（11 章 110 集，附錄 5 集），實際集數以 `zh-TW/src/SUMMARY.md` 為準；與原規劃不同處：第 9 章多一集「練習用的設定逐項看」，附錄拆成 `enum`、`namespace`、參數屬性、Zod、Vitest 五集。

鎖定版本：TypeScript 7.0、Node.js 24 LTS、Vite 8（只有第 11 章用到）、npm。

## 讀者

會 JavaScript 基礎、沒寫過 TypeScript 的人。先備知識大約是《從零開始學 React》第 1～2 章：變數、函式、箭頭函式、陣列方法、物件、解構、展開語法、`import` / `export`、`async` / `await`、`fetch`。書裡不複習 JavaScript，前言直接連到那兩章。

正文不教 React。想把 TypeScript 用在 React 的人，後記引導去讀《從零開始學 React》第 10 章。

## 範圍

- **一定要教**：基本型別、物件型別、`type` 與 `interface`、聯集與交集、字面值型別、型別縮小、`unknown` 與 `any`、函式型別、泛型、`keyof`、`typeof`、索引存取型別、內建工具型別、`satisfies`、`as const`、類別
- **入門就好**（目標是看得懂函式庫的型別，不要求會寫）：映射型別、條件型別、`infer`、樣板字面值型別
- **不教**：型別體操、裝飾器、型別的變異性標註、發布 npm 套件、monorepo、專案參照
- `enum`、`namespace`、參數屬性在 Node.js 不能直接執行，只放附錄，正文用 `as const` 物件搭配聯集型別取代 `enum`

## 練習環境

第 1 章帶讀者建立 `ts-practice` 資料夾，第 1～10 章都在裡面練習：一集一個檔案，用 `node 檔名.ts` 執行，用 `npx tsc` 檢查整個資料夾的型別。示範型別錯誤的檔案，看完就修好或刪掉，不然之後每次 `npx tsc` 都會一直報錯。

全書共用的 `tsconfig.json`，CI 檢查範例時也用同一份：

```json
{
  "compilerOptions": {
    "module": "nodenext",
    "target": "esnext",
    "types": [],
    "strict": true,
    "noEmit": true,
    "allowImportingTsExtensions": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "skipLibCheck": true
  }
}
```

- 不開 `noUncheckedIndexedAccess` 和 `exactOptionalPropertyTypes`（`tsc --init` 預設會開），否則從第 2 章起 `arr[0]` 的型別就會多出 `undefined`，對初學者是雜訊。這兩個選項放到第 9 章當進階選項介紹。
- `allowImportingTsExtensions` 讓 `import "./util.ts"` 可以通過型別檢查；Node.js 執行時本來就要寫 `.ts` 副檔名。
- `types: []` 代表沒有 Node.js 的型別（`process`、`fs` 都不能用）。第 10 章的範例只用 `fetch` 和 `JSON.parse`，第 9 章才示範安裝 `@types/node`。

## 第一部：型別基礎

### 第 1 章 TypeScript 第一步

為什麼要用 TypeScript、建立 `ts-practice` 練習資料夾、第一個 `.ts` 檔與用 `node` 執行、用 `npx tsc` 檢查型別（不要加檔名，否則會出現 TS5112）、看懂錯誤訊息、型別標註、型別推論、VS Code 的型別提示、型別只在檢查時存在、綜合練習

### 第 2 章 基本型別

`string`、`number`、`boolean`、陣列型別（`string[]` 與 `Array<string>`）、元組、`null` 與 `undefined`（第一次看到 `string | null`，只講「兩者之一」，細節留到第 5 章）、`any` 為什麼危險、`unknown`、型別別名 `type`、綜合練習

### 第 3 章 物件型別

物件型別的寫法、可選屬性、`readonly`、`type` 與 `interface`、`extends` 與交集型別 `&`、巢狀物件與物件陣列、索引簽章與 `Record`、多餘屬性檢查、結構型別（只看形狀不看名字）、綜合練習

### 第 4 章 函式的型別

參數與回傳值的型別、回傳型別要不要寫、`void`、可選參數與預設參數、其餘參數、物件參數與解構、函式型別、callback 的型別、函式多載（入門）、綜合練習

### 第 5 章 聯集與型別縮小

聯集型別、字面值型別、`typeof` 縮小、真值縮小與相等縮小、`in` 縮小、`instanceof` 縮小、可辨識聯集、`never` 與窮舉檢查、自訂型別守衛（`is`）、型別斷言 `as` 與非空斷言 `!`、綜合練習

### 第 6 章 泛型

為什麼需要泛型、泛型函式、型別參數的推論、泛型型別與泛型介面、泛型約束（`extends`）、預設型別參數、內建的泛型（`Array<T>`、`Map`、`Set`、`Promise<T>`）、綜合練習

### 第 7 章 類別

屬性與建構子、方法、`public` / `private` / `protected`、`#` 私有欄位、`readonly` 屬性、繼承與 `override`、`implements`、抽象類別、`static`、類別也是型別、綜合練習

### 第 8 章 型別運算

用 `typeof` 取得型別、`keyof`、索引存取型別、`as const`（取代 `enum`）、`satisfies`、工具型別（一）：`Partial`、`Required`、`Readonly`、`Pick`、`Omit`、工具型別（二）：`Record`、`Exclude`、`Extract`、`NonNullable`、工具型別（三）：`ReturnType`、`Parameters`、`Awaited`、映射型別入門、條件型別入門、`infer` 入門、樣板字面值型別入門、綜合練習

## 第二部：實戰

### 第 9 章 專案設定與模組

`tsconfig.json` 是什麼、`strict` 幫你開了哪些檢查、更嚴格的選項（`noUncheckedIndexedAccess`、`exactOptionalPropertyTypes`）、匯出與匯入型別、`import type`、匯入時要寫 `.ts` 副檔名、`.d.ts` 宣告檔、`@types` 套件（以 `@types/node` 為例）、替沒有型別的套件寫宣告、綜合練習

### 第 10 章 非同步與外部資料

`async` 函式的回傳型別、`Promise.all` 的型別、`JSON.parse` 回傳 `any` 的陷阱、把外部資料當成 `unknown`、手寫驗證函式、`fetch` 回應的型別、`catch` 拿到的是 `unknown`、綜合練習：讀取並驗證 API 資料

### 第 11 章 在瀏覽器用 TypeScript

用 Vite 建立 `vanilla-ts` 專案、專案結構與 Vite 的 `tsconfig`、`querySelector` 可能回傳 `null`、`HTMLElement` 家族與型別斷言、事件物件的型別、表單輸入、用 `fetch` 把資料顯示在畫面上、綜合練習：待辦清單

### 附錄

看得懂舊寫法（`enum`、`namespace`、參數屬性）、用 Zod 做執行期驗證、Vitest 簡介（含 `expectTypeOf`）

## 程式碼區塊的檢查

- 每個 `ts` 區塊在 CI 裡都當成獨立檔案，用上面那份 `tsconfig.json` 做型別檢查，所以範例不能引用其他區塊的東西。
- 故意示範型別錯誤的區塊標成 ` ```ts,fails `，而且在下一個 `ts,fails` 區塊之前，要有一個 `text` 區塊貼出 `tsc` 的錯誤訊息。CI 會確認這個區塊真的有報錯，而且錯誤代碼（例如 `TS2322`）跟 `text` 區塊裡寫的一樣。
- 語法不完整的片段、需要多個檔案或改設定的範例（第 9 章）、需要未安裝套件的範例（附錄），標成 `,ignore`；這些範例在寫作時都另外實際跑過。

## 其他檔案

- `foreword.md`、`afterword.md`、`404.md`
- 前言的「搭配 AI 一起學」只提供原始檔壓縮包 `ts-book-src.zip`，不寫 AI 助教檔（`GUIDE.md`、`EXERCISES.md`）
