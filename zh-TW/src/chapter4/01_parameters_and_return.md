# 參數與回傳值的型別

## 本集目標

知道 TypeScript 除了檢查參數的型別，還會檢查參數的數量和回傳的值。

## 正文

第 1 章學過，參數標了型別，傳錯型別的引數就會報錯。其實 TypeScript 檢查的不只是型別。

### 參數的數量

建立 `params.ts`：

```ts,fails
function rectangleArea(width: number, height: number): number {
  return width * height;
}

console.log(rectangleArea(3));
console.log(rectangleArea(3, 4, 5));
```

在 JavaScript 裡，少傳或多傳引數都不會報錯。用 Node.js 執行：

```bash
node params.ts
```

```text
NaN
12
```

第一次少傳了 `height`，它變成 `undefined`，`3 * undefined` 就是 `NaN`。第二次多傳的 `5` 直接被丟掉，你可能根本沒發現自己傳錯了。

`npx tsc` 兩個都抓得到：

```text
params.ts:5:13 - error TS2554: Expected 2 arguments, but got 1.

5 console.log(rectangleArea(3));
              ~~~~~~~~~~~~~

  params.ts:1:39 - An argument for 'height' was not provided.
    1 function rectangleArea(width: number, height: number): number {
                                            ~~~~~~~~~~~~~~

params.ts:6:33 - error TS2554: Expected 2 arguments, but got 3.

6 console.log(rectangleArea(3, 4, 5));
                                  ~


Found 2 errors in the same file, starting at: params.ts:5
```

`Expected 2 arguments, but got 1.` 的意思是「預期 2 個引數，結果只拿到 1 個」。第一則的補充說明還告訴你，少的是 `height`。

在 TypeScript 裡，**宣告了幾個參數，就要傳幾個引數**。真的想讓某個參數可以不傳，要另外說明，第 4 集會教。

### 回傳的值

回傳型別寫了之後，函式裡的**每一個** `return` 都會被檢查。建立 `grade.ts`：

```ts,fails
function getGrade(score: number): string {
  if (score >= 60) {
    return "及格";
  }
  return score;
}

console.log(getGrade(80));
```

```text
grade.ts:5:3 - error TS2322: Type 'number' is not assignable to type 'string'.

5   return score;
    ~~~~~~


Found 1 error in grade.ts:5
```

說好回傳字串，第 5 行卻回傳了數字。注意錯誤標在 `return` 那一行，也就是寫錯的地方。

這個例子用 Node.js 執行會印出 `及格`，看不出問題，因為 `80` 剛好走第一個 `return`。只有分數低於 60 時才會回傳數字。這種「只有某些情況才會出錯」的 bug，最難靠手動測試發現，型別檢查卻能一次看完所有的路線。

## 重點整理

- 呼叫函式時，引數的數量要和參數一樣，少傳或多傳都會出現 TS2554。
- 寫了回傳型別，函式裡每一個 `return` 都會被檢查。
- 型別檢查會看過函式裡所有的路線，不只是這次執行剛好走到的那一條。
