# 函式多載（入門）

## 本集目標

看懂函式多載：同一個函式，傳不同型別的引數，得到不同型別的回傳值。

## 正文

這一集的目標是「看得懂」。你在函式庫的型別說明裡常會看到這種寫法，但自己寫的機會不多。

### 問題：回傳型別太模糊

假設有個函式，傳字串就轉成數字，傳數字就轉成字串。建立 `convert.ts`：

```ts,fails
function convert(value: string | number) {
  if (typeof value === "string") {
    return Number(value);
  }
  return String(value);
}

const a = convert("42");
console.log(a.toFixed(1));
```

`string | number` 和第 2 章看過的 `string | null` 是同一種寫法，意思是「字串或數字」。`typeof value === "string"` 用來判斷目前是哪一種，第 5 章會詳細講，現在先照抄。

```text
convert.ts:9:15 - error TS2339: Property 'toFixed' does not exist on type 'string | number'.
  Property 'toFixed' does not exist on type 'string'.

9 console.log(a.toFixed(1));
                ~~~~~~~


Found 1 error in convert.ts:9
```

你知道傳 `"42"` 進去一定拿回數字，但 TypeScript 只看函式的型別：回傳值是「字串或數字」。它不知道傳什麼進去會拿回什麼。

### 多載：把每一種情況寫出來

**函式多載**（overload）就是把「傳什麼、拿回什麼」的每一種組合，分別寫成一行：

```ts
function convert(value: string): number;
function convert(value: number): string;
function convert(value: string | number) {
  if (typeof value === "string") {
    return Number(value);
  }
  return String(value);
}

const a = convert("42");
const b = convert(42);
console.log(a.toFixed(1));
console.log(b.padStart(5, "0"));
```

```text
42.0
00042
```

前兩行只有型別、沒有函式內容，結尾是分號，這叫**多載簽章**：

- 第 1 行：傳字串，回傳數字。
- 第 2 行：傳數字，回傳字串。

第 3 行開始才是真正的函式內容，叫做**實作**。它的參數要能同時接受所有多載的情況，所以寫成 `string | number`。

呼叫的時候，TypeScript 會從上往下找第一個符合的多載簽章。`convert("42")` 符合第 1 行，所以 `a` 是 `number`；`convert(42)` 符合第 2 行，所以 `b` 是 `string`。

### 只能照著多載簽章呼叫

實作的那一行，外面是看不到的。呼叫時只能用前面寫出來的組合：

```ts,fails
function convert(value: string): number;
function convert(value: number): string;
function convert(value: string | number) {
  if (typeof value === "string") {
    return Number(value);
  }
  return String(value);
}

console.log(convert(true));
```

```text
convert.ts:10:21 - error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type 'boolean' is not assignable to parameter of type 'number'.

10 console.log(convert(true));
                       ~~~~

  convert.ts:2:10 - The last overload is declared here.
    2 function convert(value: number): string;
               ~~~~~~~


Found 1 error in convert.ts:10
```

`No overload matches this call.` 是「沒有任何一個多載符合這次呼叫」。看到這個錯誤，就去看函式有哪幾種多載簽章，確認自己傳的引數符合其中哪一個。

### 什麼時候用

多載寫起來囉唆，實作裡面還要自己判斷型別。大部分情況，有更簡單的做法：

- 拆成兩個函式，例如 `toNumber` 和 `toText`，各自的型別都很清楚。
- 回傳型別一樣的話，參數直接寫 `string | number` 就夠了，不需要多載。

所以這一集學到「看得懂」就好。在 VS Code 裡把游標移到某些內建函式上面，看到 `(+2 overloads)` 這種字樣，就知道它有好幾種多載簽章。

## 重點整理

- 函式多載是把「傳什麼、回傳什麼」的每一種組合分別寫成多載簽章。
- 多載簽章只有型別、以分號結尾；最後一個有函式內容的叫實作。
- 呼叫時只能照多載簽章，不符合任何一個會出現 TS2769。
- 自己寫程式時，通常拆成兩個函式比多載更簡單。
