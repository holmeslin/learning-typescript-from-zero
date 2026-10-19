# 綜合練習

## 本集目標

用這一章學到的陣列、元組、`null` 和型別別名，寫出一份成績報告。

## 正文

這一集沒有新東西，只有一個題目。請先自己寫，卡住再看提示，最後再對照參考解答。

### 題目：成績報告

建立 `report.ts`，完成下面的事：

1. 用 `type` 定義一個型別別名 `Student`。它是一個元組：第一個位置是名字（字串），第二個位置是這個學生的所有成績（數字陣列）。
2. 寫一個函式 `average`，參數是一個數字陣列，回傳平均分數。如果陣列是空的，回傳 `null`。請幫參數和回傳值都標上型別。
3. 用下面這份資料，印出每個學生的平均分數；沒有成績的學生，印出「還沒有成績」。

```ts,ignore
const students: Student[] = [
  ["小明", [90, 85, 77]],
  ["小華", []],
  ["小美", [100, 95]],
];
```

預期的輸出：

```text
小明：84 分
小華：還沒有成績
小美：97.5 分
```

寫完用 `npx tsc` 確認沒有錯誤，再用 `node report.ts` 執行。

### 提示

- `Student` 的型別是 `[string, number[]]`。`Student[]` 就是「`Student` 的陣列」。
- `average` 的回傳型別是 `number | null`。
- 平均可以用 `reduce` 加總再除以長度。記得先檢查 `scores.length === 0`。
- `for (const [name, scores] of students)` 可以一邊走訪、一邊解構元組。
- `average` 的結果可能是 `null`，用 `if` 先確認，TypeScript 才會讓你把它當數字用。

### 參考解答

寫完再看。

<details>
<summary>展開參考解答</summary>

```ts
type Student = [string, number[]];

function average(scores: number[]): number | null {
  if (scores.length === 0) {
    return null;
  }
  const total = scores.reduce((sum, score) => sum + score, 0);
  return total / scores.length;
}

const students: Student[] = [
  ["小明", [90, 85, 77]],
  ["小華", []],
  ["小美", [100, 95]],
];

for (const [name, scores] of students) {
  const result = average(scores);
  if (result === null) {
    console.log(`${name}：還沒有成績`);
  } else {
    console.log(`${name}：${result} 分`);
  }
}
```

幾個值得注意的地方：

- `average` 的回傳型別寫了 `number | null`，呼叫的人就一定要處理 `null` 的情況。如果你在 `else` 以外的地方直接拿 `result` 做計算，會看到 TS18047。
- `students` 標了 `Student[]`，所以 `["小華", []]` 裡的空陣列不用另外標型別，TypeScript 知道它是 `number[]`。
- 解構出來的 `name` 和 `scores`，把游標移上去，分別是 `string` 和 `number[]`。

</details>

### 延伸挑戰

- 改用 `??` 來處理 `null`：讓沒有成績的學生直接印出「小華：還沒有成績」，試著只用一行 `console.log`。
- 在 `students` 裡加一筆 `["小強", [80, "90"]]`，看看 `npx tsc` 怎麼說。

## 重點整理

- 型別別名可以幫元組這種較長的型別取名字，`Student[]` 就是「`Student` 的陣列」。
- 回傳型別寫 `number | null`，等於在提醒呼叫的人「這裡可能沒有結果」。
- 元組可以在 `for...of` 裡直接解構，每個變數都有正確的型別。
