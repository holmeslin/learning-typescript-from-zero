# 型別斷言 `as` 與非空斷言 `!`

## 本集目標

知道 `as` 和 `!` 怎麼用，更重要的是知道它們為什麼危險。

## 正文

前面幾集都是「你檢查，TypeScript 跟著縮小」。這一集的兩個語法正好相反：**你不檢查，直接告訴 TypeScript 答案**。

### 非空斷言 `!`

陣列的 `find` 找不到的時候會回傳 `undefined`，所以它的回傳型別帶著 `undefined`。建立 `find.ts`：

```ts,fails
const users = [
  { id: 1, name: "小明" },
  { id: 2, name: "小華" },
];

const user = users.find((u) => u.id === 2);
console.log(user.name);
```

```text
find.ts:7:13 - error TS18048: 'user' is possibly 'undefined'.

7 console.log(user.name);
              ~~~~


Found 1 error in find.ts:7
```

你知道 `id` 為 `2` 的使用者一定在陣列裡，但 TypeScript 不知道。正規的做法是用前面學的方法檢查：

```ts
const users = [
  { id: 1, name: "小明" },
  { id: 2, name: "小華" },
];

const user = users.find((u) => u.id === 2);
if (user) {
  console.log(user.name);
}
```

另一個做法，是在後面加一個驚嘆號：`users.find(...)!`。這叫**非空斷言**（non-null assertion），意思是「我保證這個值不是 `null` 也不是 `undefined`」。TypeScript 會直接把 `null` 和 `undefined` 從型別裡拿掉，不再報錯。

問題是，如果你的保證錯了呢？把要找的 `id` 改成不存在的 `3`：

```ts
const users = [
  { id: 1, name: "小明" },
  { id: 2, name: "小華" },
];

const user = users.find((u) => u.id === 3)!;
console.log(user.name);
```

`npx tsc` 沒有任何錯誤，但執行時當掉了：

```text
TypeError: Cannot read properties of undefined (reading 'name')
```

第 1 章講過，型別在執行時會被拿掉。`!` 也一樣，執行時它根本不存在，不會幫你做任何檢查。你用 `!` 關掉了 TypeScript 的警告，錯誤就又回到了 JavaScript 的老樣子：執行時才爆炸。

### 型別斷言 `as`

`as` 是更一般的版本：`值 as 型別`，意思是「把這個值當成這個型別」。

最常見的用途，是處理 TypeScript 看不出型別的資料，例如第 1 章提過的 `JSON.parse`：

```ts
type Book = { title: string; pages: number };

const data = JSON.parse('{ "title": "小王子" }') as Book;
console.log(data.pages.toFixed(0));
```

`npx tsc` 一樣沒有錯誤，因為你說 `data` 是 `Book`，TypeScript 就相信它有 `pages`。但 JSON 裡根本沒有 `pages`，執行時：

```text
TypeError: Cannot read properties of undefined (reading 'toFixed')
```

`as` 不會轉換資料，也不會檢查資料，它只改變 TypeScript「以為」的型別。

### `as` 也有底線

`as` 不是什麼都能轉。差太多的型別，TypeScript 會擋下來。建立 `as-number.ts`：

```ts,fails
const id = "A01" as number;
console.log(id);
```

```text
as-number.ts:1:12 - error TS2352: Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.

1 const id = "A01" as number;
             ~~~~~~~~~~~~~~~


Found 1 error in as-number.ts:1
```

「字串轉成數字可能是個錯誤，因為這兩個型別完全沒有重疊」。後半句提示了一個繞過的方法，但請不要這樣做：會需要繞過，代表你的設計有問題。

### 什麼時候可以用

`as` 和 `!` 等於在說「相信我，不用檢查」。原則是：**能用型別縮小解決的，就不要用斷言。**

真的需要用的情況不多，大部分是「你確實比 TypeScript 知道得更多」的時候。最典型的例子是操作網頁元素：你知道 HTML 裡一定有某個元素，但 TypeScript 看不到 HTML。第 11 章會遇到。

而從外面讀進來的資料，例如 `JSON.parse`、`fetch` 的結果，**不應該**用 `as` 打發，應該用上一集的型別守衛真的檢查一遍。這是第 10 章的主題。

## 重點整理

- `值!` 是非空斷言，把 `null` 和 `undefined` 從型別裡拿掉。
- `值 as 型別` 是型別斷言，讓 TypeScript 把值當成指定的型別。
- 斷言不會在執行時做任何檢查，說錯了程式一樣會當掉。
- 能用型別縮小解決的，就不要用斷言；外部資料要真的檢查，不要用 `as` 帶過。
