# 事件物件的型別

## 本集目標

知道事件物件的型別從哪裡來，以及怎麼處理 `event.target`。

## 正文

### 事件名稱決定事件型別

把 `index.html` 的 `<body>` 換成：

```html
<body>
  <button>打招呼</button>
  <input id="name" placeholder="輸入名字後按 Enter" />
  <script type="module" src="/src/main.ts"></script>
</body>
```

`src/main.ts`：

```ts
const button = document.querySelector("button");
const input = document.querySelector("input");

button?.addEventListener("click", (event) => {
  console.log(`點在 (${event.clientX}, ${event.clientY})`);
});

input?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    console.log("按了 Enter");
  }
});
```

`addEventListener` 是讀取，可以用 `?.`，元素不存在就什麼都不做。這一集網頁上只有一個按鈕和一個輸入框，所以直接用標籤名稱找，原因等一下說明。

在 VS Code 裡把游標移到兩個 `event` 上，會看到：

| 事件名稱 | `event` 的型別 | 常用的屬性 |
| --- | --- | --- |
| `"click"` | `PointerEvent` | `clientX`、`clientY`（滑鼠位置） |
| `"keydown"` | `KeyboardEvent` | `key`（按了哪個鍵） |
| `"input"` | `InputEvent` | `data`（這次輸入的字） |
| `"submit"` | `SubmitEvent` | `submitter`（按了哪個按鈕送出） |

這兩個 callback 的參數都沒有標型別，卻沒有 TS7006 錯誤。因為 TypeScript 從第一個引數的字串 `"click"`、`"keydown"`，就知道會傳進來什麼樣的事件物件，這也是型別推論。打錯事件名稱（例如 `"clik"`），`event` 就會變成最普通的 `Event`，`clientX` 也就讀不到了，等於幫你抓到了錯字。

### 用 id 找到的元素，事件型別很籠統

如果把上面的 `querySelector("button")` 改成用 id 找（例如 `querySelector("#hello")`），`event.clientX` 會出現錯誤：`Property 'clientX' does not exist on type 'Event'.`。

上一集說過，用 id 找到的是最上層的 `Element`。`Element` 不只代表 HTML 元素，也包含其他種類的元素，所以 TypeScript 不敢說它一定有 `click`、`keydown` 這些事件，`event` 只好給最普通的 `Event`。

解法跟上一集一樣：先用 `instanceof` 把元素縮小成 `HTMLButtonElement` 這類 HTML 元素，事件的型別就會跟著變精確。

### 把處理函式拆出來

callback 寫在 `addEventListener` 裡面時，型別會自動推論。如果把它拆成獨立的函式，參數就要自己標：

```ts
function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Enter") {
    console.log("按了 Enter");
  }
}

const input = document.querySelector("input");
input?.addEventListener("keydown", handleKeydown);
```

型別要和事件名稱對得上。如果把 `KeyboardEvent` 的函式交給 `"click"`，TypeScript 會報一個很長的 TS2769 錯誤，開頭是 `No overload matches this call.`，意思是「`addEventListener` 的每一種寫法都對不上」。看到它，先檢查事件名稱和參數型別有沒有搭配好。

### `event.target` 是什麼都不確定

想在輸入的時候，即時讀出輸入框裡的文字：

```ts,fails
const input = document.querySelector("input");

input?.addEventListener("input", (event) => {
  console.log(event.target.value);
});
```

```text
src/main.ts:4:15 - error TS18047: 'event.target' is possibly 'null'.

4   console.log(event.target.value);
                ~~~~~~~~~~~~

src/main.ts:4:28 - error TS2339: Property 'value' does not exist on type 'EventTarget'.

4   console.log(event.target.value);
                             ~~~~~


Found 2 errors in the same file, starting at: src/main.ts:4
```

兩個錯誤：`event.target` 可能是 `null`，而且它的型別 `EventTarget` 沒有 `value`。

`event.target` 是「實際觸發事件的那個東西」。事件會往外層傳遞（例如點了按鈕裡的文字，外層的 `<div>` 也收得到），所以 TypeScript 沒辦法確定 `target` 是哪一種元素，只好給最籠統的 `EventTarget | null`。

有兩種解法。第一種，**直接用外面那個變數**。監聽器是掛在 `input` 上的，在 callback 裡直接用 `input` 就好：

```ts
const input = document.querySelector("input");

input?.addEventListener("input", () => {
  console.log(input.value);
});
```

`input` 是用 `querySelector("input")` 找到的，型別是 `HTMLInputElement | null`。callback 能執行，代表 `addEventListener` 有被呼叫到，也就是 `input` 不是 `null`，TypeScript 看得出這一點。

第二種，**用 `instanceof` 縮小** `event.target`，適合一個監聽器要處理很多元素的情況：

```ts
document.addEventListener("input", (event) => {
  if (event.target instanceof HTMLInputElement) {
    console.log(`${event.target.id}：${event.target.value}`);
  }
});
```

這裡把監聽器掛在整份 `document` 上，網頁上任何一個輸入框打字都會觸發，再用 `instanceof` 確認觸發的是輸入框。

## 重點整理

- `addEventListener` 會依事件名稱推論 `event` 的型別，例如 `"click"` 是 `PointerEvent`、`"keydown"` 是 `KeyboardEvent`。
- 處理函式拆出來寫時，參數要自己標上對應的事件型別。
- `event.target` 的型別是 `EventTarget | null`，不能直接讀 `value`。
- 能用外面的變數就用外面的變數；要用 `event.target`，先用 `instanceof` 縮小。
