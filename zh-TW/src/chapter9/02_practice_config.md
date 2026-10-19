# 練習用的設定逐項看

## 本集目標

看懂第 1 章照抄的 `tsconfig.json` 裡，每一個選項在做什麼。

## 正文

第 1 章說過「其他的設定，第 9 章會一個一個講」，就是這一集。十個選項可以分成四組。

### 第一組：程式在哪裡執行

```json
"module": "nodenext",
"target": "esnext",
"types": [],
```

**`module: "nodenext"`**：照 Node.js 現在的規則處理 `import` 和 `export`。例如 Node.js 要求匯入時寫出副檔名，`tsc` 就跟著檢查。第 7 集會看到它實際擋下什麼。

**`target: "esnext"`**：你的程式碼會在最新版的 JavaScript 環境執行。它決定 TypeScript 認得哪些內建功能。例如陣列的 `at` 方法是 2022 年才加進 JavaScript 的，如果把 `target` 改成 `"es2020"`，`tsc` 就會說陣列沒有 `at`：

```text
t.ts:2:16 - error TS2550: Property 'at' does not exist on type 'number[]'. Do you need to change your target library? Try changing the 'lib' compiler option to 'es2022' or later.

2 console.log(xs.at(-1));
                 ~~


Found 1 error in t.ts:2
```

Node.js 24 支援最新的 JavaScript，所以設成 `esnext` 就對了。

**`types: []`**：不要自動載入任何「型別套件」。型別套件是什麼、什麼時候要改這一行，第 9 集會講。

### 第二組：檢查要多嚴格

```json
"strict": true,
```

打開一整組嚴格的檢查。內容很多，下一集專門講。

### 第三組：配合 Node.js 直接執行

```json
"noEmit": true,
"allowImportingTsExtensions": true,
"erasableSyntaxOnly": true,
"verbatimModuleSyntax": true,
```

`tsc` 本來的工作有兩個：檢查型別，以及把 `.ts` 轉成 `.js` 檔。但這本書的做法是讓 Node.js 直接執行 `.ts`，`tsc` 只負責檢查。這四個選項都是為了這個分工：

**`noEmit: true`**：只檢查，不產生 `.js` 檔。

**`allowImportingTsExtensions: true`**：允許 `import "./product.ts"` 這種寫上 `.ts` 副檔名的匯入。Node.js 直接執行 `.ts` 時一定要這樣寫，但 `tsc` 預設不允許，因為一般專案會先轉成 `.js` 再執行，到時候 `.ts` 檔已經不在了。第 7 集會詳細講。

**`erasableSyntaxOnly: true`**：只允許「拿掉型別之後，剩下的就是正常 JavaScript」的語法。第 1 章第 9 集看過，Node.js 執行時只會把型別換成空白，`enum` 這種需要轉換的語法它處理不了，這個選項讓 `tsc` 提早抓出來。

**`verbatimModuleSyntax: true`**：匯入型別時，一定要明確寫出 `type`。原因跟 Node.js 怎麼拿掉型別有關，第 6 集會講。

### 第四組：其他

```json
"moduleDetection": "force",
"skipLibCheck": true
```

**`moduleDetection: "force"`**：把每個 `.ts` 檔都當成獨立的模組。

如果沒有它，在某些設定下（例如很多前端專案用的 `"module": "esnext"`），沒有 `import` / `export` 的檔案會被當成「全域的腳本」，兩個檔案的頂層變數會互相衝突。例如 `a1.ts` 和 `a2.ts` 都宣告了 `const total`：

```text
a1.ts:1:7 - error TS2451: Cannot redeclare block-scoped variable 'total'.

1 const total = 1;
        ~~~~~

  a2.ts:1:7 - 'total' was also declared here.
    1 const total = 2;
            ~~~~~

a2.ts:1:7 - error TS2451: Cannot redeclare block-scoped variable 'total'.

1 const total = 2;
        ~~~~~

  a1.ts:1:7 - 'total' was also declared here.
    1 const total = 1;
            ~~~~~


Found 2 errors in 2 files.

Errors  Files
     1  a1.ts:1
     1  a2.ts:1
```

「不能重複宣告 `total`」。練習資料夾裡每一集一個檔案，變數名稱難免重複，所以要寫上 `force`，讓每個檔案各管各的。

**`skipLibCheck: true`**：不檢查 `.d.ts` 檔（第 8 集會講這是什麼）。套件附帶的型別檔，不是你寫的，你也改不了；跳過它們，檢查會比較快，也不會因為別人型別檔裡的小問題而卡住。

### 一張表整理

| 選項 | 一句話 |
| --- | --- |
| `module` | 照 Node.js 的規則處理模組 |
| `target` | 認得最新的 JavaScript 功能 |
| `types` | 不自動載入型別套件 |
| `strict` | 打開嚴格檢查 |
| `noEmit` | 只檢查，不產生 `.js` |
| `allowImportingTsExtensions` | 允許匯入時寫 `.ts` |
| `erasableSyntaxOnly` | 只允許拿得掉的語法 |
| `verbatimModuleSyntax` | 匯入型別要寫 `type` |
| `moduleDetection` | 每個檔案都是獨立的模組 |
| `skipLibCheck` | 不檢查 `.d.ts` 檔 |

換到別的專案時，設定一定會不一樣。例如第 11 章用 Vite 建立的網頁專案，`module`、`target`、`types` 的值都不一樣，還多了好幾個這裡沒有的選項。看到陌生的選項，就把游標移上去看說明，或查 TSConfig Reference。

## 重點整理

- `module`、`target`、`types` 描述程式在哪裡執行。
- `noEmit`、`allowImportingTsExtensions`、`erasableSyntaxOnly`、`verbatimModuleSyntax` 是為了「Node.js 執行、`tsc` 只檢查」的分工。
- `moduleDetection: "force"` 讓每個檔案的頂層變數互不衝突。
- `skipLibCheck` 跳過套件的型別檔，檢查比較快。
