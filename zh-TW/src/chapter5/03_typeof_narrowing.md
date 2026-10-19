# `typeof` 縮小

## 本集目標

用 `typeof` 判斷值的型別，讓 TypeScript 在 `if` 裡自動縮小型別。

## 正文

### 先檢查，再使用

第 1 集的 `formatId` 不能直接呼叫 `toUpperCase`，因為 `id` 可能是數字。在 JavaScript 裡，你會用 `typeof` 先檢查：

```ts
function formatId(id: string | number) {
  if (typeof id === "string") {
    return id.toUpperCase();
  }
  return id.toFixed(0).padStart(4, "0");
}

console.log(formatId("a01"));
console.log(formatId(7));
```

```text
A01
0007
```

這次沒有錯誤了。TypeScript 看得懂你的 `if`：

- 在 `if (typeof id === "string")` 的大括號裡，`id` 一定是字串，所以型別是 `string`。
- `if` 裡面已經 `return` 了，能走到下面那行的，一定**不是**字串。`string | number` 去掉 `string`，剩下 `number`。

在 VS Code 裡把游標分別移到兩個 `id` 上，會看到 `(parameter) id: string` 和 `(parameter) id: number`。同一個變數，在不同位置的型別不一樣。

這種「TypeScript 根據你的檢查，把寬的型別變窄」的行為，叫**型別縮小**（narrowing）。你不用學新的語法，寫的都是普通的 JavaScript 判斷式，TypeScript 會自己跟上。

### `typeof` 會回傳什麼

`typeof` 是 JavaScript 本來就有的運算子，會回傳一個字串：

| `typeof x` | 代表 `x` 是 |
| --- | --- |
| `"string"` | 字串 |
| `"number"` | 數字 |
| `"boolean"` | 布林值 |
| `"undefined"` | `undefined` |
| `"function"` | 函式 |
| `"object"` | 物件、陣列，**還有 `null`** |

`"bigint"` 和 `"symbol"` 這兩種比較少用，這本書不會用到。

### 陷阱：`typeof null` 是 `"object"`

表格最後一列是 JavaScript 很有名的歷史包袱。建立 `typeof-null.ts`：

```ts,fails
function countItems(items: string[] | null) {
  if (typeof items === "object") {
    return items.length;
  }
  return 0;
}

console.log(countItems(["筆", "紙"]));
console.log(countItems(null));
```

```text
typeof-null.ts:3:12 - error TS18047: 'items' is possibly 'null'.

3     return items.length;
             ~~~~~


Found 1 error in typeof-null.ts:3
```

陣列和 `null` 的 `typeof` 都是 `"object"`，所以這個 `if` 沒有排除 `null`。TypeScript 知道這件事，提醒你 `items` 還是可能是 `null`。不管它的話，傳 `null` 進去就會當掉。

要排除 `null`，用下一集的方法。

## 重點整理

- 在 `if` 裡用 `typeof` 檢查之後，TypeScript 會自動把變數縮小成對應的型別。
- `if` 裡 `return` 之後，下面的程式碼會拿到「剩下的」型別。
- 把游標移到變數上，可以看到它在那個位置被縮小成什麼型別。
- `typeof null` 是 `"object"`，`typeof` 沒辦法排除 `null`。
