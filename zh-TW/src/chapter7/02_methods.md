# 方法

## 本集目標

在類別裡寫方法，讓物件可以操作自己的資料。

## 正文

### 幫類別加上動作

建立 `methods.ts`：

```ts
class Account {
  owner: string;
  balance = 0;

  constructor(owner: string) {
    this.owner = owner;
  }

  deposit(amount: number): void {
    this.balance += amount;
  }

  describe(): string {
    return `${this.owner} 的餘額：${this.balance} 元`;
  }
}

const account = new Account("小明");
account.deposit(500);
account.deposit(300);
console.log(account.describe());
```

```text
小明 的餘額：800 元
```

寫在類別裡的函式叫**方法**（method）。寫法跟一般函式差不多，只是前面不用寫 `function`：

- `deposit(amount: number): void`：參數要標型別，回傳型別寫在小括號後面，跟第 4 章學的一樣。`deposit` 不回傳任何東西，所以是 `void`。
- 方法裡用 `this` 讀寫自己的屬性。`account.deposit(500)` 執行時，`this` 就是 `account`。

### 呼叫方法也會被檢查

TypeScript 知道 `Account` 有哪些方法、每個方法要收什麼參數。建立 `methods2.ts`：

```ts,fails
class Account {
  owner: string;
  balance = 0;

  constructor(owner: string) {
    this.owner = owner;
  }

  deposit(amount: number): void {
    this.balance += amount;
  }
}

const account = new Account("小明");
account.deposit("500");
account.withdraw(100);
```

```text
methods2.ts:15:17 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

15 account.deposit("500");
                   ~~~~~

methods2.ts:16:9 - error TS2339: Property 'withdraw' does not exist on type 'Account'.

16 account.withdraw(100);
           ~~~~~~~~


Found 2 errors in the same file, starting at: methods2.ts:15
```

第一個錯誤是傳錯型別，第二個是呼叫了不存在的方法。在 VS Code 裡打 `account.`，自動完成清單會列出 `owner`、`balance`、`deposit`，屬性和方法都在裡面。

### TypeScript 抓不到的陷阱：`this` 弄丟了

方法裡的 `this`，是「呼叫的時候，點前面的那個物件」。如果把方法單獨拿出來呼叫，前面沒有物件，`this` 就不見了。建立 `thislost.ts`：

```ts
class Counter {
  count = 0;

  increase(): void {
    this.count++;
  }
}

const counter = new Counter();
const increase = counter.increase;
increase();
```

`npx tsc` 不會報錯，但執行會出錯（省略了部分內容）：

```text
TypeError: Cannot read properties of undefined (reading 'count')
```

`increase()` 前面沒有 `counter.`，所以 `this` 是 `undefined`。這是 JavaScript 本身的規則，TypeScript 檢查不出來。

把方法當成 callback 傳給別的函式（例如 `forEach`）時，最容易碰到這個問題。解法是把方法寫成**箭頭函式的屬性**，箭頭函式會記住建立時的 `this`：

```ts
class Counter {
  count = 0;

  increase = (): void => {
    this.count++;
  };
}

const counter = new Counter();
const increase = counter.increase;
increase();
increase();
console.log(counter.count);
```

```text
2
```

一般情況下用普通的方法寫法就好，確定要把方法單獨傳出去時，再改成箭頭函式。

## 重點整理

- 寫在類別裡的函式叫方法，參數和回傳值的型別寫法跟一般函式一樣。
- 方法裡用 `this` 讀寫物件自己的屬性。
- TypeScript 會檢查方法存不存在、引數的型別對不對。
- 把方法單獨拿出來呼叫，`this` 會不見，TypeScript 抓不到；需要時改用箭頭函式屬性。
