# `instanceof` 縮小

## 本集目標

用 `instanceof` 分辨 `Date`、`Error` 這類內建物件。

## 正文

### `typeof` 分不出來的物件

日期可能是一個 `Date` 物件，也可能是已經排好格式的字串。字串用 `typeof` 就分得出來；但如果兩邊都是物件呢？例如 `Date` 和陣列，`typeof` 都是 `"object"`。

這時候要用 JavaScript 的 `instanceof`，它會檢查一個物件是不是用某個建構方式做出來的，例如 `value instanceof Date` 就是在問「`value` 是不是一個 `Date`」。

```ts
function formatDate(value: Date | string) {
  if (value instanceof Date) {
    return value.toLocaleDateString("zh-TW");
  }
  return value;
}

console.log(formatDate(new Date(2026, 9, 19)));
console.log(formatDate("2026/10/20"));
```

```text
2026/10/19
2026/10/20
```

- 在 `if (value instanceof Date)` 裡，`value` 縮小成 `Date`，可以呼叫 `toLocaleDateString` 這類日期才有的方法。
- 下面剩下的是 `string`。

`new Date(2026, 9, 19)` 的月份是從 0 開始算的，所以 `9` 代表 10 月。這是 JavaScript 的 `Date` 本來的規則，跟 TypeScript 無關。

### 錯誤物件

另一個常見的內建物件是 `Error`。有些函式回報錯誤時給你一個 `Error` 物件，有些只給一段文字：

```ts
function describeError(problem: Error | string) {
  if (problem instanceof Error) {
    return `錯誤：${problem.message}`;
  }
  return `錯誤：${problem}`;
}

console.log(describeError(new Error("找不到檔案")));
console.log(describeError("網路斷線"));
```

```text
錯誤：找不到檔案
錯誤：網路斷線
```

縮小成 `Error` 之後，就能讀它的 `message` 屬性。第 10 章處理 `try...catch` 的時候，會常常用到這個寫法。

### `instanceof` 能用在哪裡

`instanceof` 的右邊要放一個「可以用 `new` 建立物件」的東西，例如 `Date`、`Error`、`Map`。你自己也可以寫出這種東西，那是第 7 章「類別」的內容。

至於 `{ title: "小王子" }` 這種直接用大括號寫出來的物件，`instanceof` 就分不出來了，要用上一集的 `in`，或是下一集的可辨識聯集。

## 重點整理

- `x instanceof Date` 檢查 `x` 是不是一個 `Date` 物件。
- TypeScript 會根據 `instanceof` 的結果縮小型別。
- `instanceof` 適合分辨 `Date`、`Error` 這類用 `new` 建立的物件。
- 用大括號直接寫出來的物件，要用 `in` 或可辨識聯集分辨。
