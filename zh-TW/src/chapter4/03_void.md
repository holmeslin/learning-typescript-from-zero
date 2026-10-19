# `void`

## 本集目標

用 `void` 標示「沒有回傳值」的函式。

## 正文

有些函式的工作是「做一件事」，例如印出東西，而不是算出一個結果。這種函式的回傳型別是 `void`。建立 `receipt.ts`：

```ts
function printReceipt(total: number): void {
  console.log(`總計 ${total} 元`);
}

const result = printReceipt(100);
console.log(result);
```

```text
總計 100 元
undefined
```

`void` 的意思是「這個函式不回傳任何有用的東西」。在 JavaScript 裡，沒有 `return` 的函式其實會回傳 `undefined`，所以第二行印出了 `undefined`。

### 寫了 `void` 就不能回傳值

```ts,fails
function printReceipt(total: number): void {
  console.log(`總計 ${total} 元`);
  return total;
}

printReceipt(100);
```

```text
receipt.ts:3:3 - error TS2322: Type 'number' is not assignable to type 'void'.

3   return total;
    ~~~~~~


Found 1 error in receipt.ts:3
```

說好不回傳東西，就不能 `return` 一個值。只寫 `return;`（後面不接東西）提早結束函式，則是可以的。

### 不能拿 `void` 的結果來用

就算不寫 `: void`，TypeScript 也會從「函式裡沒有 `return`」推論出 `void`。如果你誤以為它有回傳值，拿來用：

```ts,fails
function printReceipt(total: number) {
  console.log(`總計 ${total} 元`);
}

const result = printReceipt(100);
console.log(result.toFixed(0));
```

```text
receipt.ts:6:20 - error TS2339: Property 'toFixed' does not exist on type 'void'.

6 console.log(result.toFixed(0));
                     ~~~~~~~


Found 1 error in receipt.ts:6
```

這段如果直接用 Node.js 執行，會在第 6 行當掉：`Cannot read properties of undefined (reading 'toFixed')`。TypeScript 提早告訴你：`result` 是 `void`，裡面沒有東西可以用。

### `void` 和 `undefined` 的差別

你可能會想：既然實際回傳的是 `undefined`，為什麼不把回傳型別寫成 `undefined`？

兩者的意思不一樣：

- `undefined`：「我會回傳 `undefined` 這個值」，呼叫的人可能會拿它來判斷。
- `void`：「別管我回傳什麼，不要用它」。

函式只是做事、沒有結果的時候，用 `void`。這個差別在第 8 集講 callback 的時候還會再遇到。

## 重點整理

- 沒有回傳值的函式，回傳型別是 `void`。
- 標了 `void` 的函式不能 `return` 一個值，但可以用 `return;` 提早結束。
- 沒有 `return` 的函式，TypeScript 會推論出 `void`，它的結果不能拿來用。
- 函式只做事、不產生結果時，用 `void` 而不是 `undefined`。
