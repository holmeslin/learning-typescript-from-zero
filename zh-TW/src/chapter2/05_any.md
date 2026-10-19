# `any` 為什麼危險

## 本集目標

知道 `any` 會關掉型別檢查，以及它會從哪裡悄悄跑進你的程式碼。

## 正文

### 什麼都可以

`any` 是一個特別的型別，意思是「什麼都可以」。建立 `any.ts`：

```ts
let value: any = "小明";
value = 20;
value = true;
console.log(value);
```

```text
true
```

字串、數字、布林值輪流放進去，`npx tsc` 一個錯都不報。看起來很方便，問題在下一步。

### 檢查整個關掉

把 `any.ts` 改成這樣：

```ts
let value: any = "小明";
value = 20;
value = true;
console.log(value.toUpperCase());
```

`value` 現在是 `true`，布林值沒有 `toUpperCase` 這個方法。`npx tsc` 照樣安靜，執行卻當掉了：

```text
TypeError: value.toUpperCase is not a function
```

型別是 `any` 的值，TypeScript **完全不檢查**：呼叫什麼方法、讀什麼屬性、拿去做什麼運算，全部放行。這等於在這個值身上把 TypeScript 關掉，退回 JavaScript。

### 錯誤會擴散

更麻煩的是，`any` 會把錯誤帶到別的地方。建立 `spread.ts`：

```ts
const price: any = "100";
const total: number = price + 5;

console.log(total);
console.log(total.toFixed(2));
```

```text
1005
TypeError: total.toFixed is not a function
```

（第二行之後省略了一些錯誤細節。）

`total` 明明標了 `number`，`npx tsc` 也沒報錯，但它裡面放的其實是字串 `"1005"`。因為 `price` 是 `any`，`price + 5` 的結果 TypeScript 也不檢查，就這樣放進了 `number` 型別的變數。之後所有用到 `total` 的地方，TypeScript 都以為它是數字，錯誤被藏得更深了。

### `any` 從哪裡來

你自己很少會特地寫 `any`，它通常是從這些地方跑進來的：

- **參數忘了標型別。** 第 1 章看過的 TS7006 就是在擋這件事：沒標型別的參數會被當成 `any`，`strict` 不允許。
- **`JSON.parse` 的回傳值。** 它讀的是一段字串，TypeScript 不知道裡面是什麼，所以回傳 `any`。
- **沒有型別的舊套件。** 第 9 章會講怎麼處理。

### 結論

**不要寫 `any`。** 遇到「真的不知道是什麼型別」的值，用下一集的 `unknown`。

你在網路上看到的範例，有時候會為了讓錯誤消失而加上 `any`。那不是修好了，只是把錯誤藏起來，等執行的時候再爆發。

## 重點整理

- `any` 的意思是「什麼都可以」，而且對這個值完全不做檢查。
- `any` 會讓錯誤擴散：從 `any` 算出來的值，也會躲過檢查。
- `any` 常見的來源是沒標型別的參數和 `JSON.parse`。
- 不要用 `any`，不知道型別時用 `unknown`。
