# 綜合練習

## 本集目標

把一個檔案拆成三個模組，並用更嚴格的選項找出藏起來的錯誤。

## 正文

這一集沒有新東西，只有一個題目。請先自己做，卡住再看提示，最後再對照參考解答。

### 題目：拆開待辦清單

下面是一個寫在同一個檔案裡的待辦清單：

```ts
type Todo = {
  id: number;
  title: string;
  done: boolean;
};

function formatTodo(todo: Todo): string {
  const mark = todo.done ? "x" : " ";
  return `[${mark}] ${todo.id}. ${todo.title}`;
}

const todos: Todo[] = [
  { id: 1, title: "買牛奶", done: true },
  { id: 2, title: "繳電話費", done: false },
];

for (const todo of todos) {
  console.log(formatTodo(todo));
}

const latest = todos[todos.length];
console.log(`最新一筆：${latest.title}`);
```

`npx tsc` 不會報錯，但執行到最後一行會當掉：

```text
[x] 1. 買牛奶
[ ] 2. 繳電話費
TypeError: Cannot read properties of undefined (reading 'title')
```

（省略了錯誤的位置和細節。）

請完成下面的事：

1. 在 `ts-practice` 裡建立 `todo` 資料夾，把程式碼拆成三個檔案：
   - `todo/types.ts`：只放 `Todo` 型別。
   - `todo/format.ts`：只放 `formatTodo` 函式。
   - `todo/main.ts`：放 `todos` 資料和印出結果的程式碼。
2. 匯入時遵守這一章的規則：型別用 `import type`，路徑寫 `.ts` 副檔名。拆完先用 `npx tsc` 確認沒有錯誤。
3. 在 `tsconfig.json` 打開 `noUncheckedIndexedAccess`，看 `npx tsc` 抓到什麼，然後把錯誤修好。
4. 用 `node todo/main.ts` 執行，確認輸出是：

```text
[x] 1. 買牛奶
[ ] 2. 繳電話費
最新一筆：繳電話費
```

5. 做完把 `noUncheckedIndexedAccess` 那一行刪掉，讓設定回到原本的樣子。

### 提示

- `types.ts` 和 `format.ts` 都要用 `export`，不然別的檔案匯入不了。
- `format.ts` 用到 `Todo` 型別，所以它也要匯入 `types.ts`。
- 第 3 步會出現 TS18048。錯誤其實有兩個層次：索引算錯了，以及就算算對，陣列是空的時候也拿不到東西。
- 陣列最後一個元素的索引是 `length - 1`。

### 參考解答

做完再看。

<details>
<summary>展開參考解答</summary>

`todo/types.ts`：

```ts
export type Todo = {
  id: number;
  title: string;
  done: boolean;
};
```

`todo/format.ts`：

```ts,ignore
import type { Todo } from "./types.ts";

export function formatTodo(todo: Todo): string {
  const mark = todo.done ? "x" : " ";
  return `[${mark}] ${todo.id}. ${todo.title}`;
}
```

拆完、還沒改設定之前的 `todo/main.ts`：

```ts,ignore
import { formatTodo } from "./format.ts";
import type { Todo } from "./types.ts";

const todos: Todo[] = [
  { id: 1, title: "買牛奶", done: true },
  { id: 2, title: "繳電話費", done: false },
];

for (const todo of todos) {
  console.log(formatTodo(todo));
}

const latest = todos[todos.length];
console.log(`最新一筆：${latest.title}`);
```

打開 `noUncheckedIndexedAccess` 之後，`npx tsc` 印出：

```text
todo/main.ts:14:21 - error TS18048: 'latest' is possibly 'undefined'.

14 console.log(`最新一筆：${latest.title}`);
                       ~~~~~~


Found 1 error in todo/main.ts:14
```

（`~~~~~~` 沒有對準 `latest`，是因為中文字比英文字寬，終端機裡看起來會歪一點。）

只把索引改成 `todos.length - 1` 還不夠，錯誤不會消失：對 TypeScript 來說，用 `[]` 拿到的值永遠可能不存在。要再加上檢查。修好的 `todo/main.ts`：

```ts,ignore
import { formatTodo } from "./format.ts";
import type { Todo } from "./types.ts";

const todos: Todo[] = [
  { id: 1, title: "買牛奶", done: true },
  { id: 2, title: "繳電話費", done: false },
];

for (const todo of todos) {
  console.log(formatTodo(todo));
}

const latest = todos[todos.length - 1];
if (latest !== undefined) {
  console.log(`最新一筆：${latest.title}`);
}
```

幾個值得注意的地方：

- `main.ts` 從 `format.ts` 匯入函式、從 `types.ts` 匯入型別，兩行分開寫；也可以只在型別名稱前加 `type`，但這裡兩個來源不同，本來就是兩行。
- `todos[todos.length]` 是很常見的「差一」錯誤。沒打開 `noUncheckedIndexedAccess` 時，TypeScript 認為它一定是 `Todo`，完全不會提醒你。
- 加了 `if` 之後，`todos` 是空陣列時程式也不會當掉，只是不印最新一筆。這種情況本來就該處理，選項只是逼你面對它。

</details>

### 延伸挑戰

- 在 `types.ts` 加一個 `export type TodoList = Todo[];`，讓 `main.ts` 改用 `TodoList`。
- 把 `main.ts` 的兩行匯入其中一行故意拿掉 `type`，執行 `npx tsc` 和 `node todo/main.ts`，對照第 6 集，說明兩邊的錯誤各是怎麼來的。

## 重點整理

- 型別、函式、主程式可以拆到不同檔案，用 `export` 和 `import type` 串起來。
- 在這本書的環境，匯入自己的檔案要寫 `.ts` 副檔名。
- `noUncheckedIndexedAccess` 能抓到「差一」這類用索引讀到不存在元素的錯誤。
