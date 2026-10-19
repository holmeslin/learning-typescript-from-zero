# 物件型別的寫法

## 本集目標

用 `{ 屬性: 型別 }` 描述一個物件，並用型別別名替它取名字。

## 正文

### 寫出物件的形狀

建立 `book.ts`：

```ts
const book: { title: string; price: number } = {
  title: "小王子",
  price: 250,
};

console.log(book.title);
```

冒號後面的 `{ title: string; price: number }` 就是**物件型別**：這個物件有 `title` 和 `price` 兩個屬性，`title` 是字串，`price` 是數字。

它長得很像物件本身，差別在於：

- 冒號後面放的是**型別**，不是值。
- 屬性之間用分號 `;` 隔開。用逗號也可以，但一般習慣用分號。

### 少了屬性會被擋下

把 `price` 拿掉：

```ts,fails
const book: { title: string; price: number } = {
  title: "小王子",
};

console.log(book.title);
```

```text
book.ts:1:7 - error TS2741: Property 'price' is missing in type '{ title: string; }' but required in type '{ title: string; price: number; }'.

1 const book: { title: string; price: number } = {
        ~~~~

  book.ts:1:30 - 'price' is declared here.
    1 const book: { title: string; price: number } = {
                                   ~~~~~


Found 1 error in book.ts:1
```

「`{ title: string; }` 少了 `price` 這個屬性，但型別要求一定要有」。型別裡寫到的屬性，預設每一個都是必填的。

### 替物件型別取名字

把物件型別直接寫在變數後面，很快就會變得又長又難讀，而且同樣的形狀要寫好幾次。第 2 章學過的型別別名 `type`，最常用的地方就是替物件型別取名字：

```ts,fails
type Book = {
  title: string;
  price: number;
};

function describe(book: Book) {
  return `${book.title}：${book.price} 元`;
}

console.log(describe({ title: "小王子", price: 250 }));
console.log(describe({ title: "小王子", price: "250" }));
```

`Book` 定義一次，之後變數、參數都可以用。型別名稱習慣用**大寫開頭**，和一般的變數區分開來。

最後一行把 `price` 寫成了字串：

```text
book.ts:11:38 - error TS2322: Type 'string' is not assignable to type 'number'.

11 console.log(describe({ title: "小王子", price: "250" }));
                                        ~~~~~

  book.ts:3:3 - The expected type comes from property 'price' which is declared here on type 'Book'
    3   price: number;
        ~~~~~


Found 1 error in book.ts:11
```

錯誤直接指到 `"250"`，下面的補充說明還告訴你：「這個型別要求，來自 `Book` 的 `price` 屬性」。

用了型別別名之後，把游標移到 `describe` 的參數上，VS Code 也會顯示 `book: Book`，一眼就知道它要收什麼。

## 重點整理

- 物件型別的寫法是 `{ 屬性: 型別; 屬性: 型別 }`。
- 型別裡寫到的屬性都是必填的，少一個就會報錯。
- 用 `type 名稱 = { ... }` 替物件型別取名字，名稱用大寫開頭。
- 同一個形狀只要定義一次，變數和參數都可以重複使用。
