# `never` 與窮舉檢查

## 本集目標

認識代表「不可能」的 `never` 型別，用它確保聯集裡的每一種都有處理到。

## 正文

### 新增一種形狀，忘了處理

上一集的形狀加上三角形。`describe` 只印出說明，沒有回傳值：

```ts
type Circle = { kind: "circle"; radius: number };
type Rectangle = { kind: "rectangle"; width: number; height: number };
type Triangle = { kind: "triangle"; base: number; height: number };
type Shape = Circle | Rectangle | Triangle;

function describe(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      console.log(`圓形，半徑 ${shape.radius}`);
      break;
    case "rectangle":
      console.log(`長方形，${shape.width} × ${shape.height}`);
      break;
  }
}

describe({ kind: "circle", radius: 2 });
describe({ kind: "triangle", base: 3, height: 4 });
```

```text
圓形，半徑 2
```

`Triangle` 加進了 `Shape`，但 `switch` 裡忘了加 `case "triangle"`。結果三角形什麼都沒印，`npx tsc` 也沒有報錯。專案裡用到 `Shape` 的地方可能有十幾個，新增一種形狀時，很難記得每一個都改到。

### `never`：不可能有值的型別

在說解法之前，先認識一個特別的型別：`never`。它代表「**不可能**」，任何值都不能放進 `never` 型別的變數。

什麼時候會出現 `never`？當型別縮小到什麼都不剩的時候。`switch` 每處理一個 `case`，剩下的型別就少一種：

- 一開始 `shape` 是 `Circle | Rectangle | Triangle`。
- 處理完 `"circle"` 和 `"rectangle"`，剩下 `Triangle`。
- 如果連 `"triangle"` 都處理了，就什麼都不剩，型別變成 `never`。

### 窮舉檢查

利用這一點，在 `switch` 最後加一個 `default`，把 `shape` 放進一個 `never` 型別的變數。建立 `never.ts`：

```ts,fails
type Circle = { kind: "circle"; radius: number };
type Rectangle = { kind: "rectangle"; width: number; height: number };
type Triangle = { kind: "triangle"; base: number; height: number };
type Shape = Circle | Rectangle | Triangle;

function describe(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      console.log(`圓形，半徑 ${shape.radius}`);
      break;
    case "rectangle":
      console.log(`長方形，${shape.width} × ${shape.height}`);
      break;
    default: {
      const unhandled: never = shape;
      console.log("沒有處理到的形狀", unhandled);
    }
  }
}

describe({ kind: "triangle", base: 3, height: 4 });
```

```text
never.ts:15:13 - error TS2322: Type 'Triangle' is not assignable to type 'never'.

15       const unhandled: never = shape;
               ~~~~~~~~~


Found 1 error in never.ts:15
```

錯誤訊息直接告訴你漏了誰：「`Triangle` 不能放進 `never`」，也就是 `Triangle` 還沒處理。

補上 `case "triangle"` 之後，走到 `default` 的 `shape` 就是 `never`，放進 `never` 型別的變數沒問題，錯誤消失。之後不管誰在 `Shape` 加了新的形狀，這裡都會立刻報錯提醒。這種寫法叫**窮舉檢查**（exhaustiveness check），「窮舉」就是「全部列出來」的意思。

`default` 後面的大括號是必要的：在 `case` 裡宣告 `const` 變數時，用大括號包起來，變數就只屬於這個 `case`，不會跟其他 `case` 衝突。

### 有寫回傳型別的話

如果函式每個 `case` 都會 `return`，而且有標回傳型別，TypeScript 會用另一種方式提醒你。把上一集的 `area` 加上 `: number`，再加入三角形但不處理，`npx tsc` 會報出 TS2366：「函式沒有在最後 `return`，但回傳型別裡不包含 `undefined`」。

不過這只對「有回傳值」的函式有效。像 `describe` 這種只印東西的函式，還是要靠 `never` 的窮舉檢查。

## 重點整理

- `never` 是「不可能」的型別，任何值都不能放進去。
- 型別縮小到什麼都不剩時，就會變成 `never`。
- 在 `switch` 的 `default` 裡把值放進 `never` 型別的變數，漏掉的情況就會變成型別錯誤。
- 聯集新增一種型別時，窮舉檢查會幫你找出每個沒處理到的地方。
