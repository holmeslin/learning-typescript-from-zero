# 字面值型別

## 本集目標

用「某一個特定的值」當作型別，搭配聯集列出所有允許的值。

## 正文

### `"台北"` 也是一種型別

第 1 章第 8 集留了一個伏筆：在 VS Code 裡寫

```ts
let city = "台北";
const capital = "台北";

console.log(city, capital);
```

把游標移到 `city` 上，顯示的是 `let city: string`；移到 `capital` 上，卻顯示 `const capital: "台北"`。

`"台北"` 這個型別的意思是：**只能是 `"台北"` 這個字串，其他字串都不行**。這種「某個特定的值」本身當作型別的寫法，叫**字面值型別**（literal type）。

為什麼 `let` 和 `const` 推論出來的不一樣？

- `let city` 之後還可以改成 `"台中"`、`"高雄"`，所以 TypeScript 推論成比較寬的 `string`。
- `const capital` 永遠不會變，它就只會是 `"台北"`，所以 TypeScript 推論得更精確。

數字和布林值也有字面值型別，例如 `3`、`true`。其實 `boolean` 就是 `true | false` 的聯集。

### 搭配聯集：列出所有允許的值

只能放一個值的型別，單獨用沒什麼意思。字面值型別真正好用的地方，是和上一集的聯集搭配。建立 `literal.ts`：

```ts,fails
type Size = "小" | "中" | "大";

function orderTea(size: Size) {
  console.log(`點了一杯${size}杯紅茶`);
}

orderTea("中");
orderTea("特大");
```

`Size` 只允許三個字串：`"小"`、`"中"`、`"大"`。傳其他字串進去，就會被擋下：

```text
literal.ts:8:10 - error TS2345: Argument of type '"特大"' is not assignable to parameter of type 'Size'.

8 orderTea("特大");
           ~~~~


Found 1 error in literal.ts:8
```

如果參數只寫 `string`，打錯字、傳了店裡沒有的尺寸，都要等到執行時才會發現。用字面值型別，**所有合法的值一目瞭然**，VS Code 的自動完成也會直接列出這三個選項讓你挑。

這種「從固定幾個選項裡挑一個」的資料非常常見：訂單狀態、使用者角色、排序方向、顏色主題。其他語言常用 `enum` 來做這件事，而在這本書裡，字面值型別的聯集就是它的替代方案，第 8 章還會搭配 `as const` 讓它更好用。

### 常見的陷阱：`let` 變數

建立 `my-size.ts`：

```ts,fails
type Size = "小" | "中" | "大";

function orderTea(size: Size) {
  console.log(`點了一杯${size}杯紅茶`);
}

let mySize = "中";
orderTea(mySize);
```

```text
my-size.ts:8:10 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'Size'.

8 orderTea(mySize);
           ~~~~~~


Found 1 error in my-size.ts:8
```

`mySize` 明明是 `"中"`，為什麼不行？因為它是用 `let` 宣告的，型別被推論成寬的 `string`，之後可能被改成任何字串。有兩種改法：

```ts
type Size = "小" | "中" | "大";

function orderTea(size: Size) {
  console.log(`點了一杯${size}杯紅茶`);
}

const mySize = "中";
orderTea(mySize);

let yourSize: Size = "大";
orderTea(yourSize);
```

- 不會改的值，用 `const`，型別就是 `"中"`。
- 會改的值，自己標上 `: Size`，之後也只能改成這三個值之一。

## 重點整理

- 字面值型別是「只能是這個值」的型別，例如 `"台北"`、`3`、`true`。
- `const` 宣告的變數會推論成字面值型別，`let` 會推論成比較寬的型別。
- 字面值型別搭配聯集，可以列出所有允許的值，例如 `"小" | "中" | "大"`。
- 用 `let` 宣告又要放進字面值型別時，記得自己標上型別。
