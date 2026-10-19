# 可選屬性

## 本集目標

用 `?` 標出可以不填的屬性，並安全地讀取它。

## 正文

### 在屬性名稱後面加 `?`

不是每個屬性都一定會有。例如註冊會員時，email 可以不填。建立 `user.ts`：

```ts
type User = {
  name: string;
  email?: string;
};

const a: User = { name: "小明", email: "ming@example.com" };
const b: User = { name: "小華" };

console.log(a, b);
```

`email?: string` 的 `?` 表示這個屬性是**可選屬性**（optional property）：可以有，也可以沒有；有的話必須是字串。所以 `b` 沒有 `email` 也不會報錯。

### 讀取可選屬性要小心

沒有填的屬性，讀出來是 `undefined`。所以對 TypeScript 來說，`email` 的型別其實是「字串或 `undefined`」，也就是第 2 章看過的 `string | undefined`。

如果直接把它當字串用：

```ts,fails
type User = {
  name: string;
  email?: string;
};

function showEmail(user: User) {
  console.log(user.email.toUpperCase());
}

showEmail({ name: "小華" });
```

```text
user.ts:7:15 - error TS18048: 'user.email' is possibly 'undefined'.

7   console.log(user.email.toUpperCase());
                ~~~~~~~~~~


Found 1 error in user.ts:7
```

「`user.email` 可能是 `undefined`」。TypeScript 說得沒錯，用 Node.js 執行這段，程式會直接當掉：

```text
TypeError: Cannot read properties of undefined (reading 'toUpperCase')
```

### 先處理沒有值的情況

最簡單的做法，是用 JavaScript 的 `?.` 和 `??`：

```ts
type User = {
  name: string;
  email?: string;
};

function showEmail(user: User) {
  console.log(user.email?.toUpperCase() ?? "沒有填 email");
}

showEmail({ name: "小明", email: "ming@example.com" });
showEmail({ name: "小華" });
```

```text
MING@EXAMPLE.COM
沒有填 email
```

- `user.email?.toUpperCase()`：`email` 有值才呼叫 `toUpperCase()`，沒有值就直接得到 `undefined`。
- `?? "沒有填 email"`：左邊是 `undefined` 或 `null` 時，改用右邊的值。

用 `if (user.email)` 先檢查也可以，TypeScript 看得懂這種檢查，知道 `if` 裡面的 `email` 一定是字串。這種「檢查之後型別變得更明確」的能力，第 5 章會詳細講。

### 什麼時候用可選屬性

只有「真的可以沒有」的屬性才加 `?`。如果每個屬性都加 `?`，TypeScript 就會要你到處檢查 `undefined`，反而更麻煩。

## 重點整理

- 屬性名稱後面加 `?`，就是可選屬性，物件裡可以沒有它。
- 可選屬性的型別會自動多出 `undefined`，例如 `string | undefined`。
- 直接使用可能是 `undefined` 的值，會出現 TS18048 錯誤。
- 用 `?.` 和 `??` 處理沒有值的情況。
