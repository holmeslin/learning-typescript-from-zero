# 工具型別（二）：`Record` 與聯集的篩選

## 本集目標

用 `Record` 搭配聯集寫出「每個選項都要有值」的對照表，並用 `Exclude`、`Extract`、`NonNullable` 篩選聯集。

## 正文

### `Record` 的另一種用法

第 3 章把 `Record<string, number>` 當成固定寫法：屬性名稱是任何字串、值是數字。`Record` 的第一個型別參數不一定要是 `string`，也可以是**字面值的聯集**。建立 `prices.ts`：

```ts,fails
type Size = "小" | "中" | "大";

const prices: Record<Size, number> = {
  "小": 30,
  "中": 40,
};
console.log(prices);
```

`Record<Size, number>` 的意思是：「`"小"`、`"中"`、`"大"` 三個屬性都必須有，值是數字」。少了一個就會報錯：

```text
prices.ts:3:7 - error TS2741: Property '大' is missing in type '{ 小: number; 中: number; }' but required in type 'Record<Size, number>'.

3 const prices: Record<Size, number> = {
        ~~~~~~


Found 1 error in prices.ts:3
```

這很適合寫「每個選項對應一個值」的對照表。哪天 `Size` 多了 `"特大"`，所有用 `Record<Size, ...>` 寫的對照表都會報錯，提醒你補上，一個都不會漏。

| 寫法 | 意思 |
| --- | --- |
| `Record<string, number>` | 屬性名稱隨便，有幾個都可以 |
| `Record<Size, number>` | 剛好是 `Size` 裡的每一個，一個都不能少 |

### `Exclude`：從聯集拿掉幾個

`Exclude<聯集, 要拿掉的>` 會從聯集裡拿掉某些成員。建立 `exclude.ts`：

```ts,fails
type Status = "pending" | "shipped" | "cancelled";

const status: Exclude<Status, "cancelled"> = "cancelled";
console.log(status);
```

```text
exclude.ts:3:7 - error TS2322: Type '"cancelled"' is not assignable to type '"pending" | "shipped"'.

3 const status: Exclude<Status, "cancelled"> = "cancelled";
        ~~~~~~


Found 1 error in exclude.ts:3
```

錯誤訊息直接告訴你算出來的結果：`"pending" | "shipped"`。

`Exclude` 是給聯集用的，上一集的 `Omit` 是給物件用的，不要搞混：

- `Omit<User, "password">`：從**物件**拿掉屬性。
- `Exclude<Status, "cancelled">`：從**聯集**拿掉成員。

### `Extract`：從聯集留下幾個

`Extract<聯集, 要留下的>` 和 `Exclude` 相反，只留下符合的成員。`NonNullable<T>` 則是拿掉聯集裡的 `null` 和 `undefined`。建立 `extract.ts`：

```ts,fails
type Status = "pending" | "shipped" | "cancelled";

const a: Extract<Status, "pending" | "refunded"> = "shipped";
const b: NonNullable<string | null | undefined> = null;
console.log(a, b);
```

```text
extract.ts:3:7 - error TS2322: Type '"shipped"' is not assignable to type '"pending"'.

3 const a: Extract<Status, "pending" | "refunded"> = "shipped";
        ~

extract.ts:4:7 - error TS2322: Type 'null' is not assignable to type 'string'.

4 const b: NonNullable<string | null | undefined> = null;
        ~


Found 2 errors in the same file, starting at: extract.ts:3
```

- `Extract<Status, "pending" | "refunded">` 是 `"pending"`：兩邊都有的只有 `"pending"`，`"refunded"` 不在 `Status` 裡，所以不會出現。
- `NonNullable<string | null | undefined>` 是 `string`。

`NonNullable` 常用在別人給你的型別上。例如某個型別是 `string | null`，但你已經確定值不是 `null` 了，就可以用 `NonNullable` 寫出「確定有值」的版本。

## 重點整理

- `Record<聯集, 值的型別>` 要求聯集裡的每一個成員都要有屬性，一個都不能少。
- `Exclude<聯集, 成員>` 從聯集拿掉成員，`Extract<聯集, 成員>` 只留下符合的成員。
- `NonNullable<T>` 拿掉聯集裡的 `null` 和 `undefined`。
- `Omit` 是給物件拿掉屬性，`Exclude` 是給聯集拿掉成員。
