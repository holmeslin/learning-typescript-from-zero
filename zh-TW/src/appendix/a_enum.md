# 看得懂 `enum`

## 本集目標

看懂別人程式碼裡的 `enum`，知道它和 `as const` 物件的差別。

## 正文

第 1 章說過，`enum` 是 Node.js 不能直接執行的語法，`tsconfig.json` 裡的 `erasableSyntaxOnly` 也會擋下它。但很多既有的專案在用，你一定會在別人的程式碼裡看到。

> 這一集的範例需要關掉 `erasableSyntaxOnly`、用 `tsc` 產生 JavaScript 才跑得起來，在 `ts-practice` 裡照著打會被擋下來。看懂就好，不用自己跑。

### 數字列舉

```ts,ignore
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

const move = Direction.Left;
console.log(move);
console.log(Direction[move]);
```

```text
2
Left
```

`enum`（列舉，enumeration）是「一組有名字的常數」。沒有指定值的時候，TypeScript 從 `0` 開始依序編號：`Up` 是 `0`、`Down` 是 `1`、`Left` 是 `2`。所以 `Direction.Left` 印出 `2`。

第三行的 `Direction[move]` 是反過來查：用數字 `2` 查回名字 `"Left"`。這叫「反向對應」，只有數字列舉才有。

`Direction` 同時也是一個型別，可以拿來標註參數：`function go(direction: Direction)`。

### 字串列舉

實務上更常見的是每個成員都指定字串：

```ts,ignore
enum Status {
  Active = "active",
  Inactive = "inactive",
}

function describe(status: Status) {
  return status === Status.Active ? "使用中" : "已停用";
}

console.log(describe(Status.Active));
console.log(Status.Inactive);
```

```text
使用中
inactive
```

字串列舉有一個和你學過的聯集型別很不一樣的地方：**不能直接傳字串**。

```ts,ignore
console.log(describe("inactive"));
```

```text
status.ts:10:22 - error TS2345: Argument of type '"inactive"' is not assignable to parameter of type 'Status'.

10 console.log(describe("inactive"));
                        ~~~~~~~~~~


Found 1 error in status.ts:10
```

值明明一樣是 `"inactive"`，TypeScript 還是不接受，一定要寫 `Status.Inactive`。

### 它為什麼不能直接執行

把 `Direction` 交給 `tsc` 轉成 JavaScript，會得到這樣的程式碼：

```js
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
```

`enum` 不是「拿掉就好」的型別，它會**產生**一個真的物件，裡面同時放了「名字 → 數字」和「數字 → 名字」兩組對應。Node.js 只會把型別換成空白，不會幫你產生這段程式碼，所以直接執行會出錯；`npx tsc` 也會提早擋下來：

```ts,fails
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

console.log(Direction.Left);
```

```text
direction.ts:1:6 - error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.

1 enum Direction {
       ~~~~~~~~~


Found 1 error in direction.ts:1
```

你還可能看到 `const enum`。它是 `enum` 的變形，在某些設定下，`tsc` 會把用到它的地方直接換成值（例如 `Size.Small` 換成 `"S"`），不產生物件。對你來說只要知道：它也是列舉，Node.js 一樣不能直接執行。

### 換成 `as const` 物件

第 8 章學過的 `as const` 物件，可以做到和字串列舉幾乎一樣的事：

```ts
const Status = {
  Active: "active",
  Inactive: "inactive",
} as const;

type Status = (typeof Status)[keyof typeof Status];

function describe(status: Status) {
  return status === Status.Active ? "使用中" : "已停用";
}

console.log(describe(Status.Active));
console.log(describe("inactive"));
```

```text
使用中
已停用
```

- `Status.Active` 的寫法和列舉一模一樣。
- `Status` 型別是 `"active" | "inactive"`，是普通的字面值聯集，所以直接傳 `"inactive"` 也可以。
- 它只是普通的 JavaScript 物件加上型別，Node.js 可以直接執行。

讀舊程式碼時，看到 `enum Xxx { A = "a" }`，腦中把它換成上面這種 `as const` 物件就行了；看到沒有指定值的數字列舉，記得它的成員是從 `0` 開始的數字。

## 重點整理

- `enum` 是一組有名字的常數；數字列舉從 `0` 開始編號，可以用數字反查名字。
- 字串列舉的參數只能傳 `Status.Inactive`，不能直接傳字串。
- `enum` 會產生真的物件，不是「拿掉就好」的語法，所以 Node.js 不能直接執行。
- 新程式碼用 `as const` 物件搭配字面值聯集取代 `enum`。
