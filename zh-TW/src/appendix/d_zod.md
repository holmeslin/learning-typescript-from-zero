# 用 Zod 做執行期驗證

## 本集目標

用 Zod 描述資料的形狀，一次得到驗證函式和型別。

## 正文

第 10 章處理從外面讀進來的資料時，你手寫了驗證函式：一個一個屬性檢查 `typeof`，全部通過才當成正確的型別。這很踏實，但資料一複雜，驗證函式就會又長又容易漏；而且型別和驗證是分開寫的兩份東西，改了一邊很容易忘了改另一邊。

**Zod** 是一個專門做這件事的套件：你用它描述資料「應該長什麼樣子」，它幫你產生驗證，**同時**推出對應的 TypeScript 型別。這本書寫作時的版本是 Zod 4。

### 安裝

在 `ts-practice` 裡執行：

```bash
npm install zod
```

注意這次沒有 `-D`：驗證是程式執行時要做的事，Zod 是程式本身需要的套件，不是只在開發時用的工具。

> 這一集的範例需要先安裝 Zod，本書的自動檢查環境沒有裝，所以下面的區塊都沒有經過自動檢查，但都在 Zod 4 實際跑過。

### 第一個結構描述

建立 `zod-user.ts`：

```ts,ignore
import { z } from "zod";

const User = z.object({
  name: z.string(),
  age: z.number(),
});

type User = z.infer<typeof User>;

function parseUser(json: string): User | undefined {
  const result = User.safeParse(JSON.parse(json));
  if (result.success) {
    return result.data;
  }
  console.log(z.prettifyError(result.error));
  return undefined;
}

const ok = parseUser('{ "name": "小明", "age": 20 }');
console.log(ok);

const bad = parseUser('{ "name": "小華", "age": "二十" }');
console.log(bad);
```

```text
{ name: '小明', age: 20 }
✖ Invalid input: expected number, received string
  → at age
undefined
```

一段一段看：

- `z.object({ name: z.string(), age: z.number() })` 描述「有字串 `name` 和數字 `age` 的物件」。這種描述叫**結構描述**（schema）。它是一個真的 JavaScript 值，執行時還在，所以能拿來檢查資料，這正是型別做不到的事。
- `z.infer<typeof User>` 從結構描述推出型別，結果就是 `{ name: string; age: number }`。`typeof` 和角括號都是你學過的東西：先用 `typeof` 拿到 `User` 這個值的型別，再交給 `z.infer` 轉換。
- 值和型別都叫 `User` 是常見的慣例，TypeScript 分得清楚哪個是值、哪個是型別。
- `safeParse` 接收 `unknown` 的資料，回傳一個可辨識聯集：`success` 是 `true` 時有 `data`，是 `false` 時有 `error`。跟第 5 章的寫法一樣，用 `if (result.success)` 縮小之後，`result.data` 就是 `User` 型別。
- `z.prettifyError` 把錯誤整理成好讀的文字。第二筆資料的 `age` 是字串，Zod 告訴你錯在哪個屬性、預期是什麼。

### 更多規則

Zod 不只能檢查型別，還能加上值的規則：

```ts,ignore
import { z } from "zod";

const Product = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  tags: z.array(z.string()),
  note: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

type Product = z.infer<typeof Product>;

const result = Product.safeParse({
  id: 1,
  name: "",
  price: -5,
  tags: ["文具"],
  status: "deleted",
});

if (!result.success) {
  for (const issue of result.error.issues) {
    console.log(issue.path.join("."), issue.message);
  }
}
```

```text
name Too small: expected string to have >=1 characters
price Too small: expected number to be >=0
status Invalid option: expected one of "draft"|"published"
```

| 寫法 | 意思 |
| --- | --- |
| `z.number().int().positive()` | 正整數 |
| `z.string().min(1)` | 至少一個字的字串 |
| `z.array(z.string())` | 字串陣列 |
| `.optional()` | 可選屬性 |
| `z.enum([...])` | 只能是其中一個字串 |

`z.enum` 只是名字裡有 enum，跟上一集的 `enum` 語法無關，它推出來的是字面值聯集。這段的 `Product` 型別推出來是：

```text
{ id: number; name: string; price: number; tags: string[]; note?: string | undefined; status: "draft" | "published"; }
```

`int()`、`min(1)` 這類規則只在執行時檢查，型別裡看不出來，因為 TypeScript 的型別沒辦法表達「正整數」這種事。

`issues` 是所有問題的陣列，每個問題有 `path`（出錯的位置）和 `message`（說明）。Zod 會一次檢查完全部的屬性，不會碰到第一個錯就停。

### `parse`：不合格就丟出錯誤

除了 `safeParse`，還有 `parse`。資料合格時直接回傳資料，不合格就丟出 `ZodError`：

```ts,ignore
import { z } from "zod";

const Settings = z.object({ theme: z.string() });

try {
  const settings = Settings.parse({ theme: 42 });
  console.log(settings.theme);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.log("設定格式錯誤：", error.issues.length, "個問題");
  }
}
```

```text
設定格式錯誤： 1 個問題
```

`catch` 拿到的 `error` 是 `unknown`，用第 5 章的 `instanceof` 縮小成 `ZodError` 再使用。要在原地處理錯誤時用 `safeParse`，希望錯誤往上丟、由外層統一處理時用 `parse`。

### 什麼時候用 Zod

小程式、只有一兩種資料要檢查時，第 10 章的手寫驗證就夠了，也比較容易看懂到底檢查了什麼。資料種類多、結構複雜，或是同一份資料的型別和驗證要長期一起維護時，就值得換成 Zod。

## 重點整理

- Zod 用結構描述說明資料的形狀，同時提供執行時的驗證和 TypeScript 型別。
- `z.infer<typeof Schema>` 從結構描述推出型別，不用另外手寫。
- `safeParse` 回傳可辨識聯集，用 `success` 縮小；`parse` 不合格時丟出 `ZodError`。
- `min`、`int` 這類規則只在執行時檢查，型別裡看不出來。
