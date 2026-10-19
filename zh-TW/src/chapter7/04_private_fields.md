# `#` 私有欄位

## 本集目標

用 JavaScript 的 `#` 私有欄位，做出執行時也真的拿不到的屬性。

## 正文

### 名稱前面加 `#`

上一集說過，`private` 在執行時會被拿掉。JavaScript 本身有另一種私有的寫法：在名稱前面加上 `#`。建立 `hash.ts`：

```ts
class Account {
  owner: string;
  #balance = 0;

  constructor(owner: string) {
    this.owner = owner;
  }

  deposit(amount: number): void {
    this.#balance += amount;
  }

  getBalance(): number {
    return this.#balance;
  }
}

const account = new Account("小明");
account.deposit(500);
console.log(account.getBalance());
console.log(account);
```

```text
500
Account { owner: '小明' }
```

- 宣告時寫 `#balance`，使用時也要寫 `this.#balance`。`#` 是名稱的一部分，不能省略。
- 印出整個 `account` 的時候，看不到 `#balance`。它被藏起來了。

### 從外面用會怎樣

建立 `hash2.ts`：

```ts,fails
class Account {
  #balance = 0;

  getBalance(): number {
    return this.#balance;
  }
}

const account = new Account();
account.#balance = 1000000;
```

`npx tsc` 會報錯：

```text
hash2.ts:10:9 - error TS18013: Property '#balance' is not accessible outside class 'Account' because it has a private identifier.

10 account.#balance = 1000000;
           ~~~~~~~~


Found 1 error in hash2.ts:10
```

跟 `private` 不一樣的是，這次用 Node.js 執行**也會出錯**（省略了部分內容）：

```text
SyntaxError: Private field '#balance' must be declared in an enclosing class
```

`#` 是 JavaScript 的語法，不會在執行時被拿掉。在類別外面寫 `account.#balance`，JavaScript 本身就不允許。

### `private` 和 `#` 的比較

為了對照，把 `private` 的版本印出來看看：

```ts
class Account {
  private balance = 0;
}

const account = new Account();
console.log(account);
console.log(Object.keys(account));
```

```text
Account { balance: 0 }
[ 'balance' ]
```

`private` 的 `balance` 執行時看得到，也列在 `Object.keys` 裡。整理一下：

| | `private balance` | `#balance` |
| --- | --- | --- |
| 從哪裡來 | TypeScript 的語法 | JavaScript 的語法 |
| `tsc` 檢查 | 會擋 | 會擋 |
| 執行時 | 拿得到 | 拿不到 |

兩種寫法在 `tsc` 檢查時效果一樣。如果你要的是「執行時也真的保護起來」，用 `#`。這本書接下來的範例都用 `#`；你在別人的程式碼裡看到 `private`，知道它的意思就好。

## 重點整理

- 名稱前面加 `#` 的屬性是私有欄位，只能在類別裡面用 `this.#名稱` 存取。
- `#` 是 JavaScript 的語法，執行時一樣有效，類別外面拿不到。
- `private` 只在 `tsc` 檢查時有效，`#` 在檢查和執行時都有效。
- 本書接下來用 `#` 表示私有。
