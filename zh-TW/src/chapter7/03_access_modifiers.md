# `public`、`private` 與 `protected`

## 本集目標

用存取修飾詞決定哪些屬性和方法可以從類別外面使用。

## 正文

### 餘額不該讓外面隨便改

上一集的 `Account` 有個問題：任何人都可以直接寫 `account.balance = 1000000`，跳過 `deposit` 的所有檢查。建立 `private.ts`：

```ts,fails
class Account {
  owner: string;
  private balance = 0;

  constructor(owner: string) {
    this.owner = owner;
  }

  deposit(amount: number): void {
    if (amount <= 0) {
      console.log("存款金額必須大於 0");
      return;
    }
    this.balance += amount;
  }

  getBalance(): number {
    return this.balance;
  }
}

const account = new Account("小明");
account.deposit(500);
account.balance = 1000000;
console.log(account.getBalance());
```

```text
private.ts:24:9 - error TS2341: Property 'balance' is private and only accessible within class 'Account'.

24 account.balance = 1000000;
           ~~~~~~~


Found 1 error in private.ts:24
```

`balance` 前面加了 `private`，意思是「只有 `Account` 自己的方法能用」。從外面讀或寫都會報錯。想知道餘額，就透過 `getBalance` 方法；想改餘額，就一定要走 `deposit`，它會先檢查金額。

### 三種存取修飾詞

`private` 這類關鍵字叫**存取修飾詞**（access modifier），一共有三種：

| 修飾詞 | 誰可以用 |
| --- | --- |
| `public` | 任何地方都可以用。這是預設值 |
| `private` | 只有這個類別自己的方法 |
| `protected` | 這個類別和繼承它的類別，第 6 集會用到 |

什麼都不寫就是 `public`，所以下面兩種寫法一樣：

```ts
class Account {
  public owner: string;
  private balance = 0;

  public constructor(owner: string) {
    this.owner = owner;
  }

  public getBalance(): number {
    return this.balance;
  }
}

const account = new Account("小明");
console.log(account.owner, account.getBalance());
```

大部分的程式碼不會特地寫 `public`，只在需要限制的地方加 `private` 或 `protected`。

### `private` 只在檢查時有效

注意一件事：上面 `private.ts` 雖然 `npx tsc` 報錯，用 Node.js 執行還是會照跑：

```bash
node private.ts
```

```text
1000000
```

還記得第 1 章說過，型別在執行時會被拿掉嗎？`private` 也是 TypeScript 的語法，執行時一樣會被拿掉，`balance` 在 JavaScript 裡還是一個普通的屬性。`private` 只是請 `tsc` 幫你檢查，擋不住真的想改的人。

如果你需要「執行時也真的拿不到」，要用 JavaScript 自己的私有欄位，這是下一集的主題。

### 你可能看過的簡寫

在別人的程式碼裡，你可能看過這種寫法：建構子的參數前面直接加 `private`，一次完成「宣告屬性」和「給值」。這叫**參數屬性**。建立 `paramprop.ts`：

```ts,fails
class Account {
  constructor(private owner: string) {}
}

console.log(new Account("小明"));
```

```text
paramprop.ts:2:15 - error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.

2   constructor(private owner: string) {}
                ~~~~~~~~~~~~~~~~~~~~~


Found 1 error in paramprop.ts:2
```

這是第 1 章看過的 TS1294。參數屬性拿掉型別之後，會少了 `this.owner = owner` 這行，不是單純「拿掉」就好，所以 Node.js 不能直接執行它。這本書不用這種寫法，附錄會說明怎麼看懂它。

## 重點整理

- `private` 讓屬性或方法只能在類別裡面使用，從外面用會報錯。
- 存取修飾詞有 `public`（預設）、`private`、`protected` 三種。
- `private` 只在 `tsc` 檢查時有效，執行時一樣拿得到。
- 建構子參數前面加 `private` 的參數屬性寫法，Node.js 不能直接執行，本書不使用。
