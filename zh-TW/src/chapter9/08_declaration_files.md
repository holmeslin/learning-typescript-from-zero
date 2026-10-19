# `.d.ts` 宣告檔

## 本集目標

看懂 `.d.ts` 檔是什麼，並替一個 JavaScript 檔案寫出宣告。

## 正文

### TypeScript 怎麼知道 `toFixed` 回傳字串

你從第 1 章就一直在用 `toFixed`、`map`、`JSON.parse` 這些 JavaScript 內建的功能。TypeScript 知道 `toFixed` 要收一個數字、回傳字串，但這些功能不是用 TypeScript 寫的，它是怎麼知道的？

在 VS Code 裡隨便寫一行 `(3.14).toFixed(1)`，對 `toFixed` 按右鍵，選「移至定義」。VS Code 會打開一個叫 `lib.es5.d.ts` 的檔案，跳到這一行：

```ts,ignore
toFixed(fractionDigits?: number): string;
```

（上面還有幾行英文說明，這裡省略了。）

這就是答案：有人替 JavaScript 的內建功能，一個一個寫好了型別。

在同一個檔案裡搜尋 `parse(text: string`，會找到 `JSON.parse`：

```ts,ignore
parse(
  text: string,
  reviver?: (this: any, key: string, value: any) => any,
): any;
```

（原本是一行，這裡為了好讀拆成四行。）

最後的 `: any`，就是第 2 章第 5 集說「`JSON.parse` 會回傳 `any`」的出處。

### 什麼是宣告檔

副檔名是 `.d.ts` 的檔案叫**宣告檔**（declaration file）。它跟一般的 `.ts` 檔有兩個不同：

- **只有型別，沒有程式碼。** 它說明「有一個函式叫 `toFixed`，參數和回傳值是什麼型別」，但不包含函式真正的內容。
- **不會被執行。** 它只給 `tsc` 和 VS Code 看。

`lib.es5.d.ts` 這類檔案跟著 TypeScript 一起安裝，`tsconfig.json` 的 `target` 決定要載入哪些。第 2 集把 `target` 改成 `es2020` 時，陣列的 `at` 就不見了，因為描述 `at` 的那個宣告檔沒有被載入。

### 替自己的 JavaScript 檔寫宣告

宣告檔不只用在內建功能。假設 `ts-practice` 裡有一個以前用 JavaScript 寫的檔案，你想在 TypeScript 裡繼續用它。建立 `old` 資料夾，在裡面建立 `old/money.js`：

```js
export function formatMoney(amount) {
  return `NT$ ${amount.toLocaleString("zh-TW")}`;
}
```

再建立 `old/main.ts` 匯入它。這次匯入的檔案真的是 `.js`，所以副檔名寫 `.js`：

```ts,ignore
import { formatMoney } from "./money.js";

console.log(formatMoney(1234567));
```

`npx tsc`：

```text
old/main.ts:1:29 - error TS7016: Could not find a declaration file for module './money.js'. '…/ts-practice/old/money.js' implicitly has an 'any' type.

1 import { formatMoney } from "./money.js";
                              ~~~~~~~~~~~~


Found 1 error in old/main.ts:1
```

（`…` 是你電腦上的路徑。）

「找不到 `./money.js` 的宣告檔，它被暗中當成 `any`」。TypeScript 不讀 JavaScript 檔的內容，不知道 `formatMoney` 要收什麼。`strict` 不允許這種默默變成 `any` 的情況。

在 `money.js` 旁邊建立一個同名的宣告檔 `old/money.d.ts`：

```ts
export declare function formatMoney(amount: number): string;
```

- `declare` 的意思是「只宣告，不實作」：告訴 TypeScript 有這個函式，但函式的內容在別的地方。
- 函式名稱後面直接接分號，沒有 `{ ... }`，因為宣告檔不放程式碼。

再執行一次 `npx tsc`，錯誤消失了。TypeScript 看到 `./money.js`，會自動去找旁邊同名的 `money.d.ts`。現在傳錯型別也抓得到了，把 `main.ts` 改成 `formatMoney("1234567")`：

```text
old/main.ts:3:25 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

3 console.log(formatMoney("1234567"));
                          ~~~~~~~~~


Found 1 error in old/main.ts:3
```

改回數字，用 `node old/main.ts` 執行：

```text
NT$ 1,234,567
```

### 宣告寫錯了怎麼辦

宣告檔是你「說」函式長什麼樣子，TypeScript 只會相信，不會去檢查 `money.js` 是不是真的這樣。如果你在 `money.d.ts` 裡把回傳型別寫成 `number`，`tsc` 照樣通過，執行時拿到的卻是字串。

所以寫宣告檔要對照原本的程式碼仔細寫。能把 JavaScript 檔直接改寫成 TypeScript 的話，那永遠是比較好的選擇。

## 重點整理

- `.d.ts` 是宣告檔，只描述型別，不包含程式碼，也不會被執行。
- JavaScript 內建功能的型別，寫在跟著 TypeScript 一起安裝的 `lib.*.d.ts` 裡。
- 匯入沒有型別的 `.js` 檔會出現 TS7016；在旁邊放一個同名的 `.d.ts` 就能解決。
- `declare` 表示「只宣告，不實作」；宣告檔的內容 TypeScript 會直接相信，要自己寫對。
