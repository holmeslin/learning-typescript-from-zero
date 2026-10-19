# `unknown`

## 本集目標

用 `unknown` 表示「還不知道是什麼」的值，並知道使用前要先檢查。

## 正文

### 什麼都能放，但不能直接用

`unknown` 跟 `any` 一樣，什麼值都能放進去。建立 `unknown.ts`：

```ts
let value: unknown = "小明";
value = 20;
value = true;
console.log(value);
```

```text
true
```

差別在於**拿出來用**的時候。把 `unknown.ts` 改成這樣：

```ts,fails
const value: unknown = "小明";
console.log(value.toUpperCase());
```

```text
unknown.ts:2:13 - error TS18046: 'value' is of type 'unknown'.

2 console.log(value.toUpperCase());
              ~~~~~


Found 1 error in unknown.ts:2
```

「`value` 的型別是 `unknown`。」TypeScript 的意思是：你自己都說不知道它是什麼了，我怎麼能讓你呼叫 `toUpperCase()`？它可能根本不是字串。

放進別的型別的變數也不行：

```ts,fails
const value: unknown = 20;
const age: number = value;
console.log(age);
```

```text
unknown.ts:2:7 - error TS2322: Type 'unknown' is not assignable to type 'number'.

2 const age: number = value;
        ~~~


Found 1 error in unknown.ts:2
```

上一集的 `any` 會讓錯誤溜過去，`unknown` 則是把門關上，直到你確認了它是什麼。

### 先檢查，再使用

要用 `unknown` 的值，先用 JavaScript 的 `typeof` 確認它的型別：

```ts
const value: unknown = "小明";

if (typeof value === "string") {
  console.log(value.toUpperCase());
}
```

```text
小明
```

在 `if (typeof value === "string")` 的大括號裡，TypeScript 知道 `value` 一定是字串，就讓你呼叫字串的方法了。這和第 4 集用 `if (name !== null)` 處理 `null` 是同一個道理，第 5 章會完整解釋。

### `any` 和 `unknown` 的比較

| | `any` | `unknown` |
| --- | --- | --- |
| 什麼都能放進去 | 可以 | 可以 |
| 直接呼叫方法、讀屬性 | 可以，不檢查 | 不行 |
| 放進其他型別的變數 | 可以，不檢查 | 不行 |
| 檢查之後使用 | 不需要檢查 | 檢查之後才可以 |

一句話：**`any` 是「不要管我」，`unknown` 是「我還不知道，先檢查」。**

### 什麼時候用 `unknown`

最常見的是處理從外面來的資料。例如 `JSON.parse` 回傳的是 `any`，你可以把它放進 `unknown` 型別的變數，強迫自己在使用前先檢查：

```ts
const data: unknown = JSON.parse('{ "name": "小明" }');
console.log(data);
```

```text
{ name: '小明' }
```

這樣之後直接寫 `data.name` 會被擋下來，不會像 `any` 一樣讓錯字溜過去。至於怎麼檢查一個物件的內容，要等學完物件型別和型別縮小，第 10 章會專門講。

## 重點整理

- `unknown` 什麼值都能放，但不能直接使用。
- 要用 `unknown` 的值，先用 `typeof` 之類的方式確認型別。
- `any` 跳過檢查，`unknown` 強迫你檢查；不知道型別的時候用 `unknown`。
- 從外面來的資料，例如 `JSON.parse` 的結果，適合先當成 `unknown`。
