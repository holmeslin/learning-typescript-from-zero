# Vitest 簡介

## 本集目標

用 Vitest 幫函式寫測試，並用 `expectTypeOf` 檢查函式的型別。

## 正文

TypeScript 保證型別對得上，但不保證算出來的值是對的。`addTax` 把 `* 1.05` 寫成 `* 1.5`，型別一樣是 `number`，`tsc` 不會報錯。抓這種錯誤要靠**測試**：寫一段程式碼，呼叫你的函式，檢查結果是不是你預期的值。

**Vitest** 是現在最常用的測試工具之一，可以直接讀 `.ts` 檔，不用另外設定。

### 安裝

在 `ts-practice` 裡執行：

```bash
npm install -D vitest
```

測試只在開發時用到，所以加 `-D`。這本書寫作時的版本是 Vitest 5。

> 這一集的範例需要先安裝 Vitest，本書的自動檢查環境沒有裝，所以下面的區塊都沒有經過自動檢查，但都實際跑過。

### 要測試的函式

建立 `price.ts`：

```ts
export function addTax(price: number): number {
  return Math.round(price * 1.05);
}

export function parsePrice(text: string): number | null {
  const value = Number(text);
  return Number.isNaN(value) ? null : value;
}
```

### 第一個測試檔

測試檔的檔名習慣是「原本的檔名 + `.test.ts`」。建立 `price.test.ts`：

```ts,ignore
import { describe, expect, expectTypeOf, test } from "vitest";
import { addTax, parsePrice } from "./price.ts";

describe("addTax", () => {
  test("加上 5% 的稅並四捨五入", () => {
    expect(addTax(100)).toBe(105);
    expect(addTax(99)).toBe(104);
  });
});

describe("parsePrice", () => {
  test("看得懂數字就回傳數字", () => {
    expect(parsePrice("120")).toBe(120);
  });

  test("看不懂就回傳 null", () => {
    expect(parsePrice("一百")).toBeNull();
  });

  test("回傳型別是 number | null", () => {
    expectTypeOf(parsePrice).returns.toEqualTypeOf<number | null>();
    expectTypeOf(parsePrice).parameter(0).toBeString();
  });
});
```

- `test("說明", () => { ... })`：一個測試。說明寫這個測試在確認什麼。
- `describe("名稱", () => { ... })`：把相關的測試分成一組。
- `expect(實際的值).toBe(預期的值)`：檢查兩者相等，不相等這個測試就失敗。`toBeNull()` 是檢查值是不是 `null`。

執行：

```bash
npx vitest run --reporter=verbose
```

```text
 RUN  v5.0.5 …/ts-practice

 ✓ price.test.ts > addTax > 加上 5% 的稅並四捨五入 1ms
 ✓ price.test.ts > parsePrice > 看得懂數字就回傳數字 0ms
 ✓ price.test.ts > parsePrice > 看不懂就回傳 null 0ms
 ✓ price.test.ts > parsePrice > 回傳型別是 number | null 0ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  16:36:40
   Duration  68ms (import 45%, transform 25%, tests 15%, worker 15%, environment 1%)
```

第一行的路徑會是你自己的資料夾，時間每次也都不一樣。四個測試都打勾，代表全部通過。`--reporter=verbose` 讓它把每個測試的名稱都列出來；不加的話只會印出總數。

試著把 `addTax` 裡的 `1.05` 改成 `1.5`，再跑一次，就會看到 `FAIL` 和 `expected 150 to be 105` 這樣的說明：實際算出 150，但預期是 105。

### `expectTypeOf`：測試型別

最後一個測試不一樣，它檢查的是**型別**，不是值：

- `expectTypeOf(parsePrice).returns.toEqualTypeOf<number | null>()`：`parsePrice` 的回傳型別必須剛好是 `number | null`。
- `expectTypeOf(parsePrice).parameter(0).toBeString()`：第一個參數必須是字串。

這在你寫給別人用的函式時很有用：如果哪天有人改了程式碼，讓回傳型別不小心變成 `number`，這個測試就會抓到。

但要注意一件事：**`vitest run` 不會檢查型別。** 把上面的 `<number | null>` 改成 `<number>`，`npx vitest run` 照樣顯示全部通過，因為型別在執行時已經不存在了（還記得第 1 章嗎）。型別測試要靠 `npx tsc` 來抓：

```text
price.test.ts:21:52 - error TS2344: Type 'number' does not satisfy the constraint '"Expected: number, Actual: null"'.

21     expectTypeOf(parsePrice).returns.toEqualTypeOf<number>();
                                                      ~~~~~~


Found 1 error in price.test.ts:21
```

錯誤訊息的寫法有點繞，重點在引號裡那段 `"Expected: number, Actual: null"`：你說應該是 `number`，但實際上還有 `null`。

所以有寫型別測試的話，兩個指令都要跑：`npx vitest run` 測值，`npx tsc` 測型別。

### 接下來

這一集只是入門。Vitest 還能模擬函式、測試非同步的程式碼、在瀏覽器環境裡測試網頁元素。想深入的話，[《從零開始學 React》第 11 章](https://holmeslin.github.io/learning-react-from-zero/zh-TW/chapter11/index.html)有更完整的介紹，或是直接看 [Vitest 官方文件](https://vitest.dev/)。

## 重點整理

- 型別對了不代表值對了，值要靠測試來確認。
- 測試檔取名 `xxx.test.ts`，用 `test` 寫測試、`expect(...).toBe(...)` 檢查結果，用 `npx vitest run` 執行。
- `expectTypeOf` 可以檢查函式的參數和回傳型別。
- `vitest run` 不檢查型別，型別測試要用 `npx tsc` 來抓。
