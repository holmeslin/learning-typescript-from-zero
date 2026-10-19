# 為什麼需要泛型

## 本集目標

看懂「不在乎型別的函式」用現有的寫法會遇到什麼問題，以及泛型怎麼解決。

## 正文

### 一個不在乎型別的函式

假設你要寫一個函式，拿出陣列的第一個元素。用 JavaScript 寫只要三行：

```js
function first(items) {
  return items[0];
}
```

它對數字陣列、字串陣列都能用。但改成 TypeScript，參數 `items` 要標什麼型別？

### 做法一：每種型別各寫一份

```ts
function firstNumber(items: number[]): number {
  return items[0];
}

function firstString(items: string[]): string {
  return items[0];
}

console.log(firstNumber([1, 2, 3]), firstString(["甲", "乙"]));
```

型別都對，但內容一模一樣的函式寫了兩次。之後還要支援布林值陣列、物件陣列，就要一直複製下去。

### 做法二：用 `any`

```ts
function first(items: any[]): any {
  return items[0];
}

const n = first([1, 2, 3]);
console.log(n.toUpperCase());
```

`npx tsc` 完全不報錯。但 `n` 明明是數字，數字沒有 `toUpperCase`，一執行就出事：

```text
TypeError: n.toUpperCase is not a function
```

`any` 等於關掉檢查。資料一經過這個函式，型別資訊就丟光了，TypeScript 只能放手不管。

### 做法三：用聯集

第 5 章學過聯集型別，試試看讓它收「數字或字串」的陣列。`(number | string)[]` 的意思是「每個元素是數字或字串的陣列」：

```ts,fails
function first(items: (number | string)[]): number | string {
  return items[0];
}

const n = first([1, 2, 3]);
console.log(n.toFixed(1));
```

```text
union.ts:6:15 - error TS2339: Property 'toFixed' does not exist on type 'string | number'.
  Property 'toFixed' does not exist on type 'string'.

6 console.log(n.toFixed(1));
                ~~~~~~~


Found 1 error in union.ts:6
```

這次比 `any` 安全，但太安全了。你傳進去的明明是數字陣列，拿出來的卻是「數字或字串」，每次使用前都要先做型別縮小。問題在於：**函式的回傳型別，和傳進來的型別之間沒有關聯。**

### 泛型的寫法

你真正想說的是：「傳進來的是什麼型別的陣列，就回傳那個型別」。泛型就是用來表達這件事的：

```ts
function first<T>(items: T[]): T {
  return items[0];
}

const n = first([1, 2, 3]);
const s = first(["甲", "乙"]);
console.log(n.toFixed(1), s.length);
```

```text
1.0 1
```

函式名稱後面的 `<T>` 宣告了一個**型別參數**（type parameter），名字叫 `T`。它像是一個「型別的變數」，代表「呼叫時才決定的某個型別」。

- 呼叫 `first([1, 2, 3])` 時，`T` 是 `number`，所以 `n` 是 `number`。
- 呼叫 `first(["甲", "乙"])` 時，`T` 是 `string`，所以 `s` 是 `string`。

只寫了一個函式，型別資訊卻一路保留下來。下一集會詳細拆解這個寫法。

## 重點整理

- 每種型別各寫一份函式會重複；用 `any` 會丟掉型別資訊。
- 用聯集比較安全，但回傳型別和傳進來的型別沒有關聯，每次都要縮小。
- 泛型用 `<T>` 宣告型別參數，讓「傳進來什麼型別，就回傳什麼型別」。
