# 映射型別入門

## 本集目標

看得懂映射型別的寫法，知道 `Record`、`Partial` 這些工具型別是怎麼寫出來的。

## 正文

從這一集開始的四集是「入門就好」。這幾種寫法在你自己的程式碼裡不常用到，但函式庫的型別定義裡到處都是。目標是**看得懂**，不要求你自己會寫。

### 把每個屬性換成別的型別

假設有一份設定，你想做一個「記錄哪些設定被改過」的物件：屬性名稱一樣，值全部是 `boolean`。建立 `mapped.ts`：

```ts,fails
type Settings = { darkMode: boolean; fontSize: number; language: string };

type SettingFlags = {
  [K in keyof Settings]: boolean;
};

const changed: SettingFlags = { darkMode: true, fontSize: false };
console.log(changed);
```

`[K in keyof Settings]: boolean` 讀作：「對 `keyof Settings` 裡的**每一個** `K`，都產生一個屬性 `K`，型別是 `boolean`」。`keyof Settings` 是 `"darkMode" | "fontSize" | "language"`，所以 `SettingFlags` 等於：

```ts
type SettingFlags = {
  darkMode: boolean;
  fontSize: boolean;
  language: boolean;
};

const changed: SettingFlags = {
  darkMode: true,
  fontSize: false,
  language: false,
};
console.log(changed);
```

少了 `language` 就報錯，補充說明還指回了 `Settings` 裡的 `language`：

```text
mapped.ts:7:7 - error TS2741: Property 'language' is missing in type '{ darkMode: true; fontSize: false; }' but required in type 'SettingFlags'.

7 const changed: SettingFlags = { darkMode: true, fontSize: false };
        ~~~~~~~

  mapped.ts:1:56 - 'language' is declared here.
    1 type Settings = { darkMode: boolean; fontSize: number; language: string };
                                                             ~~~~~~~~


Found 1 error in mapped.ts:7
```

這種「把一個聯集裡的每個成員，各自變成一個屬性」的寫法，叫**映射型別**（mapped type）。你可以把它想成型別版的 `map`：`in` 前面的 `K` 就像迴圈變數，一個一個走過聯集。

### `Record` 是這樣寫出來的

第 6 章留了一個問題：`Record` 是怎麼寫出來的？這是 TypeScript 內建的定義：

```ts
type Record<K extends keyof any, T> = {
  [P in K]: T;
};

type Size = "小" | "中" | "大";
const prices: Record<Size, number> = { "小": 30, "中": 40, "大": 50 };
console.log(prices);
```

現在你看得懂了：

- `K` 是屬性名稱的聯集，`T` 是值的型別。
- `[P in K]: T`：對 `K` 裡的每一個 `P`，產生屬性 `P`，型別是 `T`。
- `K extends keyof any` 是第 6 章的泛型約束。`keyof any` 是「任何東西能當屬性名稱的型別」，也就是 `string | number | symbol`。

所以 `Record<Size, number>` 會產生 `小`、`中`、`大` 三個屬性，這就是第 7 集「一個都不能少」的原因。

> 這裡為了示範，自己寫了一個叫 `Record` 的型別。內建的 `Record` 本來就有，平常不需要自己寫。

### 用原本的屬性型別：`Partial` 和 `Readonly`

映射型別的值也可以用第 3 集的索引存取，拿原本屬性的型別。這是內建的 `Partial` 和 `Readonly`：

```ts
type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

- `[P in keyof T]`：走過 `T` 的每一個屬性名稱。
- `T[P]`：值的型別跟原本一樣。
- `?` 讓每個屬性變成可選，`readonly` 讓每個屬性變成唯讀。

第 6～8 集的工具型別，大部分就是這樣幾行寫出來的，沒有什麼魔法。

## 重點整理

- 映射型別的寫法是 `{ [K in 聯集]: 型別 }`，對聯集的每一個成員產生一個屬性。
- `[K in keyof T]` 會走過 `T` 的每一個屬性名稱，`T[K]` 可以拿到原本的屬性型別。
- `Record`、`Partial`、`Readonly` 都是用映射型別寫出來的。
- 映射型別是入門就好：看得懂函式庫的定義就夠了。
