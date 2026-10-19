# 綜合練習

## 本集目標

自己寫出幾個泛型函式和泛型型別，把這一章的觀念組合起來。

## 正文

這一集沒有新東西，只有一個題目。請先自己寫，卡住再看提示，最後再對照參考解答。

### 題目：通用的小工具

建立 `toolkit.ts`，寫出下面三樣東西，讓最後的測試程式碼通過 `npx tsc`，並印出預期的結果。

1. 泛型函式 `last`：收一個陣列，回傳最後一個元素；陣列是空的就回傳 `undefined`。
2. 泛型函式 `groupCount`：收一個陣列，以及一個「從元素取出分類名稱」的函式，回傳一個 `Map`，記錄每個分類有幾個元素。
3. 泛型型別 `Result<T>`，以及一個函式 `parsePrice`：收一個字串，能轉成大於等於 0 的數字就回傳成功的結果，否則回傳失敗的結果和錯誤訊息。

測試程式碼（貼在你寫的東西下面）：

```ts,ignore
const scores = [72, 88, 95];
console.log(last(scores)?.toFixed(1));
console.log(last([]));

const books = [
  { title: "TypeScript 入門", category: "程式" },
  { title: "小王子", category: "文學" },
  { title: "JavaScript 大全", category: "程式" },
];
console.log(groupCount(books, (book) => book.category));

for (const text of ["120", "abc", "-5"]) {
  const result = parsePrice(text);
  if (result.ok) {
    console.log(`價格：${result.value} 元`);
  } else {
    console.log(`錯誤：${result.error}`);
  }
}
```

預期的輸出：

```text
95.0
undefined
Map(2) { '程式' => 2, '文學' => 1 }
價格：120 元
錯誤：「abc」不是數字
錯誤：價格不能是負數
```

### 提示

- `last` 的回傳型別是 `T | undefined`。
- `groupCount` 需要一個型別參數 `T` 代表元素的型別。第二個參數是函式，型別寫成 `(item: T) => string`，這是第 4 章學過的函式型別。
- `groupCount` 裡面建立的空 `Map` 要寫型別引數，記得上一集的陷阱。
- `Result<T>` 用可辨識聯集：成功時有 `value: T`，失敗時有 `error: string`。
- 判斷字串能不能轉成數字，可以用 `Number.isNaN(Number(text))`。

### 參考解答

寫完再看。

<details>
<summary>展開參考解答</summary>

```ts
function last<T>(items: T[]): T | undefined {
  return items[items.length - 1];
}

function groupCount<T>(
  items: T[],
  getKey: (item: T) => string,
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = getKey(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

function parsePrice(text: string): Result<number> {
  const price = Number(text);
  if (Number.isNaN(price)) {
    return { ok: false, error: `「${text}」不是數字` };
  }
  if (price < 0) {
    return { ok: false, error: "價格不能是負數" };
  }
  return { ok: true, value: price };
}

const scores = [72, 88, 95];
console.log(last(scores)?.toFixed(1));
console.log(last([]));

const books = [
  { title: "TypeScript 入門", category: "程式" },
  { title: "小王子", category: "文學" },
  { title: "JavaScript 大全", category: "程式" },
];
console.log(groupCount(books, (book) => book.category));

for (const text of ["120", "abc", "-5"]) {
  const result = parsePrice(text);
  if (result.ok) {
    console.log(`價格：${result.value} 元`);
  } else {
    console.log(`錯誤：${result.error}`);
  }
}
```

幾個值得注意的地方：

- `last(scores)` 的 `T` 推論成 `number`，所以回傳 `number | undefined`，要用 `?.` 才能呼叫 `toFixed`。
- `groupCount(books, (book) => book.category)` 裡，`book` 不用標型別。TypeScript 從第一個引數推論出 `T`，再用 `T` 決定 callback 參數的型別，所以 `book.category` 有自動完成。
- `counts.get(key) ?? 0`：`get` 回傳 `number | undefined`，用 `??` 在拿不到時換成 0。
- `Result<T>` 和第 4 集的寫法一樣。像這樣的型別，寫一次就能在整個專案裡重複使用。

</details>

### 延伸挑戰

- 寫一個泛型函式 `uniqueBy<T>(items: T[], getKey: (item: T) => string): T[]`，依照 `getKey` 的結果去除重複的元素，只保留第一個。提示：用 `Set<string>` 記錄看過的鍵。
- 把 `groupCount` 改成 `groupBy`，回傳 `Map<string, T[]>`，記錄每個分類裡有哪些元素，而不只是數量。

## 重點整理

- 泛型函式讓同一份邏輯適用在任何型別上，同時保留型別資訊。
- 型別參數可以傳給 callback 的參數型別，讓 TypeScript 推論出 callback 裡的型別。
- 通用的泛型型別（例如 `Result<T>`）寫一次，就能到處重複使用。
