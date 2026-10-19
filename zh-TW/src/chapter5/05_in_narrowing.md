# `in` 縮小

## 本集目標

用 `in` 檢查物件有沒有某個屬性，分辨形狀不同的物件。

## 正文

### 兩種形狀的物件

`typeof` 只分得出「是不是物件」，分不出「是哪一種物件」。假設有書和 Podcast 兩種資料，建立 `describe.ts`：

```ts,fails
type Book = { title: string; pages: number };
type Podcast = { title: string; minutes: number };

function describe(item: Book | Podcast) {
  return `${item.title}，共 ${item.pages} 頁`;
}

console.log(describe({ title: "小王子", pages: 96 }));
```

```text
describe.ts:5:34 - error TS2339: Property 'pages' does not exist on type 'Book | Podcast'.
  Property 'pages' does not exist on type 'Podcast'.

5   return `${item.title}，共 ${item.pages} 頁`;
                                   ~~~~~


Found 1 error in describe.ts:5
```

`title` 兩種都有，可以直接用；`pages` 只有書有，Podcast 沒有，所以不能直接讀。這跟第 1 集「只能用每一種都有的東西」是同一個規則。

### 用 `in` 分辨

JavaScript 的 `in` 運算子會檢查物件有沒有某個屬性：`"pages" in item`。TypeScript 也看得懂它：

```ts
type Book = { title: string; pages: number };
type Podcast = { title: string; minutes: number };

function describe(item: Book | Podcast) {
  if ("pages" in item) {
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

- 在 `if ("pages" in item)` 裡，只有 `Book` 有 `pages`，所以 `item` 縮小成 `Book`。
- 走到下面的，一定沒有 `pages`，剩下 `Podcast`。

屬性名稱要寫成**字串**，`"pages"` 外面的引號不能少。

### 什麼時候用 `in`

`in` 適合處理「形狀不一樣、而且沒有共同的欄位可以分辨」的物件，例如別人寫好的資料格式，你沒辦法改。

如果資料是你自己設計的，有一個更好的做法：在每種物件裡放一個標明「我是哪一種」的欄位。這是第 7 集的可辨識聯集。

## 重點整理

- 聯集裡的物件，只有每一種都有的屬性可以直接用。
- `"屬性名稱" in 物件` 可以檢查物件有沒有某個屬性。
- TypeScript 會根據 `in` 的結果，把物件縮小成有（或沒有）那個屬性的型別。
