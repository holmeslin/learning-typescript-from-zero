# 樣板字面值型別入門

## 本集目標

看得懂用反引號寫的型別，知道它怎麼從聯集組出新的字串型別。

## 正文

這是「入門就好」的最後一集。

### 用樣板字面值組出型別

JavaScript 的樣板字面值，例如 `` `margin-${side}` ``，可以把變數組進字串裡。型別也有一樣的寫法，只是 `${}` 裡面放的是型別。建立 `margin.ts`：

```ts,fails
type Side = "top" | "bottom";
type MarginName = `margin-${Side}`;

const a: MarginName = "margin-top";
const b: `margin-${Side}` = "margin-left";
console.log(a, b);
```

`` `margin-${Side}` `` 會對 `Side` 裡的每一個成員組出一個字串，結果是 `"margin-top" | "margin-bottom"`。這叫**樣板字面值型別**（template literal type）。

```text
margin.ts:5:7 - error TS2322: Type '"margin-left"' is not assignable to type '"margin-bottom" | "margin-top"'.

5 const b: `margin-${Side}` = "margin-left";
        ~


Found 1 error in margin.ts:5
```

### 兩個聯集組在一起

`${}` 有兩個聯集時，會組出所有的組合：

```ts
type Temperature = "冰" | "熱";
type Drink = "紅茶" | "綠茶";

type Order = `${Temperature}${Drink}`;

const order: Order = "熱綠茶";
console.log(order);
```

`Order` 是 `"冰紅茶" | "冰綠茶" | "熱紅茶" | "熱綠茶"`，兩種溫度乘上兩種飲料，共四種。

### 搭配內建的大小寫工具

TypeScript 內建了幾個處理英文大小寫的工具型別：`Uppercase`、`Lowercase`、`Capitalize`（第一個字母大寫）、`Uncapitalize`。最常和樣板字面值型別一起出現。建立 `handler.ts`：

```ts,fails
type EventName = "click" | "focus";

const h: `on${Capitalize<EventName>}` = "onclick";
console.log(h);
```

```text
handler.ts:3:7 - error TS2820: Type '"onclick"' is not assignable to type '"onClick" | "onFocus"'. Did you mean '"onClick"'?

3 const h: `on${Capitalize<EventName>}` = "onclick";
        ~


Found 1 error in handler.ts:3
```

`` `on${Capitalize<EventName>}` `` 組出 `"onClick" | "onFocus"`，連大小寫都會檢查，錯誤訊息還猜到你想打 `"onClick"`。

### 在哪裡會看到

你在函式庫的型別裡會看到這種寫法，用來描述「有固定格式的字串」：事件名稱、CSS 屬性、網址路徑。你自己寫程式時，大部分情況用第 5 章的字面值聯集就夠了；看到反引號出現在型別的位置，知道它是在組字串型別就好。

## 重點整理

- 樣板字面值型別用反引號寫在型別的位置，`${}` 裡面放型別。
- `${}` 裡放聯集，會對每一個成員組出一個字串；兩個聯集會組出所有的組合。
- `Capitalize`、`Uppercase` 等內建工具型別可以處理英文大小寫。
- 樣板字面值型別是入門就好：看得懂函式庫的定義就夠了。
