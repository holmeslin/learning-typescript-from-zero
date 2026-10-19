# `readonly`

## 本集目標

用 `readonly` 標出建立之後就不該再修改的屬性和陣列。

## 正文

### 唯讀屬性

訂單的編號建立之後就不應該再改，但狀態可以從「處理中」變成「已出貨」。建立 `order.ts`：

```ts,fails
type Order = {
  readonly id: number;
  status: string;
};

const order: Order = { id: 1001, status: "處理中" };
order.status = "已出貨";
order.id = 2002;

console.log(order);
```

```text
order.ts:8:7 - error TS2540: Cannot assign to 'id' because it is a read-only property.

8 order.id = 2002;
        ~~


Found 1 error in order.ts:8
```

屬性名稱前面加 `readonly`，這個屬性就只能在建立物件時給值，之後不能再指定新的值。`status` 沒有加，所以可以改。

注意：`readonly` 和 `const` 管的是不同的東西。`const` 是「這個變數不能換成別的物件」，`readonly` 是「這個物件的這個屬性不能改」。上面的 `order` 用 `const` 宣告，`order.status` 還是可以改。

### 唯讀陣列

陣列也可以是唯讀的，在型別前面加 `readonly`。把 `order.ts` 的內容換成：

```ts,fails
const scores: readonly number[] = [90, 85, 77];
scores.push(100);
console.log(scores);
```

```text
order.ts:2:8 - error TS2339: Property 'push' does not exist on type 'readonly number[]'.

2 scores.push(100);
         ~~~~


Found 1 error in order.ts:2
```

`readonly number[]` 沒有 `push`、`pop`、`sort` 這些會改到陣列本身的方法。`map`、`filter` 會產生新陣列、不改原本的陣列，所以還是可以用。

### `readonly` 只管一層

```ts
type Order = {
  readonly id: number;
  readonly items: string[];
};

const order: Order = { id: 1001, items: ["筆記本"] };
order.items.push("原子筆");
console.log(order.items);
```

```text
[ '筆記本', '原子筆' ]
```

這段沒有任何錯誤。`readonly items` 的意思是「`items` 不能換成另一個陣列」，但陣列**裡面**的內容沒有被保護。想要連內容都不能改，就要寫成 `readonly items: readonly string[]`。

### 執行時不會擋

最後提醒一次：`readonly` 也是型別，執行時會被拿掉。上面第一個範例用 Node.js 執行，`order.id` 照樣會被改成 `2002`。它保護你的方式，是讓 `npx tsc` 和 VS Code 在你寫錯的時候提醒你。

## 重點整理

- 屬性前面加 `readonly`，建立之後就不能再指定新的值。
- `readonly number[]` 是唯讀陣列，不能用 `push` 這類會改到陣列本身的方法。
- `readonly` 只保護一層，屬性裡的陣列或物件要另外加。
- `readonly` 只在型別檢查時有效，執行時不會擋。
