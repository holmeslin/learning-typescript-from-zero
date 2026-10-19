# `querySelector` 可能回傳 `null`

## 本集目標

知道為什麼從網頁拿到的元素可能是 `null`，以及怎麼處理。

## 正文

### TypeScript 看不到 HTML

`index.html` 的 `<body>` 維持上一集的樣子：

```html
<body>
  <h1 id="title">標題</h1>
  <script type="module" src="/src/main.ts"></script>
</body>
```

在 `src/main.ts` 裡，想把標題換成別的字：

```ts,fails
const title = document.querySelector("#title");
title.textContent = "你好，TypeScript";
```

```text
src/main.ts:2:1 - error TS18047: 'title' is possibly 'null'.

2 title.textContent = "你好，TypeScript";
  ~~~~~


Found 1 error in src/main.ts:2
```

「`title` 可能是 `null`」。

明明 HTML 裡就有 `id="title"`，為什麼 TypeScript 說可能沒有？因為 **TypeScript 只看 `.ts` 檔，看不到 `index.html`**。對它來說，`#title` 只是一個字串，網頁上有沒有這個元素，要等到瀏覽器真的執行時才知道。`querySelector` 找不到元素時會回傳 `null`，所以它的回傳型別是 `Element | null`。

這不是 TypeScript 多事。HTML 改了 id、元素被刪掉、程式碼搬到別的頁面，這些情況都很常見。在 JavaScript 裡，這時候會在執行時出現 `Cannot set properties of null` 這類錯誤；TypeScript 只是提早提醒你。

### 用 `if` 檢查

最直接的做法，是用第 5 章的型別縮小：

```ts
const title = document.querySelector("#title");

if (title) {
  title.textContent = "你好，TypeScript";
}
```

在 `if (title)` 裡面，`title` 被縮小成 `Element`，`null` 已經排除了。

### 找不到就丟出錯誤

如果這個元素「一定要有」，沒有它程式根本不該繼續，可以反過來寫：找不到就丟出錯誤。

```ts
const title = document.querySelector("#title");

if (!title) {
  throw new Error("找不到 #title");
}

title.textContent = "你好，TypeScript";
```

`throw` 之後程式就不會往下走，所以 TypeScript 知道：能走到最後一行的話，`title` 一定不是 `null`。這種寫法的好處是後面的程式碼不用一直包在 `if` 裡，而且萬一真的找不到，錯誤訊息會直接告訴你是哪個元素。

要注意，`?.` 不能用在等號左邊：

```ts,fails
const title = document.querySelector("#title");
title?.textContent = "你好，TypeScript";
```

```text
src/main.ts:2:1 - error TS2779: The left-hand side of an assignment expression may not be an optional property access.

2 title?.textContent = "你好，TypeScript";
  ~~~~~~~~~~~~~~~~~~


Found 1 error in src/main.ts:2
```

「指定的左邊不能是 `?.` 的屬性存取」。`?.` 只能用來「讀」，不能用來「寫」。

### 不同的找法，型別不一樣

`querySelector` 回傳的型別，會依你給的選擇器而不同：

```ts
const heading = document.querySelector("h1");
const title = document.querySelector("#title");
const byId = document.getElementById("title");

console.log(heading, title, byId);
```

在 VS Code 裡把游標移到這三個變數上，會看到：

| 寫法 | 型別 |
| --- | --- |
| `document.querySelector("h1")` | `HTMLHeadingElement \| null` |
| `document.querySelector("#title")` | `Element \| null` |
| `document.getElementById("title")` | `HTMLElement \| null` |

選擇器是標籤名稱（`h1`）時，TypeScript 知道找到的一定是標題元素；選擇器是 id 或 class 時，它只能說「某種元素」。`HTMLHeadingElement`、`HTMLElement`、`Element` 有什麼差別，是下一集的主題。

三種寫法共同的地方是：**後面都有 `| null`**。從網頁上找元素，就要準備好處理找不到的情況。

## 重點整理

- TypeScript 看不到 HTML，不知道網頁上有沒有你要找的元素。
- `querySelector` 和 `getElementById` 的回傳型別都包含 `null`。
- 用 `if` 縮小型別，或者找不到就 `throw`，讓後面的程式碼拿到確定存在的元素。
- `?.` 只能讀、不能寫，不能放在等號左邊。
- 選擇器是標籤名稱時，TypeScript 能推論出更精確的元素型別。
