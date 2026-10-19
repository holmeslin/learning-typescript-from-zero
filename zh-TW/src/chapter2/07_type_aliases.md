# 型別別名

## 本集目標

用 `type` 幫型別取名字，讓重複出現的型別只寫一次。

## 正文

### 幫型別取名字

元組和 `string | null` 這種型別寫起來有點長，而且常常在好幾個地方重複出現。這時候可以用 `type` 幫它取個名字。建立 `alias.ts`：

```ts
type Score = number;
type Point = [number, number];
type Nickname = string | null;

const math: Score = 90;
const origin: Point = [0, 0];
let nickname: Nickname = null;
nickname = "小明";

console.log(math, origin, nickname);
```

```text
90 [ 0, 0 ] 小明
```

`type 名稱 = 型別;` 這種寫法叫**型別別名**（type alias）。之後寫 `Point` 就等於寫 `[number, number]`。

- 型別別名的名稱習慣用大寫開頭，例如 `Point`、`Nickname`，和變數名稱區分開來。
- `type` 只在型別檢查時存在。第 1 章講過型別會被拿掉，`type` 這一整行也會，執行時什麼都不剩。

### 用在函式參數上

型別別名最常用在函式參數，讓函式一眼就看得懂：

```ts
type Point = [number, number];

function distance(a: Point, b: Point): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
}

console.log(distance([0, 0], [3, 4]));
```

```text
5
```

`a: Point` 比 `a: [number, number]` 好讀，而且如果之後要改成三維座標，只要改 `type Point` 那一行。

檢查也照常進行。建立 `point.ts`：

```ts,fails
type Point = [number, number];

const p: Point = [1, "2"];
console.log(p);
```

```text
point.ts:3:22 - error TS2322: Type 'string' is not assignable to type 'number'.

3 const p: Point = [1, "2"];
                       ~~~


Found 1 error in point.ts:3
```

### 只是取名字，不是新的型別

型別別名**不會**產生新的型別，它只是個別名。`Score` 就是 `number`，兩者可以互相放：

```ts
type Score = number;

const math: Score = 90;
const total: number = math + 5;
console.log(total);
```

```text
95
```

所以 `type Score = number` 的用處只是讓程式碼讀起來更清楚：「這個數字代表分數」。TypeScript 不會阻止你把一般的數字當成 `Score` 用。

### 接下來

型別別名最大的用處，是幫**物件的型別**取名字。物件型別寫起來比元組長得多，下一章就會大量用到 `type`。

## 重點整理

- `type 名稱 = 型別;` 可以幫型別取名字，叫型別別名。
- 型別別名的名稱習慣用大寫開頭。
- 型別別名只是別名，`type Score = number` 的 `Score` 就是 `number`。
- 常重複出現、或是寫起來很長的型別，就幫它取個名字。
