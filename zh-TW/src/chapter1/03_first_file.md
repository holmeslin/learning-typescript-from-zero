# 第一個 `.ts` 檔

## 本集目標

寫出第一個 TypeScript 檔案，並用 `node` 執行它。

## 正文

在 `ts-practice` 裡建立 `hello.ts`：

```ts
const name: string = "小明";
console.log(`你好，${name}`);
```

這和 JavaScript 只差一個地方：`name` 後面多了 `: string`。它的意思是「`name` 這個變數放的是字串」。這種寫法叫型別標註，第 6 集會詳細講。

在終端機執行：

```bash
node hello.ts
```

```text
你好，小明
```

跟執行 `.js` 檔一模一樣，只是副檔名換成 `.ts`。

### Node.js 做了什麼

Node.js 本身只會執行 JavaScript。它碰到 `.ts` 檔時，會先把型別的部分**拿掉**，再把剩下的 JavaScript 拿去執行。對 Node.js 來說，上面的檔案等於：

```js
const name = "小明";
console.log(`你好，${name}`);
```

`: string` 消失了，其他都一樣。

### Node.js 不檢查型別

這是很重要的一點：Node.js **只負責拿掉型別，不會檢查型別對不對**。把 `hello.ts` 改成這樣：

```ts,ignore
const name: string = 123;
console.log(`你好，${name}`);
```

說好是字串，卻放了數字 `123`。執行看看：

```bash
node hello.ts
```

```text
你好，123
```

照樣執行，沒有任何錯誤。因為 Node.js 把 `: string` 拿掉之後，剩下的 `const name = 123` 是完全正常的 JavaScript。

那型別要誰來檢查？這就是下一集的 `tsc`。

## 重點整理

- TypeScript 檔案的副檔名是 `.ts`，用 `node 檔名.ts` 執行。
- `: string` 這種寫法是在說明變數的型別。
- Node.js 執行 `.ts` 檔時，會先把型別拿掉，再執行剩下的 JavaScript。
- Node.js 不會檢查型別，型別寫錯照樣執行。
