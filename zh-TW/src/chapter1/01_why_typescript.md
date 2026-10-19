# 為什麼要用 TypeScript

## 本集目標

看懂 TypeScript 解決了 JavaScript 的哪些問題。

## 正文

### 不會報錯的錯誤

先看一段 JavaScript：

```js
const user = { name: "小明", age: 20 };
console.log(user.nmae);
```

`name` 被打成了 `nmae`。但 JavaScript 不覺得這有什麼問題，它只會印出：

```text
undefined
```

沒有錯誤訊息，程式繼續往下跑。再看另一個例子：

```js
function addTax(price) {
  return price + price * 0.05;
}

console.log(addTax(100));
console.log(addTax("100"));
```

```text
105
1005
```

第二次呼叫傳進去的是字串 `"100"`。`price * 0.05` 會把字串轉成數字，算出 `5`；但 `+` 碰到字串時是「接起來」，所以變成 `"100"` 接上 `5`，得到 `1005`。

這兩個錯誤有個共同點：**JavaScript 不會告訴你**。錯誤的值會繼續流下去，可能顯示在畫面上，也可能在三個函式之後才讓程式當掉。等你發現的時候，已經很難找出源頭了。

### TypeScript 怎麼處理

TypeScript 讓你事先說明每個值是什麼**型別**（type）。例如告訴它「`price` 是數字」：

```ts,fails
function addTax(price: number) {
  return price + price * 0.05;
}

console.log(addTax("100"));
```

接著用 TypeScript 的工具檢查，它會在程式執行**之前**就指出問題：

```text
tax.ts:5:20 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

5 console.log(addTax("100"));
                     ~~~~~


Found 1 error in tax.ts:5
```

意思是「你傳了字串，但這個參數要的是數字」。怎麼看懂這種錯誤訊息，第 5 集會詳細講。

至於第一個 `nmae` 的例子，你甚至不用加任何東西。TypeScript 自己看得出 `user` 有 `name` 和 `age`，沒有 `nmae`，一樣會報錯。

### TypeScript 是什麼

- **TypeScript = JavaScript + 型別。** 你會的 JavaScript 寫法全部都還能用，TypeScript 只是多了「說明型別」的語法。
- **檔案的副檔名是 `.ts`**，對應 JavaScript 的 `.js`。
- **型別只在檢查時有用。** 程式真正執行的時候，型別會被整個拿掉，剩下的就是普通的 JavaScript。所以加了型別，程式不會變慢。第 9 集會再講這件事。
- **檢查型別的工具叫 `tsc`**，是 TypeScript 的編譯器（compiler）。這本書用的 TypeScript 7 把 `tsc` 用 Go 語言重寫了一遍，速度比以前快很多，但用法完全一樣。

### 為什麼現在值得學

錯字、傳錯型別、漏傳參數，這些錯誤在小程式裡你一眼就看得出來。但專案一大、有好幾個人一起寫、或是你半年後回來改自己的程式碼時，就很難全部記得每個函式要收什麼。型別就像寫在程式碼裡的說明書，而且這份說明書有人幫你檢查。

另一個實際的理由是：現在新的前端和 Node.js 專案，大部分直接用 TypeScript 寫，網路上的範例和套件說明也是。就算你不打算自己寫，也需要看得懂。

## 重點整理

- JavaScript 的錯字和型別錯誤常常不會報錯，錯誤的值會一路流下去。
- TypeScript 讓你說明每個值的型別，在程式執行之前就把錯誤抓出來。
- TypeScript 是 JavaScript 加上型別，檔案副檔名是 `.ts`。
- 型別在執行時會被拿掉，檢查型別的工具是 `tsc`。
