# 綜合練習

## 本集目標

用類別、`interface`、`#` 私有欄位和 `readonly`，寫出一個有折扣功能的購物車。

## 正文

這一集沒有新東西，只有一個題目。請先自己寫，卡住再看提示，最後再對照參考解答。

### 題目：咖啡店購物車

在 `ts-practice` 裡建立 `shop.ts`，完成下面的東西：

1. 一個 `interface Discount`，規定折扣要有：
   - `name`：折扣的名稱，字串。
   - `apply`：一個方法，收原價（數字），回傳折扣後的價格（數字）。
2. 一個類別 `PercentOff`，符合 `Discount`：
   - 建立時傳入折數，例如 `new PercentOff(0.9)` 代表打九折。
   - `name` 是 `打 9 折` 這種格式。
   - `apply` 回傳原價乘以折數，四捨五入成整數。
3. 一個類別 `FixedOff`，符合 `Discount`：
   - 建立時傳入要折抵的金額，例如 `new FixedOff(100)`。
   - `name` 是 `折 100 元` 這種格式。
   - `apply` 回傳原價減掉折抵金額，但最低是 0，不能變成負數。
4. 一個類別 `Cart`：
   - 用 `#` 私有欄位存放商品，每個商品有 `name`（字串）和 `price`（數字）。外面不能直接改商品清單。
   - `add(name, price)` 方法加入一個商品。
   - `total(discount)` 方法回傳總金額。`discount` 可以不傳；有傳的話，回傳套用折扣後的金額。
5. 折數和折抵金額建立後就不能再改。

寫完之後，在檔案最後加上這段測試程式碼：

```ts,ignore
const cart = new Cart();
cart.add("咖啡豆", 450);
cart.add("濾杯", 300);

const discounts: Discount[] = [
  new PercentOff(0.9),
  new FixedOff(100),
  new FixedOff(1000),
];

console.log(`原價：${cart.total()} 元`);
for (const discount of discounts) {
  console.log(`${discount.name}：${cart.total(discount)} 元`);
}
```

`npx tsc` 不能有錯誤，`node shop.ts` 的輸出要是：

```text
原價：750 元
打 9 折：675 元
折 100 元：650 元
折 1000 元：0 元
```

### 提示

- `interface` 裡的方法寫成 `apply(price: number): number;`，參考第 8 集。
- `name` 在建構子裡用樣板字面值組出來。`0.9 * 10` 是 `9`。
- 四捨五入用 `Math.round`，取兩個數字中比較大的用 `Math.max`。
- 「建立後就不能改」用 `readonly`，「外面看不到」用 `#`，兩個可以一起用。
- 商品清單的型別可以寫成 `{ name: string; price: number }[]`，初始值是空陣列。
- `total` 的參數用第 4 章的可選參數。有沒有傳，用 `if (discount)` 判斷。

### 參考解答

寫完再看。

<details>
<summary>展開參考解答</summary>

```ts
interface Discount {
  name: string;
  apply(price: number): number;
}

class PercentOff implements Discount {
  readonly name: string;
  readonly #rate: number;

  constructor(rate: number) {
    this.#rate = rate;
    this.name = `打 ${rate * 10} 折`;
  }

  apply(price: number): number {
    return Math.round(price * this.#rate);
  }
}

class FixedOff implements Discount {
  readonly name: string;
  readonly #amount: number;

  constructor(amount: number) {
    this.#amount = amount;
    this.name = `折 ${amount} 元`;
  }

  apply(price: number): number {
    return Math.max(price - this.#amount, 0);
  }
}

class Cart {
  #items: { name: string; price: number }[] = [];

  add(name: string, price: number): void {
    this.#items.push({ name, price });
  }

  total(discount?: Discount): number {
    let sum = 0;
    for (const item of this.#items) {
      sum += item.price;
    }
    if (discount) {
      return discount.apply(sum);
    }
    return sum;
  }
}

const cart = new Cart();
cart.add("咖啡豆", 450);
cart.add("濾杯", 300);

const discounts: Discount[] = [
  new PercentOff(0.9),
  new FixedOff(100),
  new FixedOff(1000),
];

console.log(`原價：${cart.total()} 元`);
for (const discount of discounts) {
  console.log(`${discount.name}：${cart.total(discount)} 元`);
}
```

幾個值得注意的地方：

- `name` 也加了 `readonly`。折扣建立之後，名稱跟著折數走，不該被單獨改掉。
- `#rate` 和 `#amount` 同時是 `readonly` 和 `#`：外面看不到，裡面也改不了。
- `Cart` 不需要建構子，`#items` 在宣告的地方就給了初始值。
- `discounts` 的型別是 `Discount[]`，裡面放了兩種不同的類別。`for...of` 裡只用到 `name` 和 `apply`，這兩個是 `Discount` 保證有的。
- 這一題用 `interface` 而不是抽象類別，因為 `PercentOff` 和 `FixedOff` 沒有共用的程式碼，只是形狀一樣。

</details>

### 延伸挑戰

- 試著在測試程式碼最後加一行 `cart.#items = [];`，看看 `npx tsc` 和 `node` 各會說什麼。
- 加一個 `static` 屬性，記錄總共建立了幾台購物車。
- 再寫一個 `BuyOver` 折扣：滿 500 元折 50 元，未滿不折。測試程式碼裡的迴圈完全不用改，直接放進 `discounts` 陣列就能用。

## 重點整理

- 用 `interface` 規定形狀，用 `implements` 讓類別照著做。
- `#` 讓資料只能透過方法操作，`readonly` 讓建立後的設定不會被改掉。
- 參數型別寫介面，任何符合規定的類別都能傳進去，新增功能時不用改原本的程式碼。
