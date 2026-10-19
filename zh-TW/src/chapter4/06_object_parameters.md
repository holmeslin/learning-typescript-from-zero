# 物件參數與解構

## 本集目標

用物件當參數，並且在解構的同時標上型別，避開一個很常見的陷阱。

## 正文

參數一多，呼叫的時候就容易搞混順序。`createProduct("鉛筆", 10, 30)` 裡的 `10` 和 `30`，哪個是價格、哪個是庫存？常見的做法是改成傳一個物件，每個值都有名字。

### 物件參數的型別

參數是物件，型別就寫第 3 章學的物件型別：

```ts
function showProduct({ title, price }: { title: string; price: number }) {
  console.log(`${title}：${price} 元`);
}

showProduct({ title: "鉛筆", price: 10 });
```

```text
鉛筆：10 元
```

冒號前面是解構，冒號後面是整個物件的型別。這一行有點長，所以實務上通常會先用型別別名把物件型別取個名字：

```ts
type Product = {
  title: string;
  price: number;
  stock?: number;
};

function showProduct({ title, price, stock = 0 }: Product) {
  console.log(`${title}：${price} 元，庫存 ${stock} 個`);
}

showProduct({ title: "鉛筆", price: 10, stock: 30 });
showProduct({ title: "橡皮擦", price: 15 });
```

```text
鉛筆：10 元，庫存 30 個
橡皮擦：15 元，庫存 0 個
```

`stock` 是可選屬性，解構時用 `stock = 0` 給它預設值，函式裡面就不用擔心它是 `undefined`。這和第 4 集的預設參數是同樣的道理。

### 陷阱：型別不能寫在解構裡面

剛學的時候，很多人會想把型別直接寫在每個名稱後面。建立 `product.ts`：

```ts,fails
function showProduct({ title: string, price: number }) {
  console.log(`${title}：${price} 元`);
}

showProduct({ title: "鉛筆", price: 10 });
```

```text
product.ts:1:31 - error TS7031: Binding element 'string' implicitly has an 'any' type.

1 function showProduct({ title: string, price: number }) {
                                ~~~~~~

product.ts:1:46 - error TS7031: Binding element 'number' implicitly has an 'any' type.

1 function showProduct({ title: string, price: number }) {
                                               ~~~~~~

product.ts:2:18 - error TS2304: Cannot find name 'title'.

2   console.log(`${title}：${price} 元`);
                   ~~~~~

product.ts:2:27 - error TS2304: Cannot find name 'price'.

2   console.log(`${title}：${price} 元`);
                            ~~~~~


Found 4 errors in the same file, starting at: product.ts:1
```

錯誤訊息很奇怪：它說有一個叫 `string` 的東西沒有型別，又說找不到 `title`。

原因是，在 JavaScript 的解構裡，`{ title: string }` 本來就有意義：「把 `title` 屬性取出來，放進一個**叫 `string` 的變數**」，也就是解構時重新命名。所以這段程式碼宣告了兩個變數，名字叫 `string` 和 `number`，而 `title` 和 `price` 根本不存在。

記住：**解構的部分只寫名稱，型別一律寫在整個 `{ }` 的後面。**

```ts,ignore
// 錯：冒號在大括號裡面，是重新命名
function showProduct({ title: string, price: number }) {}

// 對：冒號在大括號外面，才是型別
function showProduct({ title, price }: { title: string; price: number }) {}
```

## 重點整理

- 參數很多時，改成傳一個物件，每個值都有名字，不怕搞混順序。
- 解構參數的型別寫在整個 `{ }` 後面，通常搭配型別別名。
- 可選屬性可以在解構時用 `=` 給預設值。
- `{ title: string }` 在解構裡是重新命名，不是型別標註。
