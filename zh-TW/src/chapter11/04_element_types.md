# `HTMLElement` 家族與型別斷言

## 本集目標

認識 `Element`、`HTMLElement`、`HTMLInputElement` 的差別，學會把元素縮小成正確的型別。

## 正文

### 輸入框的 `value` 不見了

把 `index.html` 的 `<body>` 換成：

```html
<body>
  <input id="name" value="小明" />
  <p id="greeting"></p>
  <script type="module" src="/src/main.ts"></script>
</body>
```

想讀出輸入框裡的文字：

```ts,fails
const input = document.querySelector("#name");

if (input) {
  console.log(input.value);
}
```

```text
src/main.ts:4:21 - error TS2339: Property 'value' does not exist on type 'Element'.

4   console.log(input.value);
                      ~~~~~


Found 1 error in src/main.ts:4
```

已經用 `if` 排除 `null` 了，還是有錯：「`Element` 型別沒有 `value` 這個屬性」。

### 元素的家族

網頁上每一種元素，在 TypeScript 裡都有對應的型別，而且是一層一層的：

```text
Element                 所有元素都有的東西：id、classList、textContent……
└── HTMLElement         所有 HTML 元素都有的東西：hidden、style、click()……
    ├── HTMLInputElement     <input>：value、checked、valueAsNumber……
    ├── HTMLButtonElement    <button>：disabled……
    ├── HTMLFormElement      <form>：reset()……
    ├── HTMLUListElement     <ul>
    ├── HTMLLIElement        <li>
    └── ……
```

`value` 只有輸入框才有，所以只有 `HTMLInputElement` 才有 `value`。上一集說過，選擇器是 id 的時候，`querySelector` 只知道找到的是「某種元素」，也就是最上層的 `Element`，當然沒有 `value`。

要讀 `value`，就得讓 TypeScript 知道它是 `HTMLInputElement`。有三種做法。

### 做法一：用 `instanceof` 縮小

第 5 章學過 `instanceof`。這些元素型別在瀏覽器裡都有對應的類別，可以直接拿來檢查：

```ts
const input = document.querySelector("#name");

if (input instanceof HTMLInputElement) {
  console.log(input.value);
}
```

`input instanceof HTMLInputElement` 會在**執行時**真的檢查這個元素是不是輸入框。檢查通過，TypeScript 就把它縮小成 `HTMLInputElement`。而且 `null` 不會通過 `instanceof`，所以連 `null` 都一起排除了。

這是最安全的做法：萬一有人把 HTML 裡的 `<input>` 改成 `<textarea>`，程式不會出錯，只是 `if` 裡面不會執行。

### 做法二：在 `querySelector` 後面加角括號

```ts
const input = document.querySelector<HTMLInputElement>("#name");

if (input) {
  console.log(input.value);
}
```

`querySelector` 是一個泛型函式（第 6 章），角括號裡可以直接告訴它「找到的會是 `HTMLInputElement`」。回傳型別就變成 `HTMLInputElement | null`，排除 `null` 之後就能讀 `value`。

這種寫法很常見，Vite 的範例程式碼就是這樣寫的。但要知道，它其實是一種**斷言**：TypeScript 不會檢查 `#name` 真的是輸入框，只是相信你。

### 做法三：用 `as` 斷言

```ts
const input = document.querySelector("#name") as HTMLInputElement;
console.log(input.value);
```

這是第 5 章的型別斷言。它的問題比做法二更大：`as HTMLInputElement` 不只說「它是輸入框」，還順便把 `| null` 拿掉了。萬一 HTML 裡沒有 `#name`，TypeScript 不會提醒你，執行時才會出現：

```text
Cannot read properties of null (reading 'value')
```

這就是第 5 章說的：`as` 等於在說「相信我，不用檢查」。

### 該用哪一種

| 做法 | 執行時會檢查嗎 | 什麼時候用 |
| --- | --- | --- |
| `instanceof` | 會 | 預設用這個 |
| `querySelector<型別>()` | 不會，但保留了 `null` | 很確定 HTML 長什麼樣子時 |
| `as 型別` | 不會，連 `null` 都拿掉 | 盡量不要用 |

第 5 章說過，斷言適合「你確實比 TypeScript 知道得更多」的時候，操作網頁元素就是最典型的例子：你看得到 HTML，TypeScript 看不到。但「知道得更多」不等於「永遠不會錯」，HTML 隨時可能被改。所以這本書接下來都用 `instanceof`，讓程式在執行時真的檢查一次。

### 把它包成函式

每次都寫一段 `instanceof` 有點囉嗦。如果某種元素要拿很多次，可以包成函式：

```ts
function getInput(selector: string): HTMLInputElement {
  const element = document.querySelector(selector);
  if (!(element instanceof HTMLInputElement)) {
    throw new Error(`找不到輸入框 ${selector}`);
  }
  return element;
}

const input = getInput("#name");
const greeting = document.querySelector("#greeting");

if (greeting) {
  greeting.textContent = `你好，${input.value}`;
}
```

`!(element instanceof HTMLInputElement)` 是「不是輸入框」的意思，注意 `!` 後面要加括號。找不到或型別不對就丟出錯誤，所以 `return` 的時候，`element` 一定是 `HTMLInputElement`。

## 重點整理

- 元素型別是一層一層的：`Element`、`HTMLElement`，再到 `HTMLInputElement` 這種特定的元素。
- `value` 這類屬性只有特定的元素型別才有，`Element` 沒有。
- 用 `instanceof` 縮小，執行時會真的檢查，是最安全的做法。
- `querySelector<型別>()` 和 `as` 都是斷言，TypeScript 不會檢查；`as` 還會把 `null` 拿掉。
