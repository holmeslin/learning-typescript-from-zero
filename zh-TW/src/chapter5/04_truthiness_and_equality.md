# 真值縮小與相等縮小

## 本集目標

用 `if (x)` 和 `===` 排除 `null` 與 `undefined`，並避開 `0` 和空字串的陷阱。

## 正文

### 真值縮小

最簡單的排除 `null` 的方法，是直接把變數放進 `if`：

```ts
function greet(name: string | null) {
  if (name) {
    console.log(`你好，${name}`);
  } else {
    console.log("你好，陌生人");
  }
}

greet("小明");
greet(null);
greet("");
```

```text
你好，小明
你好，陌生人
你好，陌生人
```

`null` 放進 `if` 會被當成 `false`，所以在 `if (name)` 的大括號裡，`name` 一定不是 `null`，TypeScript 把它縮小成 `string`。這叫**真值縮小**（truthiness narrowing）。

JavaScript 裡會被當成 `false` 的值有這幾個：`false`、`0`、`""`（空字串）、`null`、`undefined`、`NaN`。其他的值都當成 `true`。

### 陷阱：`0` 和空字串也是「假」

注意上面最後一行：`greet("")` 也印出了「陌生人」。空字串被當成 `false`，跟 `null` 走了同一條路。打招呼的例子這樣剛好沒關係，但換成數字就會出事：

```ts
function showCount(count: number | null) {
  if (count) {
    console.log(`共 ${count} 件`);
  } else {
    console.log("沒有資料");
  }
}

showCount(3);
showCount(0);
showCount(null);
```

```text
共 3 件
沒有資料
沒有資料
```

`0` 件是一個正常的數字，卻被當成「沒有資料」。TypeScript 不會報錯，因為這段程式碼的型別完全正確，只是邏輯不是你想要的。

### 相等縮小

想排除的是 `null`，就直接跟 `null` 比：

```ts
function showCount(count: number | null) {
  if (count === null) {
    console.log("沒有資料");
  } else {
    console.log(`共 ${count} 件`);
  }
}

showCount(3);
showCount(0);
showCount(null);
```

```text
共 3 件
共 0 件
沒有資料
```

在 `count === null` 的大括號裡，`count` 是 `null`；在 `else` 裡，TypeScript 知道它不是 `null`，縮小成 `number`。這叫**相等縮小**（equality narrowing），用 `===`、`!==` 都可以。

### 同時排除 `null` 和 `undefined`

有時候一個值可能是 `null`，也可能是 `undefined`。這時可以用**兩個等號**的 `== null`，它同時會對 `null` 和 `undefined` 成立：

```ts
function showNote(note: string | null | undefined) {
  if (note == null) {
    console.log("沒有備註");
    return;
  }
  console.log(`備註：${note.trim()}`);
}

showNote("  記得帶傘  ");
showNote(null);
showNote(undefined);
```

```text
備註：記得帶傘
沒有備註
沒有備註
```

一般情況下請用 `===`，`== null` 是少數大家公認可以用兩個等號的例外。

### 該用哪一種

| 寫法 | 排除的東西 | 適合的情況 |
| --- | --- | --- |
| `if (x)` | `null`、`undefined`，還有 `0`、`""`、`false` | 物件、陣列這種不會是 `0` 或 `""` 的值 |
| `x !== null` | 只有 `null` | 數字、字串，`0` 和 `""` 是正常值的時候 |
| `x != null` | `null` 和 `undefined` | 兩種都可能出現的時候 |

## 重點整理

- 把變數放進 `if`，TypeScript 會排除 `null` 和 `undefined`，這叫真值縮小。
- `0`、`""`、`false` 也會被當成假，數字和字串用真值縮小時要小心。
- 用 `===`、`!==` 跟特定的值比較，也能縮小型別，這叫相等縮小。
- `x == null` 會同時對 `null` 和 `undefined` 成立。
