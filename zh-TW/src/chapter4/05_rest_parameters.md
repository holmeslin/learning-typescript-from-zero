# 其餘參數

## 本集目標

幫「可以傳任意多個引數」的其餘參數標上型別。

## 正文

JavaScript 的**其餘參數**（rest parameter）用 `...` 把多出來的引數收進一個陣列。在 TypeScript 裡，它的型別就寫成陣列型別。建立 `sum.ts`：

```ts,fails
function sum(...numbers: number[]) {
  let total = 0;
  for (const n of numbers) {
    total += n;
  }
  return total;
}

console.log(sum(1, 2, 3));
console.log(sum());
console.log(sum(10, "20"));
```

```text
sum.ts:11:21 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

11 console.log(sum(10, "20"));
                       ~~~~


Found 1 error in sum.ts:11
```

- `...numbers: number[]`：所有的引數都收進 `numbers`，每一個都必須是數字。
- `sum()` 沒傳任何東西也可以，這時 `numbers` 是空陣列。
- `"20"` 是字串，被擋下來了。在 JavaScript 裡，這行會印出 `1020`，因為 `+` 碰到字串就變成接字串。

注意型別要寫 `number[]`，不是 `number`。其餘參數收到的一定是陣列，標的也是整個陣列的型別。

### 和一般參數一起用

其餘參數前面可以有一般的參數，但它自己必須放在最後一個：

```ts
function report(title: string, ...scores: number[]) {
  const best = Math.max(...scores);
  console.log(`${title}：共 ${scores.length} 筆，最高 ${best} 分`);
}

const scores = [72, 95, 88];
report("期中考", ...scores);
report("小考", 60, 70);
```

```text
期中考：共 3 筆，最高 95 分
小考：共 2 筆，最高 70 分
```

第一個引數給 `title`，剩下的全部收進 `scores`。

`report("期中考", ...scores)` 用的是展開語法，把陣列拆開傳進去。TypeScript 知道 `scores` 是 `number[]`，拆開來每一個都是數字，所以也能通過檢查。

## 重點整理

- 其餘參數的型別寫成陣列型別，例如 `...numbers: number[]`。
- 每一個多出來的引數，都要符合陣列裡元素的型別。
- 其餘參數要放在所有參數的最後面。
- 用展開語法把陣列傳給其餘參數，TypeScript 一樣會檢查元素的型別。
