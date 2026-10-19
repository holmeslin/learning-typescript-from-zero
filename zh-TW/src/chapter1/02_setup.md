# 建立練習資料夾

## 本集目標

建立 `ts-practice` 資料夾，裝好 TypeScript，放進全書共用的設定檔。

## 正文

第 1～10 章的範例都在同一個資料夾裡練習。這一集把它建好，之後就不用再動。

### 1. 建立資料夾

在你方便找到的地方建立一個資料夾，取名 `ts-practice`。用 VS Code 打開它（「檔案」→「開啟資料夾」），再從「檢視」→「終端機」打開終端機。

先確認 Node.js 的版本：

```bash
node -v
```

```text
v24.22.0
```

開頭是 `v24` 或更大的數字就可以。Node.js 24 可以直接執行 `.ts` 檔，這本書會一直用到這個功能。

### 2. 建立 `package.json`

在終端機執行：

```bash
npm init -y
npm pkg set type=module
```

第一行建立 `package.json`，第二行在裡面加上 `"type": "module"`，讓 Node.js 用 `import` / `export` 的模組語法讀你的檔案。

### 3. 安裝 TypeScript

```bash
npm install -D typescript@7
```

`-D` 表示這是開發時才用到的工具，執行程式時不需要它。裝完確認一下版本：

```bash
npx tsc -v
```

```text
Version 7.0.2
```

`npx` 會執行「裝在這個資料夾裡」的工具。TypeScript 裝在 `ts-practice/node_modules` 裡，所以要用 `npx tsc`，不是直接打 `tsc`。

### 4. 建立設定檔

在 `ts-practice` 裡建立 `tsconfig.json`，內容整段複製下面這份：

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

`tsconfig.json` 告訴 `tsc` 要怎麼檢查。設定很多，現在只要知道這三個：

- `"strict": true`：打開嚴格檢查。這本書所有的範例都假設它是開著的。
- `"noEmit": true`：只檢查，不產生任何檔案。執行交給 Node.js，`tsc` 只負責挑錯。
- `"erasableSyntaxOnly": true`：只允許 Node.js 能直接執行的 TypeScript 語法。第 9 集會說明為什麼需要它。

其他的設定，第 9 章會一個一個講。

> 你可能在網路上看過用 `npx tsc --init` 產生設定檔的教學。它產生的設定會多開幾個比較嚴格的檢查，對剛入門的人來說錯誤訊息會變多。這本書的範例都以上面這份設定為準，請不要換掉。

### 完成後的資料夾

```text
ts-practice/
├── node_modules/
├── package-lock.json
├── package.json
└── tsconfig.json
```

### 練習的規則

接下來每一集，都在 `ts-practice` 裡建立一個新的 `.ts` 檔來練習，檔名書裡會寫。

有些範例是**故意寫錯**、用來看錯誤訊息的。看完之後，請把那個檔案改對或刪掉。第 4 集會講到，`npx tsc` 一次檢查整個資料夾，留著寫錯的檔案，之後每次檢查都會看到它的錯誤。

## 重點整理

- 第 1～10 章都在 `ts-practice` 資料夾裡練習。
- 用 `npm install -D typescript@7` 安裝 TypeScript，用 `npx tsc -v` 確認版本。
- `tsconfig.json` 照書上的內容建立，不要用 `tsc --init` 產生。
- 故意寫錯的練習檔，看完就改對或刪掉。
