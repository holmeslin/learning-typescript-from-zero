# 綜合練習

## 本集目標

用這一章的型別運算，從少數幾個「真正的資料」推導出所有需要的型別。

## 正文

這一集沒有新東西，只有一個題目。請先自己寫，卡住再看提示，最後再對照參考解答。

### 題目：飲料店點單

建立 `drinks.ts`，開頭是這兩個陣列，它們是整個程式唯一的「資料來源」：

```ts
const DRINKS = ["紅茶", "綠茶", "奶茶"] as const;
const SIZES = ["中", "大"] as const;

console.log(DRINKS, SIZES);
```

請在下面寫出這些東西。**規則：飲料和尺寸的名稱只能出現在上面兩個陣列裡**，型別和其他地方都不准再手寫一次 `"紅茶"`、`"中"` 這些字串（測試程式碼除外）。

1. 型別 `Drink` 和 `Size`：從兩個陣列取出。
2. `basePrices`：每種飲料的基本價格，紅茶 30、綠茶 30、奶茶 45。要做到「`DRINKS` 多加一種飲料，這裡就會報錯」。
3. `sizeExtra`：每種尺寸要加的錢，中杯 0、大杯 10。用 `satisfies` 檢查格式。
4. 型別 `Order`：有 `id`（數字）、`drink`、`size`、`note`（字串）。
5. 函式 `createOrder`：收一個「沒有 `id` 的 `Order`」，自動編號後回傳完整的 `Order`。
6. 函式 `updateOrder`：收一張訂單和要修改的欄位，回傳新的訂單。`id` 不能改，其他欄位可以只改一部分。
7. 函式 `priceOf`：只需要 `drink` 和 `size` 就能算出價格。

測試程式碼（貼在你寫的東西下面）：

```ts,ignore
const order = createOrder({ drink: "奶茶", size: "中", note: "少冰" });
console.log(order, priceOf(order));

const bigger = updateOrder(order, { size: "大" });
console.log(bigger, priceOf(bigger));

for (const drink of DRINKS) {
  console.log(`${drink}（大）：${priceOf({ drink, size: "大" })} 元`);
}
```

預期的輸出：

```text
{ id: 1, drink: '奶茶', size: '中', note: '少冰' } 45
{ id: 1, drink: '奶茶', size: '大', note: '少冰' } 55
紅茶（大）：40 元
綠茶（大）：40 元
奶茶（大）：55 元
```

寫完之後，把下面四行也貼進去，確認 `npx tsc` 會把它們**全部擋下**，再刪掉：

```ts,ignore
createOrder({ id: 99, drink: "紅茶", size: "中", note: "" });
updateOrder(order, { drink: "珍奶" });
updateOrder(order, { id: 5 });
priceOf({ drink: "紅茶", size: "特大" });
```

### 提示

- 第 1 題：第 4 集的 `(typeof 陣列)[number]`。
- 第 2 題：第 7 集的 `Record<聯集, 值的型別>`。
- 第 5 題：參數型別用 `Omit`。
- 第 6 題：「不能改 `id`」是 `Omit`，「只改一部分」是 `Partial`，兩個可以疊在一起用。
- 第 7 題：參數型別用 `Pick`。這樣 `priceOf` 就能直接收 `{ drink, size: "大" }` 這種不是完整訂單的物件。

### 參考解答

寫完再看。

<details>
<summary>展開參考解答</summary>

```ts
const DRINKS = ["紅茶", "綠茶", "奶茶"] as const;
const SIZES = ["中", "大"] as const;

type Drink = (typeof DRINKS)[number];
type Size = (typeof SIZES)[number];

const basePrices: Record<Drink, number> = {
  "紅茶": 30,
  "綠茶": 30,
  "奶茶": 45,
};

const sizeExtra = {
  "中": 0,
  "大": 10,
} satisfies Record<Size, number>;

type Order = {
  id: number;
  drink: Drink;
  size: Size;
  note: string;
};

let nextId = 1;

function createOrder(input: Omit<Order, "id">): Order {
  return { id: nextId++, ...input };
}

function updateOrder(
  order: Order,
  changes: Partial<Omit<Order, "id">>,
): Order {
  return { ...order, ...changes };
}

function priceOf(item: Pick<Order, "drink" | "size">): number {
  return basePrices[item.drink] + sizeExtra[item.size];
}

const order = createOrder({ drink: "奶茶", size: "中", note: "少冰" });
console.log(order, priceOf(order));

const bigger = updateOrder(order, { size: "大" });
console.log(bigger, priceOf(bigger));

for (const drink of DRINKS) {
  console.log(`${drink}（大）：${priceOf({ drink, size: "大" })} 元`);
}
```

幾個值得注意的地方：

- `basePrices` 用型別標註 `Record<Drink, number>`，`sizeExtra` 用 `satisfies`，兩種都可以。題目要求的「多一種飲料就報錯」，靠的是 `Record` 的第一個型別參數是聯集，不是哪一種寫法。
- `Partial<Omit<Order, "id">>` 要從裡面往外讀：先拿掉 `id`，再讓剩下的屬性都變成可選。
- `for (const drink of DRINKS)` 裡的 `drink`，型別自動就是 `Drink`，所以可以直接傳給 `priceOf`。這是 `as const` 的好處：陣列記得每個元素的確切型別。
- 整個程式裡，`"紅茶"` 這些字串只在 `DRINKS` 和 `basePrices` 出現。`basePrices` 的屬性名稱雖然也寫了一次，但寫錯或漏寫都會被 `Record<Drink, number>` 擋下，不會失去同步。

</details>

### 延伸挑戰

- 在 `DRINKS` 加上 `"烏龍茶"`，看看 `npx tsc` 在哪裡報錯，補上之後再執行一次。
- 加一個型別 `OrderLabel`，用樣板字面值型別表示「`大杯紅茶`」這種字串，也就是 `` `${Size}杯${Drink}` ``，再寫一個函式回傳訂單的 `OrderLabel`。

## 重點整理

- 用 `as const` 陣列當作唯一的資料來源，型別全部從它推導出來。
- `Record<聯集, 型別>` 可以確保每一個選項都有對應的值。
- `Omit`、`Partial`、`Pick` 可以疊在一起用，從一個型別產生各種用途的版本。
- 型別從資料推導出來，資料改了，型別和檢查會自動跟著變。
