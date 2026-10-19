# 回傳型別要不要寫

## 本集目標

知道寫和不寫回傳型別的差別，並決定什麼時候該寫。

## 正文

第 1 章說過，回傳型別可以不寫，TypeScript 會自己推論。那到底要不要寫？先看不寫的時候會發生什麼事。

### 不寫：錯誤跑到別的地方

把上一集的 `grade.ts` 拿掉回傳型別：

```ts,fails
function getGrade(score: number) {
  if (score >= 60) {
    return "及格";
  }
  return score;
}

const grade = getGrade(80);
console.log(grade.length);
```

```text
grade.ts:9:19 - error TS2339: Property 'length' does not exist on type 'number | "及格"'.
  Property 'length' does not exist on type 'number'.

9 console.log(grade.length);
                    ~~~~~~


Found 1 error in grade.ts:9
```

TypeScript 看到函式有時回傳字串、有時回傳數字，就推論出回傳型別是 `number | "及格"`，意思是「可能是數字，也可能是 `"及格"` 這個字串」。（`"及格"` 這種寫法叫字面值型別，第 5 章會講，現在把它當成字串就好。）

錯誤還是被抓到了，但位置不對：錯誤標在第 9 行**用到回傳值**的地方，而真正寫錯的是函式裡的第 5 行。函式和呼叫的地方如果在不同檔案，你得自己追回去才找得到原因。

上一集寫了 `: string` 的版本，錯誤直接標在第 5 行的 `return`。**寫了回傳型別，錯誤就會出現在寫錯的地方。**

### 不寫：忘了回傳也不知道

再看一個例子。建立 `label.ts`：

```ts
function getLabel(score: number) {
  if (score >= 90) {
    return "優秀";
  } else if (score >= 60) {
    return "及格";
  }
}

console.log(getLabel(50));
```

`npx tsc` 沒有任何錯誤，執行卻印出：

```text
undefined
```

分數低於 60 的情況，忘了寫 `return`。TypeScript 以為這是你故意的，把回傳型別推論成「`"優秀"`、`"及格"` 或 `undefined`」，就不再追究了。

加上 `: string` 試試：

```ts,fails
function getLabel(score: number): string {
  if (score >= 90) {
    return "優秀";
  } else if (score >= 60) {
    return "及格";
  }
}

console.log(getLabel(50));
```

```text
label.ts:1:35 - error TS2366: Function lacks ending return statement and return type does not include 'undefined'.

1 function getLabel(score: number): string {
                                    ~~~~~~


Found 1 error in label.ts:1
```

「函式結尾少了 `return`，而回傳型別不包含 `undefined`」。你說好一定回傳字串，TypeScript 就會檢查每一條路線最後都有回傳字串。

### 那該怎麼選

回傳型別就像你對這個函式許下的承諾：「它一定回傳這個型別」。寫出來，TypeScript 就會幫你檢查函式有沒有遵守承諾。

| 情況 | 建議 |
| --- | --- |
| 一兩行就寫完的小函式 | 交給推論，例如 `(n: number) => n * 2` |
| 有 `if`、有好幾個 `return` 的函式 | 寫出來，讓錯誤出現在函式裡 |
| 會被其他檔案、其他人使用的函式 | 寫出來，當成說明書 |

不確定的時候，寫出來不會錯。

## 重點整理

- 不寫回傳型別時，錯誤會出現在用到回傳值的地方，而不是寫錯的地方。
- 不寫回傳型別時，漏掉的 `return` 會被當成故意回傳 `undefined`。
- 寫了回傳型別，TypeScript 會檢查每條路線都回傳正確的型別，漏掉時出現 TS2366。
- 小函式交給推論；有分支、會給別人用的函式，把回傳型別寫出來。
