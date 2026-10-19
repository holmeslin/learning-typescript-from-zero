# 函式型別

## 本集目標

用型別描述「一個函式長什麼樣子」，再拿它來檢查函式。

## 正文

在 JavaScript 裡，函式也是值，可以放進變數。既然是值，就有型別。函式的型別描述兩件事：**收什麼參數、回傳什麼**。

### 函式型別的寫法

建立 `calc.ts`：

```ts
type Calculator = (a: number, b: number) => number;

const add: Calculator = (a, b) => a + b;
const multiply: Calculator = (a, b) => a * b;

console.log(add(2, 3));
console.log(multiply(2, 3));
```

```text
5
6
```

`(a: number, b: number) => number` 讀作「收兩個數字、回傳數字的函式」。它長得很像箭頭函式，但箭頭後面接的是**回傳型別**，不是函式的內容。

用 `type` 幫它取名叫 `Calculator`，就可以拿來標註變數，跟標註 `string`、`number` 一樣。

### 參數不用再寫型別

注意 `(a, b) => a + b` 裡的 `a`、`b` 都沒有標型別，卻沒有出現第 1 章那個 TS7006 錯誤。因為 `add` 已經標了 `Calculator`，TypeScript 從這個型別就知道 `a`、`b` 是數字。這種「從使用的位置推論出型別」的能力，下一集講 callback 時會一直用到。

### 型別不合就報錯

函式型別一樣會被檢查。如果函式回傳了別的東西：

```ts,fails
type Calculator = (a: number, b: number) => number;

const join: Calculator = (a, b) => `${a}${b}`;

console.log(join(2, 3));
```

```text
calc.ts:3:36 - error TS2322: Type 'string' is not assignable to type 'number'.

3 const join: Calculator = (a, b) => `${a}${b}`;
                                     ~~~~~~~~~~

  calc.ts:1:19 - The expected type comes from the return type of this signature.
    1 type Calculator = (a: number, b: number) => number;
                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Found 1 error in calc.ts:3
```

樣板字面值算出來的是字串，但 `Calculator` 要的是回傳數字。補充說明告訴你，「預期回傳數字」這個要求來自第 1 行的型別。

### 參數名稱只是說明

函式型別裡的參數名稱 `a`、`b` 只是給人看的，不用和實際函式的參數同名。`const add: Calculator = (x, y) => x + y;` 也完全沒問題。但取個有意義的名字，VS Code 提示的時候比較好懂。

## 重點整理

- 函式型別的寫法是 `(參數: 型別) => 回傳型別`。
- 通常用 `type` 幫函式型別取名字，再拿來標註變數。
- 變數標了函式型別，函式的參數就不用再寫型別。
- 參數或回傳值不符合函式型別，一樣會報錯。
