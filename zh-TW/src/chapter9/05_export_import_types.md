# 匯出與匯入型別

## 本集目標

把型別放在一個檔案裡，讓其他檔案匯入使用。

## 正文

到目前為止，每個範例都是一個檔案。真實的專案會把程式碼分到很多檔案裡，互相 `import`。你在 JavaScript 已經學過 `export` 和 `import`，型別也一樣可以匯出、匯入。

### 型別也可以 `export`

在 `ts-practice` 裡建立一個 `shop` 資料夾，這一集和接下來兩集都在裡面練習。先建立 `shop/product.ts`：

```ts
export type Product = {
  name: string;
  price: number;
};

export function formatPrice(product: Product): string {
  return `${product.name}：${product.price} 元`;
}
```

在 `type` 前面加上 `export`，就跟匯出函式一樣，其他檔案就能用這個型別了。

再建立 `shop/main.ts`：

```ts,ignore
import { formatPrice } from "./product.ts";
import type { Product } from "./product.ts";

const pen: Product = { name: "原子筆", price: 15 };
console.log(formatPrice(pen));
```

匯入函式用你熟悉的 `import { ... } from`；匯入型別用 `import type { ... } from`，多了一個 `type`。為什麼要分開寫，下一集會講，現在先照抄。

檢查和執行：

```bash
npx tsc
node shop/main.ts
```

```text
原子筆：15 元
```

`npx tsc` 什麼都沒印，代表 `main.ts` 裡的 `Product` 和 `product.ts` 裡的是同一個型別。如果在 `main.ts` 把 `price` 寫成字串，一樣會被抓到，跟型別寫在同一個檔案時完全一樣。

### 沒有 `export` 就匯入不了

把 `product.ts` 第一行的 `export` 拿掉，變成 `type Product = {`，再執行 `npx tsc`：

```text
shop/main.ts:2:15 - error TS2459: Module '"./product.ts"' declares 'Product' locally, but it is not exported.

2 import type { Product } from "./product.ts";
                ~~~~~~~

  shop/product.ts:1:6 - 'Product' is declared here.
    1 type Product = {
           ~~~~~~~


Found 1 error in shop/main.ts:2
```

「`./product.ts` 裡有宣告 `Product`，但沒有匯出」。跟函式一樣，沒有 `export` 的型別只能在自己的檔案裡用。後面縮排的那段是補充說明，指出 `Product` 宣告在 `product.ts` 的第 1 行。

確認完，把 `export` 加回去。

### 型別該放在哪裡

型別放在哪個檔案，沒有硬性規定。常見的做法有兩種：

- **跟使用它的函式放在一起**，就像上面的 `product.ts`。型別和處理它的程式碼在同一個地方，好找。
- **很多檔案都會用到的型別，集中放在一個 `types.ts`**，大家都從那裡匯入。

剛開始先用第一種，等你發現同一個型別被很多地方匯入，再搬到 `types.ts` 也不遲。這一章的綜合練習會讓你試試看。

## 重點整理

- 在 `type` 前面加 `export`，就能讓其他檔案匯入這個型別。
- 匯入型別寫成 `import type { 型別名稱 } from "檔案"`。
- 沒有 `export` 的型別只能在自己的檔案裡使用，匯入會出現 TS2459。
- 型別先跟使用它的程式碼放在一起，很多檔案都用到時再集中到 `types.ts`。
