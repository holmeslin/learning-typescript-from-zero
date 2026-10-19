# `JSON.parse` 回傳 `any` 的陷阱

## 本集目標

知道 `JSON.parse` 為什麼回傳 `any`，以及直接相信它會出什麼事。

## 正文

### TypeScript 看不到字串裡面

第 1 章第 9 集看過這段程式碼：

```ts
const data = JSON.parse('{ "name": "小明" }');
console.log(data.nmae);
```

```text
undefined
```

`nmae` 打錯了，`npx tsc` 卻沒有報錯。把游標移到 `data` 上，會看到它的型別是 `any`。

原因是 `JSON.parse` 讀的是一段**字串**。字串的內容要等程式執行時才知道，可能來自網路、檔案或使用者的輸入；TypeScript 在檢查的時候，只知道「這是一個字串」，不知道解析出來會是物件、陣列、數字還是別的東西。所以 `JSON.parse` 的回傳型別乾脆定成 `any`，也就是第 2 章說的「不檢查」。

### 標上型別，問題還是在

你可能會想：那我幫它標上型別就好了。建立 `parse.ts`：

```ts
type User = { name: string; age: number };

const text = '{ "name": "小明", "age": "二十" }';
const user: User = JSON.parse(text);
console.log(user.age.toFixed(1));
```

`npx tsc` 完全沒有意見。`any` 什麼都能放進去，所以放進 `User` 型別的變數也可以；之後 TypeScript 就相信 `user` 真的是 `User`，`user.age` 真的是數字。

但字串裡的 `age` 其實是 `"二十"`。用 Node.js 執行：

```bash
node parse.ts
```

```text
TypeError: user.age.toFixed is not a function
```

（中間省略了一些行。）`"二十"` 是字串，沒有 `toFixed` 方法，程式當掉了。

這比 JavaScript 還糟：在 JavaScript 裡你至少知道自己沒檢查；在 TypeScript 裡，`: User` 讓這段程式碼**看起來**是安全的，型別檢查也通過了，但它其實只是一個沒有人確認過的假設。

### `as` 也一樣

第 5 章第 10 集學過的型別斷言，結果完全相同：

```ts
type User = { name: string; age: number };

const user = JSON.parse('{ "name": "小明" }') as User;
console.log(user.age + 1);
```

```text
NaN
```

`as User` 是在說「相信我，它是 `User`」。但字串裡根本沒有 `age`，`user.age` 是 `undefined`，加 `1` 變成 `NaN`。第 5 章說過，從外面讀進來的資料不應該用 `as` 打發，原因就在這裡。

### 要怎麼辦

從外面進來的資料，TypeScript 沒辦法替你保證型別，只有一個辦法：**在執行時真的檢查一遍**。下一集開始，就是要學怎麼做。

## 重點整理

- `JSON.parse` 讀的是字串，TypeScript 不知道內容，所以回傳 `any`。
- 把 `JSON.parse` 的結果標成某個型別，或用 `as` 斷言，都不會真的檢查資料。
- 型別檢查通過，不代表外部資料真的長那樣，執行時還是可能出錯。
- 外部資料只能在執行時檢查。
