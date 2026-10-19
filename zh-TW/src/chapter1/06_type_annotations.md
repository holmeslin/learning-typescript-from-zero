# 型別標註

## 本集目標

用 `: 型別` 說明變數、參數與回傳值的型別。

## 正文

在名稱後面加上冒號和型別，叫做**型別標註**（type annotation）。你已經看過好幾次了：

```ts
const name: string = "小明";
const age: number = 20;
const isMember: boolean = true;

console.log(name, age, isMember);
```

`string`、`number`、`boolean` 就是 JavaScript 的字串、數字、布林值。注意**全部是小寫**。

標了型別，就只能放那種型別的值。建立 `annotation.ts`：

```ts,fails
let age: number = 20;
age = "二十";
console.log(age);
```

```text
annotation.ts:2:1 - error TS2322: Type 'string' is not assignable to type 'number'.

2 age = "二十";
  ~~~


Found 1 error in annotation.ts:2
```

`age` 說好是數字，之後就不能放字串進去。

### 函式的參數

型別標註最重要的位置是函式的**參數**：

```ts
function greet(name: string, times: number) {
  for (let i = 0; i < times; i++) {
    console.log(`你好，${name}`);
  }
}

greet("小華", 2);
```

每個參數各自標型別，用逗號隔開。箭頭函式也一樣：

```ts
const square = (n: number) => n * n;
console.log(square(4));
```

### 參數不標型別會怎樣

建立 `param.ts`，把型別拿掉：

```ts,fails
function greet(name) {
  return `你好，${name}`;
}

console.log(greet("小華"));
```

```text
param.ts:1:16 - error TS7006: Parameter 'name' implicitly has an 'any' type.

1 function greet(name) {
                 ~~~~


Found 1 error in param.ts:1
```

「參數 `name` 被暗中當成 `any` 型別」。`any` 是「什麼都可以」的意思，等於對這個參數關掉檢查。TypeScript 不知道別人會傳什麼進來，又不想默默放水，所以要你說清楚。這個錯誤是 `"strict": true` 打開的，第 2 章會再講 `any`。

**結論：函式的參數一定要標型別。**

### 回傳值

函式回傳的型別，寫在參數的小括號後面：

```ts
function addTax(price: number): number {
  return price + price * 0.05;
}

console.log(addTax(100));
```

`): number` 說明這個函式會回傳數字。如果函式裡面不小心回傳了別的型別，TypeScript 會報錯。

回傳型別不寫也可以，TypeScript 會自己算出來，這就是下一集的主題。要不要寫，第 4 章會再討論。

## 重點整理

- 型別標註的寫法是 `名稱: 型別`。
- 最基本的三種型別是 `string`、`number`、`boolean`，全部小寫。
- 函式的參數一定要標型別，不標會出現 TS7006 錯誤。
- 回傳型別寫在參數的小括號後面，例如 `): number`。
