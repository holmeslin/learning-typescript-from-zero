# 索引簽章與 `Record`

## 本集目標

替「屬性名稱事先不知道」的物件寫型別。

## 正文

### 屬性名稱不固定的物件

前面的物件型別，屬性名稱都是事先寫好的。但有些物件的用法比較像一張對照表，例如商品的庫存：商品名稱當屬性名稱，數量當值。商品會一直增加，你不可能事先把每個名稱都寫進型別。

建立 `stock.ts`：

```ts
type Stock = {
  [productName: string]: number;
};

const stock: Stock = {
  "鍵盤": 12,
  "滑鼠": 30,
};

stock["螢幕"] = 5;
console.log(stock);
```

```text
{ '鍵盤': 12, '滑鼠': 30, '螢幕': 5 }
```

`[productName: string]: number` 叫**索引簽章**（index signature），意思是「任何字串都可以當屬性名稱，值一定是數字」。中括號裡的 `productName` 只是取個名字讓人看懂，換成 `key` 或其他名稱都可以，不影響型別。

屬性名稱自由，但值的型別還是會檢查：

```ts,fails
type Stock = {
  [productName: string]: number;
};

const stock: Stock = { "鍵盤": 12 };
stock["滑鼠"] = "很多";
console.log(stock);
```

```text
stock.ts:6:1 - error TS2322: Type 'string' is not assignable to type 'number'.

6 stock["滑鼠"] = "很多";
  ~~~~~~~~~~~


Found 1 error in stock.ts:6
```

### 更常見的寫法：`Record`

同樣的型別，實際專案裡更常寫成 `Record<string, number>`：

```ts
const stock: Record<string, number> = {
  "鍵盤": 12,
  "滑鼠": 30,
};

for (const [name, count] of Object.entries(stock)) {
  console.log(`${name}：${count} 個`);
}
```

```text
鍵盤：12 個
滑鼠：30 個
```

`Record<string, number>` 讀作「屬性名稱是字串、值是數字的物件」，和上面的索引簽章意思一樣，只是比較短。

角括號 `< >` 是第 6 章泛型的語法，第 8 章還會再介紹 `Record` 的其他用法。現在先把 `Record<屬性名稱的型別, 值的型別>` 當成固定寫法照抄就好。

### 讀不存在的屬性

索引簽章有一個要注意的地方：

```ts
const stock: Record<string, number> = { "鍵盤": 12 };
const count = stock["耳機"];
console.log(count.toFixed(0));
```

`npx tsc` 不會報錯，因為型別說「任何名稱都對應到數字」，所以 TypeScript 認為 `count` 一定是數字。但 `"耳機"` 根本不存在，執行時 `count` 是 `undefined`，程式會當掉：

```text
TypeError: Cannot read properties of undefined (reading 'toFixed')
```

讀取這種物件時，要自己記得處理「可能沒有這個名稱」的情況，例如 `stock["耳機"] ?? 0`。第 9 章會介紹一個設定，讓 TypeScript 主動提醒你這件事。

### 什麼時候用

- 屬性名稱**事先知道**（`name`、`price`）：用一般的物件型別。
- 屬性名稱**事先不知道**，而且每個值的型別都一樣：用 `Record`。

## 重點整理

- `[key: string]: number` 是索引簽章，表示任何字串都能當屬性名稱，值必須是數字。
- `Record<string, number>` 是同一件事比較短的寫法，角括號的語法第 6 章會解釋。
- 讀取不存在的名稱會得到 `undefined`，但 TypeScript 預設不會提醒你，要自己處理。
- 屬性名稱事先知道就用一般的物件型別，不知道才用 `Record`。
