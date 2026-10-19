# 泛型約束

## 本集目標

用 `extends` 限制型別參數，讓泛型函式可以使用參數的屬性。

## 正文

### `T` 什麼都不能做

寫一個函式，回傳兩個值裡比較長的那個。建立 `longest.ts`：

```ts,fails
function longest<T>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

console.log(longest("apple", "kiwi"));
```

```text
longest.ts:2:12 - error TS2339: Property 'length' does not exist on type 'T'.

2   return a.length >= b.length ? a : b;
             ~~~~~~

longest.ts:2:24 - error TS2339: Property 'length' does not exist on type 'T'.

2   return a.length >= b.length ? a : b;
                         ~~~~~~


Found 2 errors in the same file, starting at: longest.ts:2
```

「型別 `T` 沒有 `length` 屬性」。`T` 可以是任何型別，包括沒有 `length` 的數字和布林值，所以 TypeScript 不讓你假設它有。

### 用 `extends` 加上約束

在型別參數後面寫 `extends`，說明 `T` 至少要長什麼樣子：

```ts
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

console.log(longest("apple", "kiwi"));
console.log(longest([1, 2], [1, 2, 3]));
```

```text
apple
[ 1, 2, 3 ]
```

`T extends { length: number }` 的意思是「`T` 可以是任何型別，只要它有一個數字型別的 `length` 屬性」。這叫**約束**（constraint）。字串和陣列都有 `length`，所以都可以傳。

不符合約束的型別會被擋下來：

```ts,fails
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

console.log(longest(10, 20));
```

```text
len.ts:5:21 - error TS2345: Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.

5 console.log(longest(10, 20));
                      ~~


Found 1 error in len.ts:5
```

這裡的 `extends` 跟第 3 章 `interface` 的 `extends` 是同一個字，意思也接近：「至少要有這些東西」。

### 為什麼不直接把參數標成 `{ length: number }`

你可能會想：既然只需要 `length`，參數直接標 `{ length: number }` 不就好了？試試看：

```ts,fails
function longest(a: { length: number }, b: { length: number }) {
  return a.length >= b.length ? a : b;
}

const word = longest("apple", "kiwi");
console.log(word.toUpperCase());
```

```text
plain.ts:6:18 - error TS2339: Property 'toUpperCase' does not exist on type '{ length: number; }'.

6 console.log(word.toUpperCase());
                   ~~~~~~~~~~~


Found 1 error in plain.ts:6
```

傳進去的是字串，拿回來卻只剩「有 `length` 的東西」，字串的其他功能都不見了。用泛型約束的版本，傳字串就回傳字串，傳陣列就回傳陣列，型別一路保留。這就是約束和普通型別標註的差別。

### 常見的用法：要求有某個屬性

實際寫程式時，最常見的約束是「物件要有 `id`」：

```ts
function findById<T extends { id: number }>(
  items: T[],
  id: number,
): T | undefined {
  return items.find((item) => item.id === id);
}

const users = [
  { id: 1, name: "小明" },
  { id: 2, name: "小華" },
];

const user = findById(users, 2);
console.log(user?.name);
```

```text
小華
```

`findById` 不在乎物件還有哪些屬性，只要有 `id` 就好。回傳的 `user` 型別保留了 `name`，所以可以讀 `user?.name`。回傳型別是 `T | undefined`，因為可能找不到。

## 重點整理

- 沒有約束的 `T` 可以是任何型別，所以不能假設它有任何屬性。
- `T extends 某型別` 限制 `T` 至少要符合那個型別，這叫約束。
- 不符合約束的引數會被擋下來。
- 跟直接標註參數型別相比，約束能保留傳進來的完整型別。
