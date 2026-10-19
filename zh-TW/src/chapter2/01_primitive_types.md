# 字串、數字與布林值

## 本集目標

熟悉 `string`、`number`、`boolean` 三種型別，以及 TypeScript 會幫你抓出的幾種常見錯誤。

## 正文

### 三種最基本的型別

建立 `book.ts`：

```ts
const title: string = "TypeScript 入門";
const price: number = 450;
const discount: number = 0.85;
const inStock: boolean = price > 0;

console.log(`${title}：${price * discount} 元`);
console.log(inStock);
```

```text
TypeScript 入門：382.5 元
true
```

第 1 章學過，有初始值的變數其實不用寫型別，TypeScript 會自己推論。這裡寫出來，只是讓你看清楚每個值的型別。

| 型別 | 放什麼 | 例子 |
| --- | --- | --- |
| `string` | 字串 | `"小明"`、`'abc'`、`` `共 ${n} 個` `` |
| `number` | 數字，整數和小數都是 | `450`、`0.85`、`-3` |
| `boolean` | 布林值 | `true`、`false` |

注意幾件事：

- **`number` 不分整數和小數。** 有些語言把整數和小數分成不同的型別，JavaScript 和 TypeScript 沒有，全部都是 `number`。
- **全部小寫。** 你可能會在網路上看到大寫的 `String`、`Number`、`Boolean`，那是另一種東西，寫型別時一律用小寫。
- `NaN`（不是數字）的型別也是 `number`。例如 `Number("abc")` 會得到 `NaN`，但 TypeScript 只知道它是 `number`，不會警告你。

### 字串和數字分得很清楚

在 JavaScript 裡，`"3"` 和 `3` 常常會被自動轉來轉去。TypeScript 不會讓它們混在一起。建立 `mixup.ts`：

```ts,fails
const count: number = "3";
const ok: boolean = "true";
console.log(count, ok);
```

```text
mixup.ts:1:7 - error TS2322: Type 'string' is not assignable to type 'number'.

1 const count: number = "3";
        ~~~~~

mixup.ts:2:7 - error TS2322: Type 'string' is not assignable to type 'boolean'.

2 const ok: boolean = "true";
        ~~


Found 2 errors in the same file, starting at: mixup.ts:1
```

`"3"` 長得像數字、`"true"` 長得像布林值，但它們都是字串。想把字串轉成數字，要自己呼叫 `Number()`：

```ts
const text = "42";
const n: number = Number(text);
console.log(n + 1);
```

```text
43
```

### 不可能成立的比較

TypeScript 也會檢查比較。建立 `compare.ts`：

```ts,fails
const age = 20;

if (age === "20") {
  console.log("二十歲");
}
```

```text
compare.ts:3:5 - error TS2367: This comparison appears to be unintentional because the types 'number' and 'string' have no overlap.

3 if (age === "20") {
      ~~~~~~~~~~~~


Found 1 error in compare.ts:3
```

「這個比較看起來不是你的本意，因為 `number` 和 `string` 沒有交集。」數字永遠不會嚴格相等於字串，這個 `if` 永遠不會成立，JavaScript 不會提醒你，TypeScript 會。

### 用錯的運算

字串不能拿來做減法、乘法這類算術。建立 `math.ts`：

```ts,fails
const price = "100";
console.log(price * 2);
```

```text
math.ts:2:13 - error TS2362: The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.

2 console.log(price * 2);
              ~~~~~


Found 1 error in math.ts:2
```

「算術運算的左邊必須是數字」。錯誤訊息裡列的 `any`、`bigint`、`enum` 先不用管，重點是：字串不能直接拿來算。第 1 章綜合練習出現過的 TS2363 是同一類錯誤，只是說的是「右邊」。

## 重點整理

- `string`、`number`、`boolean` 對應 JavaScript 的字串、數字、布林值，一律小寫。
- `number` 包含整數和小數，`NaN` 也是 `number`。
- TypeScript 不會把 `"3"` 自動當成 `3`，要轉換就用 `Number()`。
- 永遠不會成立的比較（TS2367）、拿字串做算術（TS2362），TypeScript 都會抓出來。
