# 看得懂參數屬性

## 本集目標

看懂建構子參數前面加了 `public`、`private` 的寫法。

## 正文

第 7 章教類別時，屬性要先宣告，再在建構子裡指定：

```ts
class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

const p = new Point(3, 4);
console.log(p.x, p.y);
```

```text
3 4
```

`x` 和 `y` 各寫了三次。在別人的程式碼裡，你常會看到一種省字的寫法：

> 這一集的範例（上面那段除外）需要關掉 `erasableSyntaxOnly` 才跑得起來，看懂就好。

```ts,ignore
class Point {
  constructor(
    public x: number,
    public y: number,
  ) {}
}

const p = new Point(3, 4);
console.log(p.x, p.y);
```

```text
3 4
```

在建構子的參數前面加上 `public`、`private`、`protected` 或 `readonly`，這個參數就會**自動變成同名的屬性**，而且自動用傳進來的值設定好。這叫**參數屬性**（parameter property）。建構子本體 `{}` 是空的，但效果和第一段完全一樣。

修飾詞可以混著用：

```ts,ignore
class Account {
  constructor(
    public readonly owner: string,
    private balance: number,
  ) {}

  deposit(amount: number) {
    this.balance += amount;
    return this.balance;
  }
}

const account = new Account("小明", 100);
console.log(account.owner, account.deposit(50));
```

```text
小明 150
```

- `public readonly owner`：外面讀得到，但不能改。
- `private balance`：只有類別裡面用得到。

讀的時候，把建構子參數前面有修飾詞的，一個一個想成「宣告一個屬性 + 在建構子裡 `this.名稱 = 名稱`」就對了。`tsc` 轉出來的 JavaScript 也正是這樣：

```js
class Account {
    owner;
    balance;
    constructor(owner, balance) {
        this.owner = owner;
        this.balance = balance;
    }
    deposit(amount) {
        this.balance += amount;
        return this.balance;
    }
}
```

### 為什麼正文不用它

參數屬性會**產生** `this.owner = owner` 這樣的程式碼，不是單純把型別拿掉就好，所以 Node.js 不能直接執行，`npx tsc` 也會擋：

```ts,fails
class Point {
  constructor(
    public x: number,
    public y: number,
  ) {}
}

const p = new Point(3, 4);
console.log(p.x, p.y);
```

```text
point.ts:3:5 - error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.

3     public x: number,
      ~~~~~~~~~~~~~~~~

point.ts:4:5 - error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.

4     public y: number,
      ~~~~~~~~~~~~~~~~


Found 2 errors in the same file, starting at: point.ts:3
```

自己寫的時候，照第 7 章的方式先宣告屬性、再在建構子裡指定就好。多打幾個字，但每一行都看得到在做什麼。

## 重點整理

- 建構子參數前面加 `public`、`private`、`protected` 或 `readonly`，會自動變成同名屬性並設定好值。
- 讀的時候，把它想成「宣告屬性 + `this.名稱 = 名稱`」。
- 參數屬性會產生程式碼，Node.js 不能直接執行；自己寫時先宣告屬性，再在建構子裡指定。
