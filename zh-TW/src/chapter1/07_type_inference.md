# 型別推論

## 本集目標

知道 TypeScript 會自己猜出型別，以及什麼時候不需要寫型別標註。

## 正文

### 不寫，它也知道

建立 `inference.ts`：

```ts,fails
let count = 0;
count = "零";
console.log(count);
```

這裡一個型別都沒寫，但 `npx tsc` 還是抓到了：

```text
inference.ts:2:1 - error TS2322: Type 'string' is not assignable to type 'number'.

2 count = "零";
  ~~~~~


Found 1 error in inference.ts:2
```

TypeScript 看到 `let count = 0`，就知道 `count` 是數字，之後放字串進去就報錯。這種「從程式碼自己看出型別」的能力叫**型別推論**（type inference）。

推論不只看得懂變數的初始值，函式的回傳值也行：

```ts
function addTax(price: number) {
  return price + price * 0.05;
}

const total = addTax(100);
console.log(total.toFixed(0));
```

這裡沒有寫回傳型別，但 TypeScript 從 `price + price * 0.05` 算出結果是數字，所以 `addTax` 回傳 `number`，`total` 也是 `number`。

### 那還要寫型別標註嗎

大部分的變數**不用寫**。下面兩行在 TypeScript 眼中完全一樣：

```ts
const a: number = 10;
const b = 10;

console.log(a, b);
```

寫了 `: number` 只是多打字。TypeScript 社群的習慣是：**看得出來的就交給推論，看不出來的才寫。**

什麼時候看不出來？最常見的就是上一集的**函式參數**。函式寫好的時候，TypeScript 不知道之後會有誰、傳什麼東西進來，所以參數一定要標。

| 位置 | 要不要寫 |
| --- | --- |
| 有初始值的變數 | 不用，交給推論 |
| 函式參數 | 一定要寫 |
| 函式回傳值 | 可寫可不寫，第 4 章再討論 |

之後還會遇到一些推論不夠用、需要你補型別的情況，例如一開始是空陣列的時候。碰到了再講。

### 推論出來的型別是什麼

想知道 TypeScript 推論出什麼型別，最快的方法是在 VS Code 裡把滑鼠游標移到變數上面，它會直接顯示。這是下一集的主題。

## 重點整理

- TypeScript 會從初始值和運算自己推論出型別，這叫型別推論。
- 推論出型別之後，一樣會檢查，放錯型別一樣會報錯。
- 有初始值的變數通常不用寫型別標註，函式參數一定要寫。
