# 屬性與建構子

## 本集目標

寫出第一個類別，宣告屬性的型別，用建構子設定初始值。

## 正文

### 第一個類別

建立 `account.ts`：

```ts
class Account {
  owner: string;
  balance: number;

  constructor(owner: string, balance: number) {
    this.owner = owner;
    this.balance = balance;
  }
}

const account = new Account("小明", 1000);
console.log(account.owner, account.balance);
```

```bash
node account.ts
```

```text
小明 1000
```

一行一行看：

- `class Account { ... }`：定義一個叫 `Account` 的類別。類別名稱習慣用大寫開頭。
- `owner: string;`、`balance: number;`：宣告這個類別產生的物件有哪些**屬性**，以及每個屬性的型別。寫法跟第 3 章的物件型別很像。
- `constructor(...) { ... }`：**建構子**（constructor）。用 `new` 建立物件的時候，會自動執行這個函式，通常用來設定屬性的初始值。它的參數跟一般函式一樣要標型別。
- `this`：在類別裡面，`this` 指的是「正在建立的這個物件」。`this.owner = owner` 就是把參數 `owner` 存進物件的 `owner` 屬性。
- `new Account("小明", 1000)`：用類別建立一個物件。這個物件叫做 `Account` 的**實例**（instance）。

類別就像一個模具，每次 `new` 都會照同一個模具做出一個新的物件：

```ts
class Account {
  owner: string;
  balance: number;

  constructor(owner: string, balance: number) {
    this.owner = owner;
    this.balance = balance;
  }
}

const a = new Account("小明", 1000);
const b = new Account("小華", 500);
console.log(a.owner, b.owner);
```

`a` 和 `b` 是兩個不同的物件，各自有自己的 `owner` 和 `balance`。

### 屬性一定要先宣告

在 JavaScript 裡，類別的屬性可以直接在建構子裡用 `this.xxx = ...` 生出來。TypeScript 不行。建立 `nofield.ts`：

```ts,fails
class Account {
  constructor(owner: string) {
    this.owner = owner;
  }
}

const account = new Account("小明");
console.log(account);
```

```text
nofield.ts:3:10 - error TS2339: Property 'owner' does not exist on type 'Account'.

3     this.owner = owner;
           ~~~~~


Found 1 error in nofield.ts:3
```

「`Account` 型別沒有 `owner` 這個屬性」。TypeScript 要你先在類別最上面寫出 `owner: string;`，它才知道物件有哪些屬性、各是什麼型別。

### 屬性一定要有值

反過來，宣告了屬性，卻沒有在建構子裡給它值，也會報錯。建立 `uninit.ts`：

```ts,fails
class Account {
  owner: string;
  balance: number;

  constructor(owner: string) {
    this.owner = owner;
  }
}

console.log(new Account("小明"));
```

```text
uninit.ts:3:3 - error TS2564: Property 'balance' has no initializer and is not definitely assigned in the constructor.

3   balance: number;
    ~~~~~~~


Found 1 error in uninit.ts:3
```

「`balance` 沒有初始值，建構子裡也沒有確實給它值」。`balance` 說好是數字，但實際上會是 `undefined`，TypeScript 不讓這種事發生。這個檢查也是 `"strict": true` 打開的。

### 直接給初始值

如果每個物件的某個屬性一開始都一樣，可以在宣告的地方直接給值，不用寫進建構子：

```ts
class Account {
  owner: string;
  balance = 0;

  constructor(owner: string) {
    this.owner = owner;
  }
}

const account = new Account("小明");
console.log(account);
```

```text
Account { owner: '小明', balance: 0 }
```

`balance = 0` 沒有寫型別，TypeScript 會從初始值推論出 `number`，跟第 1 章的型別推論一樣。

建立物件時，TypeScript 一樣會檢查傳給建構子的引數。`new Account(123)` 會得到第 1 章看過的 TS2345 錯誤：引數是數字，但參數要的是字串。

## 重點整理

- 類別用 `class` 定義，用 `new` 建立實例。
- 屬性要在類別最上面宣告型別，例如 `owner: string;`。
- 建構子 `constructor` 在 `new` 的時候執行，負責給屬性初始值。
- 宣告了屬性就一定要給值：在建構子裡設定，或是在宣告的地方直接給初始值。
