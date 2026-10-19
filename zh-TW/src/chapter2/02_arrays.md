# 陣列

## 本集目標

用 `number[]` 和 `Array<number>` 寫出陣列的型別，並知道空陣列要自己標型別。

## 正文

### 陣列的型別

陣列的型別寫法是「裡面東西的型別」加上 `[]`。建立 `scores.ts`：

```ts
const scores: number[] = [90, 85, 77];
const names: string[] = ["小明", "小華"];

console.log(scores, names);
```

```text
[ 90, 85, 77 ] [ '小明', '小華' ]
```

`number[]` 讀作「數字陣列」：一個陣列，裡面每一個元素都是數字。

說好是數字陣列，就不能放別的東西進去。把 `scores.ts` 改成這樣：

```ts,fails
const scores: number[] = [90, 85, 77];
scores.push("滿分");
console.log(scores);
```

```text
scores.ts:2:13 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

2 scores.push("滿分");
              ~~~~


Found 1 error in scores.ts:2
```

`push` 是一個函式，它的參數型別是 `number`，所以傳字串進去就是第 1 章看過的 TS2345。

### 另一種寫法：`Array<number>`

`number[]` 還有另一種寫法：

```ts
const names: Array<string> = ["小明", "小華"];
const labels = names.map((name) => `${name}同學`);
console.log(labels);
```

```text
[ '小明同學', '小華同學' ]
```

`Array<string>` 和 `string[]` 的意思**完全一樣**。這種角括號 `<>` 的寫法叫泛型，第 6 章會教。你在別人的程式碼裡兩種都會看到，這本書主要用 `string[]`，比較短。

順便注意一下 `map` 那一行：`name` 沒有標型別，但它不會出現第 1 章那個 TS7006 錯誤。因為 TypeScript 知道 `names` 是字串陣列，所以傳給 `map` 的 callback，第一個參數一定是字串。這也是型別推論，函式參數的這種情況第 4 章會再講。

### 陣列也會推論

有初始值的陣列，一樣不用寫型別：

```ts
const scores = [90, 85, 77];
const total = scores.reduce((sum, score) => sum + score, 0);
console.log(total / scores.length);
```

```text
84
```

把游標移到 `scores` 上面，VS Code 會顯示 `const scores: number[]`。

### 空陣列要自己標

一開始是空陣列的時候，TypeScript 沒辦法從 `[]` 看出你之後要放什麼。這時候請自己標上型別。建立 `tags.ts`：

```ts,fails
const tags: string[] = [];
tags.push("新手");
tags.push(100);
console.log(tags);
```

```text
tags.ts:3:11 - error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.

3 tags.push(100);
            ~~~


Found 1 error in tags.ts:3
```

標了 `string[]`，TypeScript 才知道這個陣列只能放字串，`push(100)` 才會被擋下來。**空陣列一律自己標型別**，這是個好習慣。

## 重點整理

- 陣列的型別寫成 `number[]`、`string[]`，意思是「每個元素都是這個型別」。
- `Array<string>` 和 `string[]` 完全一樣，這本書主要用 `string[]`。
- 有初始值的陣列會自動推論，`map`、`filter` 這些 callback 的參數也會。
- 空陣列 TypeScript 看不出要放什麼，要自己標型別。
