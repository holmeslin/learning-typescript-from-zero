# 型別只在檢查時存在

## 本集目標

理解型別在執行時會消失，以及這件事帶來的兩個限制。

## 正文

第 3 集講過，Node.js 執行 `.ts` 檔時，會先把型別拿掉。這件事聽起來很簡單，卻決定了 TypeScript 能做什麼、不能做什麼。

### 執行時沒有型別

這段程式碼：

```ts
function double(n: number): number {
  return n * 2;
}

console.log(double(5));
```

Node.js 真正執行的是：

```js
function double(n) {
  return n * 2;
}

console.log(double(5));
```

`: number` 全部不見了。程式在跑的時候，**沒有任何地方記得 `n` 應該是數字**。

這帶來第一個限制：**TypeScript 只能檢查它看得到的程式碼。** 如果資料是從外面來的，例如使用者輸入、讀進來的檔案、從網路抓回來的 JSON，TypeScript 在檢查的時候根本看不到那份資料長什麼樣子，也就沒辦法保證它的型別。

```ts
const data = JSON.parse('{ "name": "小明" }');
console.log(data.nmae);
```

這段 `npx tsc` 不會報錯，執行會印出 `undefined`。因為 `JSON.parse` 讀的是一段字串，TypeScript 不知道字串裡面是什麼，只好放棄檢查。怎麼安全地處理這種外部資料，第 10 章會專門講。

### 只能用「拿得掉」的語法

Node.js 拿掉型別的方式很單純：把型別的部分換成空白，其他原封不動。所以它只能處理「拿掉之後，剩下的就是正常 JavaScript」的語法。

TypeScript 有少數幾種語法不是這樣，拿掉之後程式就不完整了。最常見的是 `enum`。建立 `color.ts`：

```ts,fails
enum Color {
  Red,
  Green,
}

console.log(Color.Red);
```

用 Node.js 執行，直接出錯（中間省略了一些行）：

```text
SyntaxError [ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX]: TypeScript enum is not supported in strip-only mode
```

「strip-only mode」就是「只拿掉型別」的模式。`npx tsc` 也會先警告你：

```text
color.ts:1:6 - error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.

1 enum Color {
       ~~~~~


Found 1 error in color.ts:1
```

這就是第 2 集在 `tsconfig.json` 裡打開 `erasableSyntaxOnly` 的原因：讓 `tsc` 提早告訴你「這種寫法 Node.js 跑不了」。

不用擔心少了 `enum` 會不方便，第 8 章會教更好的替代寫法。你在別人的程式碼裡看到 `enum` 時，附錄有說明怎麼看懂它。

看完記得刪掉 `color.ts`。

## 重點整理

- 執行時型別已經不存在，程式不會記得變數「應該」是什麼型別。
- TypeScript 只能檢查它看得到的程式碼，從外面讀進來的資料要另外處理。
- Node.js 只能執行「型別拿掉後就是正常 JavaScript」的語法，`enum` 不行。
- `tsconfig.json` 的 `erasableSyntaxOnly` 會讓 `tsc` 提早抓出這類語法。
