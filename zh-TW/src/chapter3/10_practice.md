# 綜合練習

## 本集目標

替一份圖書館的資料寫出物件型別，讓 `tsc` 抓出藏在裡面的錯誤。

## 正文

這一集沒有新東西，只有一個題目。請先自己做，卡住再看提示，最後再對照參考解答。

### 題目：圖書館

建立 `library.ts`，貼上下面的程式碼。程式碼用到的 `Library` 和 `Book` 型別還沒定義，所以現在 `npx tsc` 會出現找不到名稱的錯誤：

```ts,ignore
// 在這裡定義 Author、Book、Library 三個型別

const library: Library = {
  name: "城市圖書館",
  books: [
    {
      isbn: "978-986-1",
      title: "小王子",
      author: { name: "聖修伯里", country: "法國" },
      tags: ["經典", "童話"],
    },
    {
      isbn: "978-986-2",
      title: "TypeScript 入門",
      author: { name: "王小明" },
      tags: ["程式"],
    },
  ],
  loans: { "978-986-1": 3 },
};

function describe(book: Book) {
  const country = book.author.country ?? "未知";
  return `${book.title}（${book.author.name}，${country}）`;
}

library.name = "市立圖書館";
library.loans["978-986-2"] = "一次";
library.books.push({ isbn: "978-986-3", title: "新書" });

for (const book of library.books) {
  console.log(describe(book));
}
console.log(library.loans);
```

請完成下面的事：

1. 在最上面定義三個型別：
   - `Author`：作者，有 `name`（字串）；`country`（字串）可以不填。
   - `Book`：書，有 `isbn`（字串，建立後不能改）、`title`（字串）、`author`（`Author`）、`tags`（字串陣列）。
   - `Library`：圖書館，有 `name`（字串，建立後不能改）、`books`（`Book` 的陣列）、`loans`（借閱次數，書的 ISBN 對應到次數）。
2. 執行 `npx tsc`。型別寫對的話，會剛好出現三個錯誤，都在 `describe` 下面那三行。
3. 讀懂每個錯誤，把程式改對，直到 `npx tsc` 什麼都不印。第三行請補上作者「林小華」（國家：台灣），沒有標籤。
4. 用 `node library.ts` 執行，確認輸出是：

```text
小王子（聖修伯里，法國）
TypeScript 入門（王小明，未知）
新書（林小華，台灣）
{ '978-986-1': 3, '978-986-2': 1 }
```

### 提示

- 「建立後不能改」用 `readonly`，「可以不填」用 `?`。
- `loans` 的屬性名稱是 ISBN，事先不知道有哪些，用 `Record`。
- 三個錯誤分別和 `readonly`、`Record` 的值、少了必填屬性有關。
- 圖書館的名稱既然不能改，那一行就整行刪掉。
- 「沒有標籤」不是不寫 `tags`，而是給它一個空陣列。

### 參考解答

做完再看。

<details>
<summary>展開參考解答</summary>

型別定義好之後，`npx tsc` 會印出類似下面的錯誤（行號會因為你的寫法而有些不同）：

```text
library.ts:43:9 - error TS2540: Cannot assign to 'name' because it is a read-only property.

43 library.name = "市立圖書館";
           ~~~~

library.ts:44:1 - error TS2322: Type 'string' is not assignable to type 'number'.

44 library.loans["978-986-2"] = "一次";
   ~~~~~~~~~~~~~~~~~~~~~~~~~~

library.ts:45:20 - error TS2739: Type '{ isbn: string; title: string; }' is missing the following properties from type 'Book': author, tags

45 library.books.push({ isbn: "978-986-3", title: "新書" });
                      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Found 3 errors in the same file, starting at: library.ts:43
```

- TS2540：`name` 是唯讀屬性，不能再指定新的值。
- TS2322：`loans` 的值必須是數字，`"一次"` 是字串。
- TS2739：「少了 `Book` 要求的 `author` 和 `tags`」。

改好的程式碼：

```ts
type Author = {
  name: string;
  country?: string;
};

type Book = {
  readonly isbn: string;
  title: string;
  author: Author;
  tags: string[];
};

type Library = {
  readonly name: string;
  books: Book[];
  loans: Record<string, number>;
};

const library: Library = {
  name: "城市圖書館",
  books: [
    {
      isbn: "978-986-1",
      title: "小王子",
      author: { name: "聖修伯里", country: "法國" },
      tags: ["經典", "童話"],
    },
    {
      isbn: "978-986-2",
      title: "TypeScript 入門",
      author: { name: "王小明" },
      tags: ["程式"],
    },
  ],
  loans: { "978-986-1": 3 },
};

function describe(book: Book) {
  const country = book.author.country ?? "未知";
  return `${book.title}（${book.author.name}，${country}）`;
}

library.loans["978-986-2"] = 1;
library.books.push({
  isbn: "978-986-3",
  title: "新書",
  author: { name: "林小華", country: "台灣" },
  tags: [],
});

for (const book of library.books) {
  console.log(describe(book));
}
console.log(library.loans);
```

幾個值得注意的地方：

- 改之前用 Node.js 執行，`push` 進去的新書沒有 `author`，跑到 `describe` 時 `book.author.country` 會讓程式當掉。型別把這個錯誤提早到寫程式的時候。
- `describe` 裡的 `book.author.country ?? "未知"`，是在處理可選屬性可能是 `undefined` 的情況。
- `Author` 獨立取名，是因為它是一個完整的概念，之後別的型別（例如譯者）也可能用到。

</details>

### 延伸挑戰

- 把 `Book` 改用 `interface` 寫寫看，確認 `npx tsc` 結果一樣。
- 新增一個 `Ebook` 型別：擁有 `Book` 的所有屬性，再加上 `fileSize`（數字）。分別用 `&` 和 `interface ... extends` 寫一次。
- 把 `tags` 改成唯讀陣列，然後試著在程式裡 `push` 一個標籤，看看會出現什麼錯誤。

## 重點整理

- 先定義小的物件型別，再組合成大的，型別會比較好讀、好重複使用。
- `readonly`、`?`、`Record` 都是在型別裡寫下資料的規則，違反規則時 `tsc` 會提醒你。
- 少了必填屬性的物件，在 JavaScript 裡要到執行時才會出錯，在 TypeScript 裡寫的時候就會被擋下。
