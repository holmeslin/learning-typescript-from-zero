# 綜合練習

## 本集目標

幫一段使用了各種參數的 JavaScript 程式加上型別。

## 正文

這一集沒有新東西，只有一個題目。請先自己做，卡住再看提示，最後再對照參考解答。

### 題目：訂單折扣

下面這段 JavaScript 用到了這一章所有的參數寫法：其餘參數、預設參數、物件參數，還有 callback。

```js
function applyDiscounts(price, ...rates) {
  let result = price;
  for (const rate of rates) {
    result = result * rate;
  }
  return Math.round(result);
}

function formatPrice(amount, currency = "NT$") {
  return `${currency} ${amount}`;
}

function processOrder({ item, price, coupon }, onDone) {
  let final = applyDiscounts(price, 0.9);
  if (coupon) {
    final = applyDiscounts(price, 0.9, coupon);
  }
  onDone(item, formatPrice(final));
}

processOrder({ item: "耳機", price: 2000 }, (item, text) => {
  console.log(`${item}：${text}`);
});
processOrder({ item: "喇叭", price: 3500, coupon: 0.8 }, (item, text) => {
  console.log(`${item}：${text}`);
});
```

請完成下面的事：

1. 在 `ts-practice` 裡建立 `order.ts`，把程式碼整段貼進去，執行 `npx tsc`，看看有幾個錯誤。
2. 用 `type` 定義一個 `Order`，描述訂單物件。`coupon` 是可選的。
3. 用 `type` 定義一個 `OrderCallback`，描述 `onDone` 這個 callback。
4. 幫所有函式的參數補上型別，並幫 `applyDiscounts` 和 `formatPrice` 寫上回傳型別。
5. 直到 `npx tsc` 什麼都不印，再用 `node order.ts` 執行，確認輸出是：

```text
耳機：NT$ 1800
喇叭：NT$ 2520
```

### 提示

- 第 1 步會看到 TS7006、TS7019、TS7031 好幾種錯誤，它們說的都是同一件事：參數沒有型別，被當成了 `any`。
- 其餘參數 `rates` 的型別是陣列。
- `formatPrice` 的 `currency` 有預設值，不用寫型別。
- 物件參數的型別要寫在整個 `{ }` 後面，不要寫在大括號裡面。
- `onDone` 會收到兩個字串，不需要回傳東西。
- 最下面兩個箭頭函式的 `item`、`text` 不用自己補型別。`onDone` 有了型別之後，它們的錯誤會自己消失。

### 參考解答

做完再看。

<details>
<summary>展開參考解答</summary>

```ts
type Order = {
  item: string;
  price: number;
  coupon?: number;
};

type OrderCallback = (item: string, text: string) => void;

function applyDiscounts(price: number, ...rates: number[]): number {
  let result = price;
  for (const rate of rates) {
    result = result * rate;
  }
  return Math.round(result);
}

function formatPrice(amount: number, currency = "NT$"): string {
  return `${currency} ${amount}`;
}

function processOrder({ item, price, coupon }: Order, onDone: OrderCallback) {
  let final = applyDiscounts(price, 0.9);
  if (coupon) {
    final = applyDiscounts(price, 0.9, coupon);
  }
  onDone(item, formatPrice(final));
}

processOrder({ item: "耳機", price: 2000 }, (item, text) => {
  console.log(`${item}：${text}`);
});
processOrder({ item: "喇叭", price: 3500, coupon: 0.8 }, (item, text) => {
  console.log(`${item}：${text}`);
});
```

幾個值得注意的地方：

- 第 1 步一共有 12 個錯誤，其中一個是 TS2741，說第一筆訂單少了 `coupon`。因為還沒有型別時，TypeScript 只能從解構的寫法猜，把三個屬性都當成必填。定義了 `Order`、把 `coupon` 標成可選之後，這個錯誤就消失了。
- `coupon` 是可選屬性，型別是 `number | undefined`。用 `if (coupon)` 確認有值之後，才傳給 `applyDiscounts`。
- `processOrder` 沒有寫回傳型別，它沒有 `return`，TypeScript 會推論出 `void`。要寫成 `: void` 也可以。
- 最下面的兩個箭頭函式完全沒有改。`onDone` 標成 `OrderCallback` 之後，TypeScript 就知道 `item` 和 `text` 是字串。

</details>

### 延伸挑戰

- 把兩個 `processOrder` 呼叫裡重複的箭頭函式，抽出來存成一個 `const printResult: OrderCallback`，再傳給兩次呼叫。
- 在 `formatPrice` 呼叫時故意傳一個數字當 `currency`，例如 `formatPrice(final, 1)`，看看錯誤訊息怎麼說。

## 重點整理

- 其餘參數標陣列型別，預設參數交給推論，物件參數的型別寫在整個 `{ }` 後面。
- 把物件型別和 callback 型別用 `type` 取名字，函式的參數列會清楚很多。
- callback 的參數有了型別之後，傳進去的箭頭函式就不用再寫型別。
