# 看懂錯誤訊息

## 本集目標

拆解 `tsc` 的錯誤訊息，認得最常見的幾種。

## 正文

學 TypeScript，有一半的時間是在看錯誤訊息。錯誤訊息是英文的，但它的格式很固定，看懂幾種常見的句型就夠用了。

### 一則錯誤訊息的結構

建立 `typo.ts`，這裡故意放了兩個錯誤：

```ts,fails
const price: number = "100";
console.log(prise);
```

```bash
npx tsc
```

```text
typo.ts:1:7 - error TS2322: Type 'string' is not assignable to type 'number'.

1 const price: number = "100";
        ~~~~~

typo.ts:2:13 - error TS2552: Cannot find name 'prise'. Did you mean 'price'?

2 console.log(prise);
              ~~~~~

  typo.ts:1:7 - 'price' is declared here.
    1 const price: number = "100";
            ~~~~~


Found 2 errors in the same file, starting at: typo.ts:1
```

拆開來看第一則：

| 部分 | 意思 |
| --- | --- |
| `typo.ts:1:7` | 檔名、第 1 行、第 7 個字 |
| `error TS2322` | 錯誤代碼。每一種錯誤都有固定的編號 |
| `Type 'string' is not assignable to type 'number'.` | 錯誤說明 |
| `1 const price ...` 和 `~~~~~` | 把出錯的那一行印出來，用 `~` 標出位置 |

最後一行 `Found 2 errors` 是錯誤的總數。

第二則多了一段縮排的 `'price' is declared here.`，這是補充說明：「你可能想打的 `price`，是在這裡宣告的。」

### 最常見的幾種句型

**`Type 'A' is not assignable to type 'B'.`（TS2322）**

「`A` 型別的值不能放進 `B` 型別的地方」。`assignable` 的意思是「可以指定給」。上面的例子就是：字串不能放進數字型別的變數。這是你最常看到的錯誤，沒有之一。

**`Argument of type 'A' is not assignable to parameter of type 'B'.`（TS2345）**

跟上一個很像，只是發生在呼叫函式的時候：「你傳的引數是 `A`，但參數要的是 `B`」。上一集的 `double("5")` 就是這個。

**`Cannot find name 'x'.`（TS2304）**

「找不到叫 `x` 的東西」。通常是打錯字，或是忘了宣告、忘了 `import`。如果 TypeScript 猜得到你想打什麼，就會變成上面的 TS2552，後面多一句 `Did you mean ...?`。

**`Property 'x' does not exist on type '...'.`（TS2339）**

「這個物件沒有 `x` 這個屬性」。第 1 集的 `user.nmae` 就是這個。

### 看錯誤訊息的訣竅

- **從第一個錯誤開始改。** 一個錯誤常常會引發後面好幾個錯誤，改掉第一個，後面的可能就一起消失了。
- **先看位置，再看說明。** 先跳到 `檔名:行:字` 指的地方，看 `~~~` 標的是哪個東西，通常就猜得出問題。
- **說明看不懂，就拿錯誤代碼去搜尋。** 例如搜尋「TS2322」，會找到很多人問過一樣的問題。問 AI 的時候，也請把整段錯誤訊息原封不動地貼過去。

看完記得把 `typo.ts` 改對或刪掉。

## 重點整理

- 錯誤訊息的格式是「檔名:行:字 - error 錯誤代碼: 說明」，接著把出錯的那一行印出來。
- `is not assignable to` 的意思是「不能放進」，是最常見的錯誤。
- `Cannot find name` 是找不到名稱，`Property ... does not exist` 是物件沒有這個屬性。
- 從第一個錯誤開始改；看不懂就拿錯誤代碼去搜尋。
