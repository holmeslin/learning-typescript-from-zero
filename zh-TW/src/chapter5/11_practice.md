# 綜合練習

## 本集目標

用可辨識聯集描述訂單狀態，搭配窮舉檢查和型別守衛處理它。

## 正文

這一集沒有新東西，只有一個題目。請先自己做，卡住再看提示，最後再對照參考解答。

### 題目：訂單狀態

網路商店的訂單有四種狀態，每種狀態帶的資料不一樣。在 `ts-practice` 裡建立 `orders.ts`，先貼上這段：

```ts
type Pending = { status: "pending" };
type Shipped = { status: "shipped"; trackingNumber: string };
type Delivered = { status: "delivered"; deliveredAt: Date };
type Cancelled = { status: "cancelled"; reason: string };
type Order = Pending | Shipped | Delivered | Cancelled;

const orders: Order[] = [
  { status: "pending" },
  { status: "shipped", trackingNumber: "TW123456" },
  { status: "delivered", deliveredAt: new Date(2026, 9, 18) },
  { status: "cancelled", reason: "缺貨" },
];

console.log(orders.length);
```

請完成下面的事：

1. 寫一個函式 `describeOrder(order: Order): string`，依照狀態回傳說明文字：
   - 處理中：`處理中`
   - 已出貨：`已出貨，追蹤碼 TW123456`
   - 已送達：`已送達（2026/10/18）`
   - 已取消：`已取消：缺貨`
2. 在 `describeOrder` 裡加上窮舉檢查。
3. 寫一個型別守衛 `isActive`，「處理中」和「已出貨」算是進行中的訂單。
4. 用 `for...of` 印出每筆訂單的說明，再用 `filter` 搭配 `isActive` 算出進行中的訂單有幾筆。

把最後的 `console.log(orders.length)` 換掉之後，`node orders.ts` 的輸出應該是：

```text
處理中
已出貨，追蹤碼 TW123456
已送達（2026/10/18）
已取消：缺貨
進行中的訂單：2 筆
```

### 提示

- 第 1 題用 `switch (order.status)`，每個 `case` 裡 `order` 會被縮小成對應的型別。
- 日期的格式用第 6 集的 `toLocaleDateString("zh-TW")`。
- 第 2 題的 `default` 裡，把 `order` 放進 `never` 型別的變數。因為函式要回傳字串，`default` 裡可以直接回傳那個變數：`never` 可以放進任何型別。
- 第 3 題的回傳型別是 `order is Pending | Shipped`。`is` 後面也可以接聯集。
- `orders.filter(isActive)` 可以直接把函式傳進去。

### 參考解答

做完再看。

<details>
<summary>展開參考解答</summary>

```ts
type Pending = { status: "pending" };
type Shipped = { status: "shipped"; trackingNumber: string };
type Delivered = { status: "delivered"; deliveredAt: Date };
type Cancelled = { status: "cancelled"; reason: string };
type Order = Pending | Shipped | Delivered | Cancelled;

function describeOrder(order: Order): string {
  switch (order.status) {
    case "pending":
      return "處理中";
    case "shipped":
      return `已出貨，追蹤碼 ${order.trackingNumber}`;
    case "delivered":
      return `已送達（${order.deliveredAt.toLocaleDateString("zh-TW")}）`;
    case "cancelled":
      return `已取消：${order.reason}`;
    default: {
      const unhandled: never = order;
      return unhandled;
    }
  }
}

function isActive(order: Order): order is Pending | Shipped {
  return order.status === "pending" || order.status === "shipped";
}

const orders: Order[] = [
  { status: "pending" },
  { status: "shipped", trackingNumber: "TW123456" },
  { status: "delivered", deliveredAt: new Date(2026, 9, 18) },
  { status: "cancelled", reason: "缺貨" },
];

for (const order of orders) {
  console.log(describeOrder(order));
}

const active = orders.filter(isActive);
console.log(`進行中的訂單：${active.length} 筆`);
```

幾個值得注意的地方：

- 每個 `case` 裡，`order` 都被縮小成對應的型別，所以 `order.trackingNumber` 只能在 `"shipped"` 裡用。試著把它搬到 `"pending"` 裡，看看會出現什麼錯誤。
- `default` 裡的 `unhandled` 是 `never`，`never` 可以放進任何型別，所以 `return unhandled` 符合回傳型別 `string`。正常情況下這行永遠不會執行到。
- `active` 的型別是 `(Pending | Shipped)[]`，型別守衛讓 `filter` 的結果也縮小了。

</details>

### 延伸挑戰

- 新增一種狀態 `{ status: "returned"; refund: number }`（已退貨，帶退款金額），加進 `Order` 聯集。先不改 `describeOrder`，執行 `npx tsc`，看看窮舉檢查怎麼提醒你，再把它補上。
- 用 `for...of` 走訪 `active`，把游標移到迴圈變數上，看看它的型別是什麼，再試著讀它的 `reason` 屬性。

## 重點整理

- 狀態不同、資料不同的東西，用可辨識聯集描述。
- `switch` 判斷標籤欄位，每個 `case` 裡都能用那種狀態才有的資料。
- 窮舉檢查讓新增的狀態不會被漏掉。
- 型別守衛可以直接傳給 `filter`，結果的型別也會跟著縮小。
