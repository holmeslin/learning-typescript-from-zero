# 內建的泛型：`Map` 與 `Set`

## 本集目標

用泛型型別寫出 `Map` 和 `Set` 的型別，並避開空集合變成 `any` 的陷阱。

## 正文

JavaScript 內建的 `Map` 和 `Set`，在 TypeScript 裡都是泛型型別。

### `Map<K, V>`

`Map` 有兩個型別參數：`K` 是鍵的型別，`V` 是值的型別。建立一個空的 `Map` 時，在 `new Map` 後面用角括號寫出來：

```ts
const stock = new Map<string, number>();
stock.set("蘋果", 10);
stock.set("香蕉", 5);

console.log(stock.get("蘋果"));
```

```text
10
```

放錯型別的值，會被擋下來。建立 `map.ts`：

```ts,fails
const stock = new Map<string, number>();
stock.set("蘋果", "十");
console.log(stock);
```

```text
map.ts:2:17 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

2 stock.set("蘋果", "十");
                  ~~~


Found 1 error in map.ts:2
```

### `get` 可能拿不到

`Map` 的 `get` 回傳的型別是 `V | undefined`，因為那個鍵可能不存在。所以拿到值之後，要先用第 5 章的型別縮小檢查：

```ts
const stock = new Map<string, number>();
stock.set("蘋果", 10);

const count = stock.get("葡萄");
if (count === undefined) {
  console.log("沒有這個商品");
} else {
  console.log(`還有 ${count} 個`);
}
```

```text
沒有這個商品
```

### `Set<T>`

`Set` 只有一個型別參數，就是元素的型別。有初始值的時候，TypeScript 會自己推論：

```ts,fails
const tags = new Set(["ts", "js"]);
tags.add(42);
console.log(tags);
```

```text
set.ts:2:10 - error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.

2 tags.add(42);
           ~~


Found 1 error in set.ts:2
```

TypeScript 從 `["ts", "js"]` 推論出 `tags` 是 `Set<string>`，所以加數字進去會報錯。

### 陷阱：空的 `Map` 變成 `any`

建立 `Map` 時沒有寫型別引數、也沒有初始值，TypeScript 沒有任何線索：

```ts
const cache = new Map();
cache.set("a", 1);

const value: string = cache.get("a");
console.log(value.toUpperCase());
```

`npx tsc` 完全不報錯，但一執行就出事：

```text
TypeError: value.toUpperCase is not a function
```

把游標移到 `cache` 上，會看到它的型別是 `Map<any, any>`。`new Map()` 是少數推論不出來就直接變成 `any` 的地方，等於整個 `Map` 都關掉了檢查。

**規則：建立空的 `Map` 和 `Set` 時，一定要寫型別引數**，例如 `new Map<string, number>()`、`new Set<string>()`。

## 重點整理

- `Map<K, V>` 的 `K` 是鍵的型別，`V` 是值的型別；`Set<T>` 的 `T` 是元素的型別。
- `Map` 的 `get` 回傳 `V | undefined`，使用前要先檢查。
- 有初始值時 TypeScript 會自己推論型別參數。
- 建立空的 `Map` 或 `Set` 一定要寫型別引數，不然會變成 `any`。
