# `import type`

## 本集目標

知道為什麼匯入型別要寫 `type`，以及兩種寫法。

## 正文

### 不寫 `type` 會怎樣

把上一集的 `shop/main.ts` 改成一行匯入，不分開寫：

```ts,ignore
import { formatPrice, Product } from "./product.ts";

const pen: Product = { name: "原子筆", price: 15 };
console.log(formatPrice(pen));
```

執行 `npx tsc`：

```text
shop/main.ts:1:23 - error TS1484: 'Product' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.

1 import { formatPrice, Product } from "./product.ts";
                        ~~~~~~~


Found 1 error in shop/main.ts:1
```

「`Product` 是型別，打開 `verbatimModuleSyntax` 的時候，必須用只匯入型別的方式匯入」。

你可能覺得 TypeScript 太囉嗦：它明明知道 `Product` 是型別。那就不管錯誤，直接執行看看：

```bash
node shop/main.ts
```

```text
SyntaxError: The requested module './product.ts' does not provide an export named 'Product'
```

（省略了錯誤的位置和細節。）

程式根本跑不起來。

### 為什麼會這樣

回想第 1 章第 9 集：Node.js 執行 `.ts` 檔時，只會把型別的部分換成空白，**不會去看其他檔案**。

在 `product.ts` 裡，`export type Product = { ... }` 整段是型別，被拿掉了。所以對 Node.js 來說，`product.ts` 只匯出了 `formatPrice`，根本沒有 `Product`。

而 `main.ts` 的 `import { formatPrice, Product }`，Node.js 只看這一行，分不出 `Product` 是型別還是函式，所以原封不動地保留下來，然後去 `product.ts` 找 `Product`，找不到就出錯了。

寫成 `import type { Product }` 之後，Node.js 一看到 `import type`，就知道整行都是型別，直接拿掉。這就是第 2 集說的 `verbatimModuleSyntax` 在做的事：要求你把型別的匯入標清楚，讓「只拿掉型別」的工具也能正確處理。

### 兩種寫法

**寫法一：分開兩行。** 上一集用的就是這種：

```ts,ignore
import { formatPrice } from "./product.ts";
import type { Product } from "./product.ts";
```

**寫法二：在同一行裡，型別名稱前面加 `type`：**

```ts,ignore
import { formatPrice, type Product } from "./product.ts";
```

`type Product` 表示「這一個是型別」，`formatPrice` 前面沒有 `type`，就是一般的匯入。Node.js 執行時，只會拿掉 `type Product` 這一段，留下 `import { formatPrice }`。

兩種寫法效果一樣，選一種用就好。從同一個檔案同時匯入值和型別時，寫法二比較短。

### 匯出不用加 `type`

只有匯入需要區分。`export type Product = { ... }` 本來就以 `type` 開頭，Node.js 看得出它是型別，不需要額外標記。

### 不確定的時候

不確定匯入的東西是不是型別？不用自己判斷，照常寫，`npx tsc` 會用 TS1484 告訴你哪個要加 `type`。VS Code 也會在那個名稱底下畫紅線，而且常常提供「快速修正」，幫你自動加上 `type`。

## 重點整理

- Node.js 執行時看不到其他檔案，分不出匯入的名稱是不是型別，沒標 `type` 就會出錯。
- `verbatimModuleSyntax` 會用 TS1484 提醒你，匯入型別要加 `type`。
- 可以寫成 `import type { A } from`，或在同一行寫 `import { b, type A } from`。
- 只有匯入需要標 `type`，匯出的 `export type` 本來就看得出來。
