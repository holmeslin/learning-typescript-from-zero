# `null` 與 `undefined`

## 本集目標

用 `string | null` 說明「可能沒有值」，並在使用前先確認它不是 `null`。

## 正文

### `string` 裡沒有 `null`

在 JavaScript 裡，任何變數都可以是 `null`。TypeScript 打開 `strict` 之後不是這樣。建立 `nickname.ts`：

```ts,fails
let nickname: string = null;
console.log(nickname);
```

```text
nickname.ts:1:5 - error TS2322: Type 'null' is not assignable to type 'string'.

1 let nickname: string = null;
      ~~~~~~~~


Found 1 error in nickname.ts:1
```

`null` 不能放進 `string`。在 TypeScript 裡，`null` 和 `undefined` 各自是一種型別，`string` 就只有字串，不包含「沒有值」。

### 「字串或 `null`」

真的需要「可能有、可能沒有」的時候，要明確寫出來：

```ts
let nickname: string | null = null;
console.log(nickname);

nickname = "小明";
console.log(nickname);
```

```text
null
小明
```

`string | null` 讀作「字串或 `null`」，意思是這個變數放的是**兩者之一**。中間的 `|` 叫聯集，它能做的事還很多，第 5 章會詳細講。現在只要會讀、會寫這種「某個型別或 `null`」就好。

`undefined` 也一樣，例如 `number | undefined` 是「數字或 `undefined`」。

### 用之前要先確認

這樣寫有什麼好處？看這個例子。建立 `find.ts`：

```ts,fails
function findName(id: number): string | null {
  if (id === 1) {
    return "小明";
  }
  return null;
}

const name = findName(2);
console.log(name.toUpperCase());
```

用 Node.js 執行，程式直接當掉：

```text
TypeError: Cannot read properties of null (reading 'toUpperCase')
```

`npx tsc` 在執行之前就抓到了：

```text
find.ts:9:13 - error TS18047: 'name' is possibly 'null'.

9 console.log(name.toUpperCase());
              ~~~~


Found 1 error in find.ts:9
```

「`name` 可能是 `null`」。因為 `findName` 的回傳型別寫了 `string | null`，TypeScript 知道它有可能找不到，要你先處理找不到的情況。

在 JavaScript 裡，「忘記處理 `null`」是最常見的當機原因之一。TypeScript 會逼你每一次都想清楚。

### 怎麼處理

最直接的方法是先用 `if` 確認不是 `null`：

```ts
function findName(id: number): string | null {
  if (id === 1) {
    return "小明";
  }
  return null;
}

const name = findName(2);
if (name !== null) {
  console.log(name.toUpperCase());
} else {
  console.log("找不到");
}

console.log(findName(1)?.length);
console.log(findName(2) ?? "無名氏");
```

```text
找不到
2
無名氏
```

- 在 `if (name !== null)` 的大括號裡，TypeScript 知道 `name` 一定是字串，所以可以呼叫 `toUpperCase()`。它為什麼知道，第 5 章會解釋，現在先照著寫。
- 你在 JavaScript 學過的 `?.` 和 `??` 也能用，TypeScript 看得懂它們。

### 沒有回傳值的函式

函式沒有 `return` 的時候，呼叫它會得到 `undefined`：

```ts
function log(message: string) {
  console.log(message);
}

const result = log("你好");
console.log(result);
```

```text
你好
undefined
```

這種「不回傳東西」的函式，回傳型別在 TypeScript 裡有專門的寫法，第 4 章會講。

## 重點整理

- 打開 `strict` 之後，`string`、`number` 這些型別不包含 `null` 和 `undefined`。
- 可能沒有值的時候，寫成 `string | null` 或 `number | undefined`，意思是「兩者之一」。
- 型別包含 `null` 的值，直接使用會出現 TS18047「可能是 `null`」。
- 先用 `if (x !== null)` 確認，或是用 `?.`、`??` 處理。
