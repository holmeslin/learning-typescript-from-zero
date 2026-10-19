# `keyof`

## 本集目標

用 `keyof` 取得一個物件型別所有屬性名稱的聯集。

## 正文

### 屬性名稱也是一種型別

建立 `key.ts`：

```ts,fails
type Product = { name: string; price: number; stock: number };

function printField(product: Product, key: keyof Product) {
  console.log(`${key}：${product[key]}`);
}

const pen = { name: "原子筆", price: 15, stock: 200 };
printField(pen, "price");
printField(pen, "color");
```

`keyof Product` 的意思是「`Product` 所有屬性名稱的聯集」，也就是：

```ts
type ProductKey = "name" | "price" | "stock";

const key: ProductKey = "price";
console.log(key);
```

所以 `printField` 的第二個參數只能是這三個字串之一。傳 `"color"` 會被擋下：

```text
key.ts:9:17 - error TS2345: Argument of type '"color"' is not assignable to parameter of type 'keyof Product'.

9 printField(pen, "color");
                  ~~~~~~~


Found 1 error in key.ts:9
```

如果用純 JavaScript，`printField(pen, "color")` 會安靜地印出 `color：undefined`。

### 為什麼不自己寫聯集

你當然可以自己寫 `"name" | "price" | "stock"`。但哪天 `Product` 多了一個 `category` 屬性，你就得記得回來改這個聯集。用 `keyof Product`，屬性名稱的清單永遠跟著 `Product` 走。

這是這一章的核心想法：**能從現有的型別算出來的，就不要再寫一遍。**

### 搭配上一集的 `typeof`

如果手上只有值、沒有型別，可以先用 `typeof` 取得型別，再用 `keyof`：

```ts
const defaultSettings = {
  theme: "light",
  fontSize: 16,
  showSidebar: true,
};

type SettingName = keyof typeof defaultSettings;

function reset(name: SettingName) {
  console.log(`把 ${name} 恢復成 ${defaultSettings[name]}`);
}

reset("fontSize");
```

```text
把 fontSize 恢復成 16
```

`keyof typeof defaultSettings` 要從右邊往左讀：先 `typeof defaultSettings` 取得型別，再 `keyof` 取得它的屬性名稱。這個組合非常常見，下面幾集還會一直看到。

### 搭配泛型

第 6 章的泛型約束，加上 `keyof`，就能寫出「第二個參數必須是第一個參數的屬性名稱」的函式：

```ts
function pluck<T, K extends keyof T>(items: T[], key: K) {
  return items.map((item) => item[key]);
}

const products = [
  { name: "原子筆", price: 15 },
  { name: "筆記本", price: 45 },
];

console.log(pluck(products, "name"));
console.log(pluck(products, "price"));
```

```text
[ '原子筆', '筆記本' ]
[ 15, 45 ]
```

`K extends keyof T` 的意思是「`K` 必須是 `T` 的屬性名稱之一」。所以 `pluck(products, "color")` 會報錯，`T` 是什麼物件，`K` 能放的字串就跟著變。

## 重點整理

- `keyof 型別` 會得到那個型別所有屬性名稱的聯集。
- 用 `keyof` 取代手寫的聯集，屬性改了，名稱清單會自動跟著變。
- `keyof typeof 變數` 可以從一個值取得它的屬性名稱。
- `K extends keyof T` 可以限制型別參數只能是某個物件的屬性名稱。
