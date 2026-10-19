# `override`

## 本集目標

用 `override` 標示「這個方法是在改寫父類別的方法」，讓 TypeScript 幫你抓錯。

## 正文

### 改寫父類別的方法

上一集的 `SavingsAccount` 重新寫了 `describe` 方法，前面加了 `override`：

```ts
class Account {
  describe(): string {
    return "一般帳戶";
  }
}

class SavingsAccount extends Account {
  override describe(): string {
    return "儲蓄帳戶";
  }
}

const accounts: Account[] = [new Account(), new SavingsAccount()];
for (const account of accounts) {
  console.log(account.describe());
}
```

```text
一般帳戶
儲蓄帳戶
```

子類別寫一個跟父類別同名的方法，呼叫時就會用子類別的版本。這叫**改寫**（override）。

注意 `accounts` 的型別是 `Account[]`，裡面卻放了 `SavingsAccount`。子類別擁有父類別所有的東西，所以子類別的實例可以放進父類別型別的地方。呼叫 `describe()` 時，各自執行自己的版本。

### `override` 幫你抓打錯的名字

`override` 不寫，程式也會正常執行。那為什麼要寫？因為它會讓 TypeScript 確認「父類別真的有這個方法」。建立 `override.ts`：

```ts,fails
class Account {
  describe(): string {
    return "一般帳戶";
  }
}

class SavingsAccount extends Account {
  override describ(): string {
    return "儲蓄帳戶";
  }
}

console.log(new SavingsAccount().describe());
```

```text
override.ts:8:12 - error TS4117: This member cannot have an 'override' modifier because it is not declared in the base class 'Account'. Did you mean 'describe'?

8   override describ(): string {
             ~~~~~~~


Found 1 error in override.ts:8
```

「這個成員不能加 `override`，因為父類別（base class）`Account` 沒有宣告它。你是不是想打 `describe`？」

如果沒寫 `override`，`describ` 只會被當成子類別新增的方法，TypeScript 不會報錯，執行時呼叫 `describe()` 還是印出「一般帳戶」，你得自己慢慢找原因。

### 改寫時型別要對得上

改寫的方法，參數和回傳型別要跟父類別相容。建立 `badoverride.ts`：

```ts,fails
class Account {
  describe(): string {
    return "一般帳戶";
  }
}

class SavingsAccount extends Account {
  override describe(): number {
    return 1;
  }
}

console.log(new SavingsAccount().describe());
```

```text
badoverride.ts:8:12 - error TS2416: Property 'describe' in type 'SavingsAccount' is not assignable to the same property in base type 'Account'.
  Type '() => number' is not assignable to type '() => string'.
    Type 'number' is not assignable to type 'string'.

8   override describe(): number {
             ~~~~~~~~


Found 1 error in badoverride.ts:8
```

這則錯誤訊息有三層，越往下越具體：

1. 子類別的 `describe` 不能放進父類別的 `describe` 的位置。
2. 「回傳數字的函式」不能放進「回傳字串的函式」的位置。`() => number` 是第 4 章學過的函式型別寫法。
3. 最根本的原因：數字不能放進字串。

碰到這種多層的錯誤，通常看最後一層就知道問題在哪。

前面說過，子類別的實例可以放進父類別型別的地方。如果允許 `describe` 改成回傳數字，拿 `Account` 來用的程式碼就會在意料之外拿到數字，所以 TypeScript 不允許。

## 重點整理

- 子類別寫一個跟父類別同名的方法，就是改寫，呼叫時會用子類別的版本。
- 子類別的實例可以放進父類別型別的地方。
- 改寫時加上 `override`，TypeScript 會確認父類別真的有這個方法。
- 改寫的方法，參數和回傳型別要跟父類別相容。
