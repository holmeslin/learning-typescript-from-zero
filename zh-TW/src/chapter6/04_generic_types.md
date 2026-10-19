# 泛型型別與泛型介面

## 本集目標

用型別參數寫出可以重複使用的型別，並看懂 `Array<string>` 和 `Record<string, number>` 是什麼。

## 正文

### 型別別名也可以有型別參數

不只函式，型別別名也可以收型別參數：

```ts
type Box<T> = {
  value: T;
};

const numberBox: Box<number> = { value: 42 };
const textBox: Box<string> = { value: "你好" };

console.log(numberBox, textBox);
```

`Box<T>` 像一個「型別的範本」：`Box<number>` 是 `{ value: number }`，`Box<string>` 是 `{ value: string }`。這種有型別參數的型別叫**泛型型別**。

`interface` 的寫法一樣，把 `<T>` 放在名稱後面：

```ts
interface Pair<A, B> {
  first: A;
  second: B;
}

const score: Pair<string, number> = { first: "小明", second: 90 };
console.log(score);
```

### 型別參數不能省略

使用泛型型別時，型別參數要寫齊。建立 `box.ts`：

```ts,fails
type Box<T> = { value: T };

const b: Box = { value: 1 };
console.log(b);
```

```text
box.ts:3:10 - error TS2314: Generic type 'Box' requires 1 type argument(s).

3 const b: Box = { value: 1 };
           ~~~


Found 1 error in box.ts:3
```

「泛型型別 `Box` 需要 1 個型別引數」。跟泛型函式不同，標註變數型別時，TypeScript 不會幫你推論泛型型別的參數。

### 原來你早就用過

第 2 章學陣列型別時，有兩種寫法：

```ts
const a: number[] = [1, 2, 3];
const b: Array<number> = [1, 2, 3];

console.log(a, b);
```

現在你看得懂第二種了：`Array` 是 TypeScript 內建的泛型型別，`T` 是陣列元素的型別。`number[]` 只是 `Array<number>` 的簡寫，兩者完全一樣。

第 3 章的 `Record<string, number>` 也是內建的泛型型別，有兩個型別參數：第一個是鍵的型別，第二個是值的型別。

```ts
const stock: Record<string, number> = {
  apple: 10,
  banana: 5,
};

console.log(stock.apple);
```

`Record` 是怎麼寫出來的，第 8 章會說明。

### 搭配聯集：通用的結果型別

泛型型別最常見的用途之一，是包裝「可能成功、可能失敗」的結果。用第 5 章學過的可辨識聯集：

```ts
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

function parseAge(text: string): Result<number> {
  const age = Number(text);
  if (Number.isNaN(age)) {
    return { ok: false, error: `「${text}」不是數字` };
  }
  return { ok: true, value: age };
}

const result = parseAge("二十");
if (result.ok) {
  console.log(result.value + 1);
} else {
  console.log(result.error);
}
```

```text
「二十」不是數字
```

`Result<T>` 只寫一次，就能用在 `Result<number>`、`Result<string>` 或任何型別上。成功時 `value` 的型別跟著 `T` 走，失敗時一律是錯誤訊息。

## 重點整理

- 型別別名和 `interface` 都可以在名稱後面加 `<T>`，變成泛型型別。
- 使用泛型型別時，型別引數要寫齊，不然會出現 TS2314。
- `Array<number>` 就是 `number[]`；`Record<K, V>` 是有兩個型別參數的內建泛型型別。
- 泛型型別搭配可辨識聯集，可以寫出通用的 `Result<T>`。
