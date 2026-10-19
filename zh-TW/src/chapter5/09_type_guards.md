# 自訂型別守衛

## 本集目標

用 `is` 寫出自己的判斷函式，讓 TypeScript 在呼叫它的地方也能縮小型別。

## 正文

### 把判斷包成函式，縮小就不見了

第 5 集用 `"pages" in item` 分辨書和 Podcast。如果這個判斷到處都要用，你可能會想把它包成一個函式。建立 `is-book.ts`：

```ts,fails
type Book = { title: string; pages: number };
type Podcast = { title: string; minutes: number };

function isBook(item: Book | Podcast): boolean {
  return "pages" in item;
}

function describe(item: Book | Podcast) {
  if (isBook(item)) {
    return `${item.title}，共 ${item.pages} 頁`;
  }
  return `${item.title}，長 ${item.minutes} 分鐘`;
}

console.log(describe({ title: "小王子", pages: 96 }));
```

```text
is-book.ts:10:36 - error TS2339: Property 'pages' does not exist on type 'Book | Podcast'.
  Property 'pages' does not exist on type 'Podcast'.

10     return `${item.title}，共 ${item.pages} 頁`;
                                      ~~~~~

is-book.ts:12:34 - error TS2339: Property 'minutes' does not exist on type 'Book | Podcast'.
  Property 'minutes' does not exist on type 'Book'.

12   return `${item.title}，長 ${item.minutes} 分鐘`;
                                    ~~~~~~~


Found 2 errors in the same file, starting at: is-book.ts:10
```

執行起來結果是對的，但型別縮小失效了。原因是 `isBook` 的回傳型別寫的是 `boolean`：對呼叫它的地方來說，`isBook(item)` 只是「某個 `true` 或 `false`」，TypeScript 不知道 `true` 代表「`item` 是書」。

### 用 `is` 說清楚

把回傳型別從 `boolean` 改成 `item is Book`：

```ts
type Book = { title: string; pages: number };
type Podcast = { title: string; minutes: number };

function isBook(item: Book | Podcast): item is Book {
  return "pages" in item;
}

function describe(item: Book | Podcast) {
  if (isBook(item)) {
    return `${item.title}，共 ${item.pages} 頁`;
  }
  return `${item.title}，長 ${item.minutes} 分鐘`;
}

console.log(describe({ title: "小王子", pages: 96 }));
console.log(describe({ title: "科技早餐", minutes: 42 }));
```

```text
小王子，共 96 頁
科技早餐，長 42 分鐘
```

`item is Book` 的意思是：「這個函式回傳 `true` 的時候，參數 `item` 就是 `Book`」。函式實際上回傳的還是布林值，但 TypeScript 多知道了這層意義，在 `if (isBook(item))` 裡把 `item` 縮小成 `Book`，`else` 的部分則是 `Podcast`。

這種回傳型別寫成 `參數 is 型別` 的函式，叫**型別守衛**（type guard）。

### 讓 TypeScript 自己推論

其實，如果把 `isBook` 的 `: boolean` 整個拿掉、不寫回傳型別，TypeScript 會自己推論出 `item is Book`，一樣能縮小。像 `"pages" in item` 這種簡單的判斷，它看得出來。

陣列的 `filter` 也受惠於這一點：

```ts
const values = ["小明", null, "小華", null, "小美"];
const names = values.filter((value) => value !== null);
console.log(names.join("、"));
```

```text
小明、小華、小美
```

`values` 的型別是 `(string | null)[]`，而 `names` 的型別是 `string[]`，`null` 被過濾掉之後，型別也跟著去掉了 `null`。把游標移到 `names` 上就能確認。

不過判斷一複雜，TypeScript 就推論不出來了。自己寫 `is` 永遠是最清楚的做法，看程式碼的人也一眼就知道這個函式的用途。

### 小心：TypeScript 相信你

型別守衛有一個要注意的地方：TypeScript **不會檢查**你的判斷寫得對不對。如果 `isBook` 寫成 `return true`，TypeScript 一樣會相信它，然後把 Podcast 也當成書。寫型別守衛的時候，判斷式要確實檢查到該檢查的東西。

第 10 章處理從外面讀進來的資料時，會用型別守衛檢查一個 `unknown` 的值是不是符合某個物件型別，到時候會寫出比較長的判斷。

## 重點整理

- 回傳 `boolean` 的判斷函式，TypeScript 不知道 `true` 代表什麼，縮小會失效。
- 回傳型別寫成 `參數 is 型別`，就是型別守衛，呼叫的地方可以縮小型別。
- 簡單的判斷函式不寫回傳型別時，TypeScript 會自己推論出型別守衛，`filter` 也能因此縮小型別。
- TypeScript 不會檢查型別守衛的判斷是否正確，寫錯了它也照樣相信。
