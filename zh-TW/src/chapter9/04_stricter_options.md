# 更嚴格的選項

## 本集目標

認識 `noUncheckedIndexedAccess` 和 `exactOptionalPropertyTypes`，知道它們抓什麼錯誤、什麼時候值得打開。

## 正文

`strict` 打開的檢查已經很多，但還有幾個選項沒有包在裡面，要自己另外打開。這一集介紹最值得知道的兩個。你用 `npx tsc --init` 產生的設定檔，這兩個預設就是開的。

### `noUncheckedIndexedAccess`：用索引讀到的值可能不存在

第 3 章第 7 集看過這段程式碼：

```ts
const stock: Record<string, number> = { "鍵盤": 12 };
const count = stock["耳機"];
console.log(count.toFixed(0));
```

`npx tsc` 不會報錯，執行卻會當掉，因為 `"耳機"` 根本不存在。第 6 章第 2 集也提過，空陣列的 `items[0]` 會拿到 `undefined`，但型別說它一定有值。

當時說過「第 9 章會介紹一個設定」，就是 `noUncheckedIndexedAccess`。在 `tsconfig.json` 的 `"strict": true,` 下面加一行：

```json
"noUncheckedIndexedAccess": true,
```

再建立 `stock.ts`：

```ts
const stock: Record<string, number> = { "鍵盤": 12 };
const count = stock["耳機"];
console.log(count.toFixed(0));

const scores = [90, 85, 77];
const first = scores[0];
console.log(first.toFixed(1));

for (const score of scores) {
  console.log(score.toFixed(1));
}
```

```text
stock.ts:3:13 - error TS18048: 'count' is possibly 'undefined'.

3 console.log(count.toFixed(0));
              ~~~~~

stock.ts:7:13 - error TS18048: 'first' is possibly 'undefined'.

7 console.log(first.toFixed(1));
              ~~~~~


Found 2 errors in the same file, starting at: stock.ts:3
```

打開之後，**用 `[]` 讀出來的值**，型別都會多一個 `| undefined`：`count` 變成 `number | undefined`，`first` 也是。要先處理「可能沒有」的情況才能用：

```ts
const stock: Record<string, number> = { "鍵盤": 12 };
const count = stock["耳機"] ?? 0;
console.log(count.toFixed(0));

const scores = [90, 85, 77];
const first = scores[0];
if (first !== undefined) {
  console.log(first.toFixed(1));
}

for (const score of scores) {
  console.log(score.toFixed(1));
}
```

```text
0
90.0
90.0
85.0
77.0
```

注意 `for...of` 那段完全沒有報錯。用 `for...of` 走訪陣列，每一個拿到的元素一定存在，TypeScript 知道這一點。所以打開這個選項之後，你會更常用 `for...of`、`map`、`filter`，少用 `[i]` 去拿元素，這本身就是好習慣。

### `exactOptionalPropertyTypes`：沒有屬性和屬性是 `undefined` 不一樣

第 3 章第 2 集學過可選屬性。建立 `user.ts`：

```ts
type User = {
  name: string;
  email?: string;
};

const a: User = { name: "小明" };
const b: User = { name: "小華", email: undefined };

console.log("email" in a, "email" in b);
```

```text
false true
```

`a` 是「沒有 `email` 這個屬性」，`b` 是「有 `email` 這個屬性，值是 `undefined`」。這兩件事其實不一樣，`in` 就分得出來。但 TypeScript 預設把它們當成同一件事，兩種寫法都允許。

在 `tsconfig.json` 再加一行：

```json
"exactOptionalPropertyTypes": true,
```

`b` 那一行就會報錯：

```text
user.ts:7:7 - error TS2375: Type '{ name: string; email: undefined; }' is not assignable to type 'User' with 'exactOptionalPropertyTypes: true'. Consider adding 'undefined' to the types of the target's properties.
  Types of property 'email' are incompatible.
    Type 'undefined' is not assignable to type 'string'.

7 const b: User = { name: "小華", email: undefined };
        ~


Found 1 error in user.ts:7
```

意思是「`email?: string` 代表『可以沒有，有的話一定是字串』，不能明確放 `undefined`」。錯誤訊息的第一行也給了建議：如果你真的想允許 `undefined`，就把型別寫成 `email?: string | undefined`。

這個選項抓的錯誤比較少見，打開之後要多寫的東西卻不少，很多專案選擇不開。知道它存在、看得懂它的錯誤訊息就夠了。

### 這本書為什麼不開

這兩個選項都是好東西，尤其是 `noUncheckedIndexedAccess`。但這本書的練習設定沒有打開它們：前幾章的範例裡有很多 `[0]`，如果每次都要多處理 `undefined`，會讓剛入門的人分心。

現在你已經會型別縮小了，自己的專案可以考慮打開 `noUncheckedIndexedAccess`。至於 `ts-practice`，**看完這一集，請把剛才加的兩行刪掉**，讓之後的範例結果跟書上一樣，也記得刪掉 `stock.ts` 和 `user.ts`。

## 重點整理

- `noUncheckedIndexedAccess` 讓 `[]` 讀出來的值多一個 `| undefined`，抓出「讀到不存在的元素」的錯誤。
- 打開它之後，`for...of`、`map` 這類寫法不受影響，用 `[i]` 拿值才需要多檢查。
- `exactOptionalPropertyTypes` 區分「沒有這個屬性」和「屬性的值是 `undefined`」。
- 這兩個選項不包含在 `strict` 裡，要另外打開；練習資料夾裡看完就改回來。
