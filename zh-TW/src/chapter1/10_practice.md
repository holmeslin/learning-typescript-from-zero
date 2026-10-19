# 綜合練習

## 本集目標

把一段 JavaScript 改成 TypeScript，用 `npx tsc` 找出裡面藏著的錯誤。

## 正文

這一集沒有新東西，只有一個題目。請先自己做，卡住再看提示，最後再對照參考解答。

### 題目：文具店結帳

下面這段 JavaScript 可以執行，但結果是錯的：

```js
function subtotal(price, quantity) {
  return price * quantity;
}

function formatPrice(amount) {
  return `${amount.toFixed(0)} 元`;
}

const items = [
  { name: "筆記本", price: 45, quantity: 3 },
  { name: "原子筆", price: 15, quantity: 10 },
];

let total = 0;
for (const item of items) {
  total += subtotal(item.price, item.qty);
}

const discount = "50";
console.log(`總計：${formatPrice(total - discount)}`);
console.log(`共 ${items.length} 項商品`);
```

用 Node.js 執行，會印出：

```text
總計：NaN 元
共 2 項商品
```

`NaN` 是「不是數字」的意思，代表計算過程中有地方出錯了，但 JavaScript 沒有告訴你是哪裡。

請完成下面的事：

1. 在 `ts-practice` 裡建立 `cart.ts`，把上面的程式碼整段貼進去。
2. 執行 `npx tsc`，看看會出現什麼錯誤。
3. 幫三個函式的參數加上型別標註，再執行一次 `npx tsc`。
4. 根據錯誤訊息，把錯誤一個一個改掉，直到 `npx tsc` 什麼都不印。
5. 用 `node cart.ts` 執行，確認輸出是：

```text
總計：235 元
共 2 項商品
```

### 提示

- 第 2 步的錯誤是 TS7006，這是在提醒你參數還沒標型別。
- 三個參數都是數字。
- 加完型別之後，會出現兩個新的錯誤。其中一個是 TS2339，回頭看看 `items` 裡的物件有哪些屬性。
- 另一個錯誤在說減號右邊的東西不是數字。

### 參考解答

做完再看。

<details>
<summary>展開參考解答</summary>

加上參數型別之後，`npx tsc` 會印出：

```text
cart.ts:16:38 - error TS2339: Property 'qty' does not exist on type '{ name: string; price: number; quantity: number; }'.

16   total += subtotal(item.price, item.qty);
                                        ~~~

cart.ts:20:39 - error TS2363: The right-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.

20 console.log(`總計：${formatPrice(total - discount)}`);
                                         ~~~~~~~~


Found 2 errors in the same file, starting at: cart.ts:16
```

- 第一個錯誤：物件的屬性叫 `quantity`，不是 `qty`。在 JavaScript 裡，`item.qty` 是 `undefined`，乘起來就變成 `NaN`。
- 第二個錯誤：「算術運算的右邊必須是數字」。`discount` 是字串 `"50"`，應該寫成數字 `50`。

改好的程式碼：

```ts
function subtotal(price: number, quantity: number) {
  return price * quantity;
}

function formatPrice(amount: number) {
  return `${amount.toFixed(0)} 元`;
}

const items = [
  { name: "筆記本", price: 45, quantity: 3 },
  { name: "原子筆", price: 15, quantity: 10 },
];

let total = 0;
for (const item of items) {
  total += subtotal(item.price, item.quantity);
}

const discount = 50;
console.log(`總計：${formatPrice(total - discount)}`);
console.log(`共 ${items.length} 項商品`);
```

幾個值得注意的地方：

- 只有函式參數需要加型別。`items`、`total`、`discount` 都交給型別推論，TypeScript 一樣知道它們的型別。
- `item.qty` 的錯字，在 JavaScript 裡完全不會報錯，在 TypeScript 裡連參數型別都不用加就抓得到，因為 `items` 的型別是推論出來的。
- 如果你在 VS Code 裡打 `item.`，自動完成清單裡根本沒有 `qty`，一開始就不會打錯。

</details>

### 延伸挑戰

- 幫三個函式都加上回傳型別。`formatPrice` 回傳的是什麼型別？
- 試著呼叫 `formatPrice("235")`，看看會出現哪一種錯誤，對照第 5 集的句型讀懂它。

## 重點整理

- 把 `.js` 改成 `.ts`、幫參數加上型別，就能讓 `tsc` 幫你找出藏起來的錯誤。
- 照著錯誤訊息的位置和說明，從第一個錯誤開始改。
- 大部分的變數交給型別推論，參數才需要自己寫。
