# `tsconfig.json` 是什麼

## 本集目標

知道 `tsc` 怎麼找到設定檔、會檢查哪些檔案，以及設定檔的基本結構。

## 正文

### `tsc` 先找設定檔

你在第 1 章建立 `ts-practice` 時，放了一份 `tsconfig.json`。從那之後，每次執行 `npx tsc`，它做的第一件事就是找這個檔案：

1. 在你執行指令的資料夾裡找 `tsconfig.json`。
2. 找到了，就照裡面的設定檢查。
3. 有 `tsconfig.json` 的那個資料夾，就是一個 TypeScript 專案的**根目錄**。

所以 `npx tsc` 一定要在 `ts-practice` 裡執行。如果終端機站在別的資料夾，`tsc` 找不到設定檔，就不知道要檢查什麼。

第 1 章第 4 集看過的 TS5112 也是同一件事：在 `npx tsc` 後面加檔名，`tsc` 就不讀設定檔了。TypeScript 怕你以為設定有生效、其實沒有，所以乾脆拒絕執行。

### 會檢查哪些檔案

`tsconfig.json` 沒有特別指定的話，`tsc` 會檢查根目錄底下**所有**的 `.ts` 檔，包括子資料夾裡的。`node_modules` 是例外，它會被自動略過。

這就是為什麼練習資料夾裡只要留著一個寫錯的檔案，每次 `npx tsc` 都會看到它的錯誤。

如果只想檢查某些資料夾，可以加上 `include`：

```json
{
  "compilerOptions": {
    "strict": true
  },
  "include": ["src"]
}
```

這樣 `tsc` 只會檢查 `src` 資料夾。很多專案把程式碼都放在 `src` 裡，就會這樣寫。`ts-practice` 不需要，所以練習用的設定沒有 `include`。

### 設定檔的結構

再看一次第 1 章的設定：

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

最外層是一個物件，所有選項都放在 `compilerOptions`（編譯器選項）裡。每個選項就是一個「名稱: 值」，值大多是 `true` / `false`，或是一段固定的字串。

選項的名稱很長，但不用背。在 VS Code 裡打開 `tsconfig.json`，把游標移到選項名稱上，會跳出英文說明；在 `compilerOptions` 裡打一個 `"`，還會跳出所有可用選項的清單。

> `tsconfig.json` 雖然叫 `.json`，但它允許寫註解（`//`）和最後一項後面多一個逗號，這兩件事在一般的 JSON 是不行的。你用 `npx tsc --init` 產生的設定檔裡，就有很多註解。

### TypeScript 有幾百個選項

完整的選項清單可以在終端機用 `npx tsc --help --all` 看到，數量多到捲不完。好消息是，大部分你一輩子都不會碰到。這一章只講兩類：

- 第 1 章那份設定裡的每一個選項，下一集逐項說明。
- 幾個值得知道的檢查選項，第 3、4 集介紹。

查不到的時候，官方網站的 [TSConfig Reference](https://www.typescriptlang.org/tsconfig/) 有每個選項的說明和範例。

## 重點整理

- `npx tsc` 會在目前的資料夾找 `tsconfig.json`，找到的那個資料夾就是專案的根目錄。
- 沒有指定 `include` 時，`tsc` 檢查根目錄底下所有的 `.ts` 檔，`node_modules` 除外。
- 所有選項都放在 `compilerOptions` 裡；把游標移到選項名稱上，就能看到說明。
- 選項很多，不用背，需要時查官方的 TSConfig Reference。
