# 繼承

## 本集目標

用 `extends` 根據現有的類別建立新的類別，並認識 `super` 和 `protected`。

## 正文

### 在現有的類別上擴充

儲蓄帳戶也是一種帳戶：一樣有戶名、餘額、可以存款，只是多了利率。與其從頭寫一個新類別，不如**繼承**（inheritance）`Account`，只補上不一樣的部分。建立 `inherit.ts`：

```ts
class Account {
  owner: string;
  protected balance = 0;

  constructor(owner: string) {
    this.owner = owner;
  }

  deposit(amount: number): void {
    this.balance += amount;
  }

  describe(): string {
    return `${this.owner}：${this.balance} 元`;
  }
}

class SavingsAccount extends Account {
  rate: number;

  constructor(owner: string, rate: number) {
    super(owner);
    this.rate = rate;
  }

  addInterest(): void {
    this.balance += this.balance * this.rate;
  }

  override describe(): string {
    return `${super.describe()}（年利率 ${this.rate * 100}%）`;
  }
}

const savings = new SavingsAccount("小明", 0.02);
savings.deposit(1000);
savings.addInterest();
console.log(savings.describe());
```

```text
小明：1020 元（年利率 2%）
```

- `class SavingsAccount extends Account`：`SavingsAccount` 繼承 `Account`。`Account` 有的屬性和方法，`SavingsAccount` 全部都有，所以可以直接呼叫 `savings.deposit(1000)`。
- `Account` 叫做**父類別**，`SavingsAccount` 叫做**子類別**。
- 子類別可以加上自己的屬性（`rate`）和方法（`addInterest`）。
- `override describe()`：子類別重新寫了父類別的 `describe` 方法。`override` 是什麼，下一集會講。
- `super.describe()`：呼叫父類別原本的 `describe`，再在後面加上利率。

### 建構子裡要先呼叫 `super`

子類別的建構子，第一件事一定要呼叫 `super(...)`，也就是執行父類別的建構子，讓 `owner` 這些父類別的屬性先設定好。忘了寫會怎樣？建立 `nosuper.ts`：

```ts,fails
class Account {
  owner: string;

  constructor(owner: string) {
    this.owner = owner;
  }
}

class SavingsAccount extends Account {
  rate: number;

  constructor(owner: string, rate: number) {
    this.rate = rate;
  }
}

console.log(new SavingsAccount("小明", 0.02));
```

```text
nosuper.ts:12:3 - error TS2377: Constructors for derived classes must contain a 'super' call.

12   constructor(owner: string, rate: number) {
     ~~~~~~~~~~~

nosuper.ts:13:5 - error TS17009: 'super' must be called before accessing 'this' in the constructor of a derived class.

13     this.rate = rate;
       ~~~~


Found 2 errors in the same file, starting at: nosuper.ts:12
```

`derived class` 就是子類別。第一個錯誤是「子類別的建構子一定要呼叫 `super`」，第二個是「使用 `this` 之前要先呼叫 `super`」。這也是 JavaScript 本身的規則，用 Node.js 執行一樣會出錯。

如果子類別不需要自己的建構子，整個 `constructor` 都可以不寫，這時候會直接使用父類別的建構子。

### `protected`：給子類別用的私有

注意 `Account` 的 `balance` 用的是 `protected`，不是第 4 集的 `#`。因為子類別的 `addInterest` 要改 `this.balance`，而 `#` 私有欄位**連子類別都拿不到**。

`protected` 的意思是「自己和子類別可以用，外面不行」。建立 `prot.ts`：

```ts,fails
class Account {
  protected balance = 0;
}

class SavingsAccount extends Account {
  addInterest(): void {
    this.balance += 10;
  }
}

const savings = new SavingsAccount();
savings.addInterest();
console.log(savings.balance);
```

```text
prot.ts:13:21 - error TS2445: Property 'balance' is protected and only accessible within class 'Account' and its subclasses.

13 console.log(savings.balance);
                       ~~~~~~~


Found 1 error in prot.ts:13
```

子類別裡的 `this.balance += 10` 沒問題，最後一行從外面讀 `savings.balance` 就報錯了。

跟 `private` 一樣，`protected` 是 TypeScript 的語法，只在 `tsc` 檢查時有效。

### 不要繼承太多層

繼承很方便，但每多一層，要理解一個類別就得往上翻更多程式碼。實務上的建議是：繼承最好只有一、兩層。後面第 8 集的 `implements`，很多時候是比繼承更簡單的選擇。

## 重點整理

- `class 子類別 extends 父類別` 讓子類別擁有父類別所有的屬性和方法。
- 子類別的建構子要先呼叫 `super(...)`，才能使用 `this`。
- `super.方法名稱()` 可以呼叫父類別原本的方法。
- `protected` 讓屬性只有自己和子類別能用；`#` 私有欄位連子類別都拿不到。
