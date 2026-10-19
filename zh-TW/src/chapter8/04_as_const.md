# `as const`

## 本集目標

用 `as const` 讓值保留最精確的型別，並用它取代 `enum`。

## 正文

### 陣列的型別太寬了

第 5 章用字面值型別寫過飲料的尺寸：

```ts
type Size = "小" | "中" | "大";

const mine: Size = "中";
console.log(mine);
```

如果程式裡還需要一個「所有尺寸」的陣列，例如用來產生選單，你得再寫一次：

```ts
const sizes = ["小", "中", "大"];

for (const size of sizes) {
  console.log(size);
}
```

同樣三個值，型別寫一遍、陣列又寫一遍。能不能用第 1 集的 `typeof` 從陣列取得型別？問題是 `sizes` 被推論成 `string[]`，它只記得「這是字串陣列」，不記得裡面是哪三個字串。

### 在值後面加 `as const`

```ts,fails
const sizes = ["小", "中", "大"] as const;
sizes.push("特大");
console.log(sizes);
```

`as const` 告訴 TypeScript：「這個值寫好了就不會再變，請推論成最精確的型別」。`npx tsc` 的錯誤訊息剛好讓你看到它推論成什麼：

```text
sizes.ts:2:7 - error TS2339: Property 'push' does not exist on type 'readonly ["小", "中", "大"]'.

2 sizes.push("特大");
        ~~~~


Found 1 error in sizes.ts:2
```

`sizes` 的型別變成了 `readonly ["小", "中", "大"]`：

- 不再是 `string[]`，而是第 2 章學過的元組，每個位置是哪個字面值都記得清清楚楚。
- 前面多了第 3 章學過的 `readonly`，所以沒有 `push`。

有一件事要注意：`as const` 只是型別。用 `node` 執行，`push` 還是會成功，印出 `[ '小', '中', '大', '特大' ]`。就像第 1 章說的，型別在執行時會被拿掉，`as const` 只能讓 `tsc` 幫你擋，不會真的把陣列鎖起來。

### 從陣列取出聯集

有了精確的型別，用上一集的 `[number]` 就能取出所有元素的聯集。建立 `size-type.ts`：

```ts,fails
const sizes = ["小", "中", "大"] as const;
type Size = (typeof sizes)[number];

const mine: Size = "特大";
console.log(mine);
```

```text
size-type.ts:4:7 - error TS2322: Type '"特大"' is not assignable to type '"中" | "大" | "小"'.

4 const mine: Size = "特大";
        ~~~~


Found 1 error in size-type.ts:4
```

`Size` 就是 `"小" | "中" | "大"`。錯誤訊息裡聯集的順序跟你寫的不一樣，這不影響意思，聯集本來就沒有順序。

現在陣列和型別只寫一次：要加一個尺寸，改陣列就好，`Size` 會自動跟著變。

### 取代 `enum`

第 1 章說過，`enum` 在 Node.js 不能直接執行，這本書會教更好的替代寫法。就是這個。

很多語言用 `enum` 表示「一組有名字的固定值」，例如訂單狀態。用 `as const` 物件可以做到同樣的事。建立 `status.ts`：

```ts,fails
const OrderStatus = {
  Pending: "pending",
  Shipped: "shipped",
  Cancelled: "cancelled",
} as const;

type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

function describe(status: OrderStatus) {
  console.log(`訂單狀態：${status}`);
}

describe(OrderStatus.Shipped);
describe("cancelled");
describe("refunded");
```

一行一行看：

- `OrderStatus` 物件加了 `as const`，所以 `OrderStatus.Shipped` 的型別是 `"shipped"`，不是 `string`。
- `keyof typeof OrderStatus` 是 `"Pending" | "Shipped" | "Cancelled"`，所有屬性名稱。
- 再用索引存取取出所有屬性的值：`"pending" | "shipped" | "cancelled"`，取名叫 `OrderStatus`。

值和型別取同一個名字是可以的。TypeScript 看位置分辨：寫在程式碼裡的 `OrderStatus.Shipped` 是物件，寫在型別位置的 `status: OrderStatus` 是型別。

```text
status.ts:15:10 - error TS2345: Argument of type '"refunded"' is not assignable to parameter of type 'OrderStatus'.

15 describe("refunded");
            ~~~~~~~~~~


Found 1 error in status.ts:15
```

`OrderStatus.Shipped` 和直接寫 `"cancelled"` 都可以，打錯或不存在的狀態會被擋下。跟 `enum` 比起來，這種寫法：

- 拿掉型別之後就是普通的 JavaScript 物件，Node.js 可以直接執行。
- 型別就是字面值的聯集，第 5 章學的型別縮小、窮舉檢查全部可以用。

你在別人的程式碼裡看到 `enum` 時，附錄會說明怎麼看懂它。

## 重點整理

- 在值後面加 `as const`，TypeScript 會推論出最精確的型別：字面值、唯讀、元組。
- `as const` 只影響型別檢查，執行時不會真的把值鎖起來。
- `(typeof 陣列)[number]` 可以從 `as const` 陣列取出所有元素的聯集。
- 用 `as const` 物件加上 `(typeof X)[keyof typeof X]`，可以取代 `enum`。
