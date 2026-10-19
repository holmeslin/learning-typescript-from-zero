# 索引存取型別

## 本集目標

用 `型別["屬性名稱"]` 取得某個屬性的型別。

## 正文

### 像讀屬性一樣讀型別

在 JavaScript 裡，`product["price"]` 會拿到 `price` 屬性的值。型別也有一模一樣的寫法。建立 `price.ts`：

```ts,fails
type Product = { name: string; price: number; stock: number };

type Price = Product["price"];
const price: Price = "十五元";
console.log(price);
```

`Product["price"]` 的意思是「`Product` 型別裡 `price` 屬性的型別」，也就是 `number`。這種寫法叫**索引存取型別**（indexed access type）。

```text
price.ts:4:7 - error TS2322: Type 'string' is not assignable to type 'number'.

4 const price: Price = "十五元";
        ~~~~~


Found 1 error in price.ts:4
```

注意中括號裡是**字串的字面值型別** `"price"`，不能寫成 `Product.price`。

### 一次取好幾個

中括號裡放聯集，會得到那幾個屬性型別的聯集：

```ts
type Product = { name: string; price: number; stock: number };

type NameOrPrice = Product["name" | "price"];

const a: NameOrPrice = "原子筆";
const b: NameOrPrice = 15;
console.log(a, b);
```

`NameOrPrice` 是 `string | number`。放上一集的 `keyof Product`，就是「所有屬性的型別」：`Product[keyof Product]` 也是 `string | number`。

### 陣列元素的型別：`[number]`

陣列的索引是數字，所以「陣列裡元素的型別」寫成 `[number]`：

```ts
const cart = [
  { name: "原子筆", price: 15 },
  { name: "筆記本", price: 45 },
];

type CartItem = (typeof cart)[number];

function describe(item: CartItem) {
  return `${item.name}：${item.price} 元`;
}

console.log(describe(cart[0]));
```

```text
原子筆：15 元
```

`(typeof cart)[number]` 要拆開讀：`typeof cart` 是 `{ name: string; price: number }[]`，再用 `[number]` 取出「用數字索引拿到的東西」，也就是陣列元素的型別。小括號可以不寫，但加上比較好讀。

這個寫法下一集會用到。

### 搭配泛型：拿什麼就回傳什麼型別

上一集的 `keyof` 加上索引存取，可以寫出「回傳型別跟著屬性名稱變」的函式。建立 `getprop.ts`：

```ts,fails
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const pen = { name: "原子筆", price: 15 };
const label: string = getProperty(pen, "price");
console.log(label);
```

回傳型別 `T[K]` 的意思是「`T` 型別裡 `K` 屬性的型別」。傳 `"price"` 進去，回傳型別就是 `number`，放不進 `string` 的變數：

```text
getprop.ts:6:7 - error TS2322: Type 'number' is not assignable to type 'string'.

6 const label: string = getProperty(pen, "price");
        ~~~~~


Found 1 error in getprop.ts:6
```

傳 `"name"` 進去，回傳型別就變成 `string`。同一個函式，回傳的型別隨著你拿的屬性改變，這是用 `any` 做不到的。

## 重點整理

- `型別["屬性名稱"]` 會得到那個屬性的型別，叫索引存取型別。
- 中括號裡放聯集，會得到那幾個屬性型別的聯集。
- `陣列型別[number]` 會得到陣列元素的型別。
- `T[K]` 搭配 `K extends keyof T`，可以讓回傳型別跟著屬性名稱變。
