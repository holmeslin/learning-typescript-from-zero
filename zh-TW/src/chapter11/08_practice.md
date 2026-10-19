# 綜合練習

## 本集目標

用這一章學到的東西，做一個可以新增、完成、刪除的待辦清單。

## 正文

這一集沒有新東西，只有一個題目。請先自己做，卡住再看提示，最後再對照參考解答。

### 題目：待辦清單

把 `index.html` 的 `<body>` 換成：

```html
<body>
  <h1>待辦清單</h1>
  <form id="todo-form">
    <input id="todo-input" placeholder="要做什麼？" />
    <button>新增</button>
  </form>
  <ul id="todo-list"></ul>
  <p id="todo-count"></p>
  <script type="module" src="/src/main.ts"></script>
</body>
```

在 `src/main.ts` 裡完成下面的功能：

1. 定義一個 `Todo` 型別，有 `id`（數字）、`text`（字串）、`done`（布林值）三個屬性。用一個 `Todo[]` 陣列存所有的待辦事項。
2. 在輸入框打字、按 Enter 或「新增」，就新增一筆待辦事項，清空輸入框。前後的空白要去掉；只有空白的話，什麼都不做。
3. 每一筆待辦事項顯示成一個 `<li>`，裡面依序是：一個勾選框、待辦的文字、一個「刪除」按鈕。
4. 勾選之後，那一筆的文字加上刪除線；再點一次取消。
5. 按「刪除」，那一筆就從清單裡消失。
6. `#todo-count` 顯示「還有 N 件沒做完」。

還有兩個規定：

- 從網頁上拿元素，都要處理 `null` 和元素型別，**不准用 `as` 和 `!`**。
- 寫完執行 `npm run build`，要能成功建置。

### 提示

- 程式一開始就把四個元素找出來，用 `instanceof` 檢查，不對就 `throw`。可以把四個檢查寫在同一個 `if` 裡，用 `||` 連起來。
- 寫一個 `render` 函式，每次資料變了就呼叫它，把整個清單重畫一次。`list.replaceChildren()` 會清空清單裡原本的元素，括號裡放新的元素就會換上去。
- 勾選框是 `document.createElement("input")` 再把 `type` 設成 `"checkbox"`，`checked` 屬性是 `boolean`。它被點的時候會觸發 `"change"` 事件。
- 刪除線可以用 `元素.style.textDecoration = "line-through"`。
- 如果 `render` 裡出現「`'list' is possibly 'null'`」，可是你明明在最上面檢查過了，試試看把 `function render() {}` 改成 `const render = () => {}`。原因寫在參考解答裡。

### 參考解答

做完再看。

<details>
<summary>展開參考解答</summary>

```ts
type Todo = {
  id: number;
  text: string;
  done: boolean;
};

const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const count = document.querySelector("#todo-count");

if (
  !(form instanceof HTMLFormElement) ||
  !(input instanceof HTMLInputElement) ||
  !(list instanceof HTMLUListElement) ||
  !count
) {
  throw new Error("找不到待辦清單需要的元素");
}

let todos: Todo[] = [];
let nextId = 1;

const createItem = (todo: Todo): HTMLLIElement => {
  const item = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.done;
  checkbox.addEventListener("change", () => {
    todos = todos.map((t) =>
      t.id === todo.id ? { ...t, done: checkbox.checked } : t,
    );
    render();
  });

  const text = document.createElement("span");
  text.textContent = todo.text;
  if (todo.done) {
    text.style.textDecoration = "line-through";
  }

  const removeButton = document.createElement("button");
  removeButton.textContent = "刪除";
  removeButton.addEventListener("click", () => {
    todos = todos.filter((t) => t.id !== todo.id);
    render();
  });

  item.append(checkbox, text, removeButton);
  return item;
};

const render = () => {
  list.replaceChildren(...todos.map(createItem));
  const left = todos.filter((todo) => !todo.done).length;
  count.textContent = `還有 ${left} 件沒做完`;
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (text === "") {
    return;
  }

  todos = [...todos, { id: nextId, text, done: false }];
  nextId++;
  input.value = "";
  render();
});

render();
```

幾個值得注意的地方：

- 四個元素一開始就用 `instanceof` 一起檢查，`throw` 之後，TypeScript 知道 `form` 是 `HTMLFormElement`、`input` 是 `HTMLInputElement`、`list` 是 `HTMLUListElement`、`count` 不是 `null`。後面的程式碼都不用再檢查。
- 勾選和刪除都不直接改原本的物件，而是用 `map`、`filter` 和展開語法產生新的陣列，再呼叫 `render` 重畫。資料只有 `todos` 一份，畫面永遠照著它畫，比較不容易出現「畫面和資料對不上」的錯誤。
- `todos.map(createItem)` 把每一筆資料變成一個 `<li>`，前面的 `...` 把陣列展開成 `replaceChildren` 的多個引數。

**為什麼要用箭頭函式？** 把 `createItem` 或 `render` 寫成 `function` 宣告，會出現這樣的錯誤：

```ts,fails
const count = document.querySelector("#todo-count");

if (!count) {
  throw new Error("找不到 #todo-count");
}

function showCount(text: string) {
  count.textContent = text;
}

const showCountArrow = (text: string) => {
  count.textContent = text;
};

showCount("還有 0 件沒做完");
showCountArrow("還有 0 件沒做完");
```

```text
src/main.ts:8:3 - error TS18047: 'count' is possibly 'null'.

8   count.textContent = text;
    ~~~~~


Found 1 error in src/main.ts:8
```

用 `function` 宣告的函式有一個特性：在宣告之前就可以呼叫，所以 `showCount` 有可能在上面的 `if` 檢查之前就被執行。TypeScript 不能確定呼叫的時候 `count` 已經檢查過了，只好不套用型別縮小。箭頭函式存在 `const` 變數裡，一定是在檢查之後才建立的，所以縮小的結果會保留下來。

如果你比較喜歡用 `function`，另一個辦法是把需要的元素當成參數傳進去，例如 `function render(list: HTMLUListElement) {}`。

</details>

### 延伸挑戰

- 加一個「清除已完成」按鈕，按下去把所有勾選的待辦事項一次刪掉。
- 用 `localStorage.setItem("todos", JSON.stringify(todos))` 把清單存起來，重新整理網頁之後再用 `localStorage.getItem("todos")` 讀回來。讀回來的是字串，`JSON.parse` 之後是 `any`，記得照第 7 集的做法，先當成 `unknown` 再驗證。

## 重點整理

- 程式一開始就把需要的元素找出來、用 `instanceof` 檢查好，後面的程式碼就能放心使用。
- 資料只存一份，每次改完就重畫，畫面永遠照著資料走。
- `function` 宣告在檢查之前就能呼叫，所以不套用外面的型別縮小；需要時改用箭頭函式或參數。
