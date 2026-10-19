# 替沒有型別的套件寫宣告

## 本集目標

遇到沒有附型別、也沒有 `@types` 的套件時，自己寫一份宣告。

## 正文

第 2 章第 5 集說過，`any` 常常從「沒有型別的舊套件」跑進來，「第 9 章會講怎麼處理」。這一集就來處理它。

### 一個沒有型別的套件

`zero-fill` 是一個很小的套件，用來在數字前面補零，例如把 `42` 補成 `000042`。它是用 JavaScript 寫的，沒有附型別。安裝它：

```bash
npm install zero-fill
```

這次沒有加 `-D`，因為程式執行時真的會用到它。建立 `order.ts`：

```ts,ignore
import zeroFill from "zero-fill";

const orderId = zeroFill(6, 42);
console.log(`訂單編號：A${orderId}`);
```

`zeroFill(6, 42)` 的意思是「把 `42` 補成 6 位數」。執行沒問題：

```bash
node order.ts
```

```text
訂單編號：A000042
```

但 `npx tsc`：

```text
order.ts:1:22 - error TS7016: Could not find a declaration file for module 'zero-fill'. '…/ts-practice/node_modules/zero-fill/index.js' implicitly has an 'any' type.
  Try `npm i --save-dev @types/zero-fill` if it exists or add a new declaration (.d.ts) file containing `declare module 'zero-fill';`

1 import zeroFill from "zero-fill";
                       ~~~~~~~~~~~


Found 1 error in order.ts:1
```

（`…` 是你電腦上的路徑。）

又是第 8 集看過的 TS7016：找不到宣告檔，所以 `zero-fill` 被暗中當成 `any`。錯誤訊息的第二行給了兩條路。

### 第一條路：找 `@types`

「如果 `@types/zero-fill` 存在，就安裝它」。先用 `npm view` 查查看有沒有：

```bash
npm view @types/zero-fill
```

```text
npm error code E404
npm error 404 Not Found - GET https://registry.npmjs.org/@types%2fzero-fill - Not found
```

（後面還有幾行，這裡省略了。）

`404 Not Found`，沒有人替它寫過型別。如果有，裝起來就解決了，跟上一集的 `@types/node` 一樣。這條路走不通，看第二條。

### 第二條路：自己寫宣告

「新增一個 `.d.ts` 檔，裡面寫 `declare module 'zero-fill';`」。在 `ts-practice` 裡建立 `zero-fill.d.ts`：

```ts,ignore
declare module "zero-fill";
```

`npx tsc` 安靜了。但這一行的意思是「有一個叫 `zero-fill` 的模組，裡面是什麼我不管」，它匯出的所有東西都是 `any`。錯誤是不見了，問題卻沒解決，跟第 2 章說的「把錯誤藏起來」是同一回事。

比較好的做法是把內容寫清楚。先去看套件的說明或原始碼，`node_modules/zero-fill/index.js` 的開頭是這樣：

```js
module.exports = function zeroFill (width, number, pad) {
```

它匯出一個函式，收「寬度」、「數字」，還有一個可以省略的「補什麼字元」。照著把 `zero-fill.d.ts` 改成：

```ts,ignore
declare module "zero-fill" {
  export default function zeroFill(width: number, num: number): string;
}
```

- `declare module "zero-fill" { ... }`：說明 `zero-fill` 這個模組裡有什麼。
- `export default function ...`：它的預設匯出是一個函式，所以 `import zeroFill from "zero-fill"` 可以拿到它。
- 只寫你會用到的部分就好。第三個參數 `pad` 這裡用不到，就先不寫，等需要時再補。

再執行 `npx tsc`，沒有錯誤。現在 `zeroFill` 有型別了，把 `order.ts` 改成 `zeroFill(6, "42")` 試試：

```text
order.ts:3:29 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

3 const orderId = zeroFill(6, "42");
                              ~~~~


Found 1 error in order.ts:3
```

型別檢查回來了。

### 跟第 8 集的差別

第 8 集替 `old/money.js` 寫宣告時，是在它**旁邊**放一個同名的 `money.d.ts`，TypeScript 自己會找到。但 `zero-fill` 在 `node_modules` 裡，你不應該去改別人的套件，所以改用 `declare module "套件名稱"`，宣告檔可以放在專案裡任何地方。

| 情況 | 寫法 |
| --- | --- |
| 自己的 `.js` 檔 | 旁邊放同名的 `.d.ts`，用 `export declare` |
| `node_modules` 裡的套件 | 專案裡放一個 `.d.ts`，用 `declare module "套件名稱" { ... }` |

### 遇到沒有型別的套件，照這個順序

1. 看套件本身有沒有附型別。直接 `import`，`npx tsc` 沒抱怨就是有。
2. 沒有的話，用 `npm view @types/套件名稱` 查 `@types`，有就安裝。
3. 都沒有，自己用 `declare module` 寫宣告，只寫你用到的部分。
4. 認真考慮換一個有型別的套件。現在大部分維護中的套件都有附型別，沒有的通常也很久沒人更新了。

看完可以刪掉 `order.ts` 和 `zero-fill.d.ts`，再用 `npm uninstall zero-fill` 移除套件。

## 重點整理

- 匯入沒有型別的套件會出現 TS7016，套件會被當成 `any`。
- 先查有沒有 `@types/套件名稱`，有就安裝。
- 沒有的話，在 `.d.ts` 裡用 `declare module "套件名稱" { ... }` 自己寫宣告。
- `declare module "套件名稱";` 一行只會讓錯誤消失，內容全都是 `any`，不建議。
