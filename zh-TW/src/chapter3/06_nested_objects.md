# 巢狀物件與物件陣列

## 本集目標

替「物件裡面有物件」、「陣列裡面放物件」的資料寫型別。

## 正文

### 物件裡面有物件

客戶有名字，也有地址，而地址本身又是一個物件。建立 `shop.ts`：

```ts
type Address = {
  city: string;
  street: string;
};

type Customer = {
  name: string;
  address: Address;
};

const customer: Customer = {
  name: "小明",
  address: { city: "台中", street: "中港路" },
};

console.log(customer.address.city);
```

屬性的型別可以是另一個物件型別。先把 `Address` 定義好，再在 `Customer` 裡用它。這樣 `Address` 也可以拿去給別的型別用，例如店家的地址。

### 物件陣列

第 2 章學過 `string[]` 是字串陣列。同樣的寫法，`Product[]` 就是「放著 `Product` 的陣列」：

```ts
type Product = {
  name: string;
  price: number;
};

const products: Product[] = [
  { name: "鍵盤", price: 1200 },
  { name: "滑鼠", price: 600 },
];

const names = products.map((p) => p.name);
const total = products.reduce((sum, p) => sum + p.price, 0);
console.log(names, total);
```

```text
[ '鍵盤', '滑鼠' ] 1800
```

注意 `map` 和 `reduce` 裡的 `p` 沒有標型別。TypeScript 知道 `products` 是 `Product[]`，所以知道裡面每一個 `p` 都是 `Product`。把游標移到 `p` 上面就看得到。`names` 也被推論成 `string[]`，`total` 是 `number`。

callback 的參數通常都不用自己標，第 4 章會再講原因。

### 直接寫在裡面

如果內層的形狀只在這裡用一次，也可以不取名字，直接寫在屬性的型別裡：

```ts
type Order = {
  id: number;
  items: { name: string; quantity: number }[];
};

const order: Order = {
  id: 1,
  items: [
    { name: "鍵盤", quantity: 1 },
    { name: "滑鼠", quantity: 2 },
  ],
};
console.log(order.items.length);
```

`{ name: string; quantity: number }[]` 是「這種物件組成的陣列」。

要取名字還是直接寫？沒有硬性規定。一個簡單的判斷方式：**會在兩個以上的地方用到，或是寫在裡面讓人看不懂，就取名字**。

## 重點整理

- 屬性的型別可以是另一個物件型別，一層一層組起來。
- `Product[]` 是物件陣列，寫法和 `string[]` 一樣。
- 陣列的型別確定之後，`map`、`reduce` 的 callback 參數會自動推論出型別。
- 只用一次的形狀可以直接寫在裡面，重複用到的就取名字。
