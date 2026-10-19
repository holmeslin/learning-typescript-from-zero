# `implements`

## 本集目標

用 `interface` 規定類別要有哪些屬性和方法，再用 `implements` 讓 TypeScript 檢查。

## 正文

### 規定「要有什麼」，不管「怎麼做」

結帳時可以刷卡、也可以用行動支付。每種付款方式的做法不一樣，但結帳程式只在乎一件事：它們都有名稱，也都能付錢。建立 `payment.ts`：

```ts
interface Payment {
  name: string;
  pay(amount: number): string;
}

class CreditCard implements Payment {
  name = "信用卡";

  pay(amount: number): string {
    return `刷卡 ${amount} 元`;
  }
}

class LinePay implements Payment {
  name = "LINE Pay";

  pay(amount: number): string {
    return `用 LINE Pay 付 ${amount} 元`;
  }
}

function checkout(method: Payment, amount: number) {
  console.log(`${method.name}：${method.pay(amount)}`);
}

checkout(new CreditCard(), 300);
checkout(new LinePay(), 120);
```

```text
信用卡：刷卡 300 元
LINE Pay：用 LINE Pay 付 120 元
```

- `interface Payment { ... }`：描述「付款方式」要有什麼。`pay(amount: number): string;` 是描述方法的寫法，意思是「有一個叫 `pay` 的方法，收一個數字、回傳字串」。它跟 `pay: (amount: number) => string;` 意思一樣，只是寫起來跟類別的方法比較像。
- `class CreditCard implements Payment`：宣告「`CreditCard` 符合 `Payment` 的規定」。
- `checkout` 的參數型別是 `Payment`，所以任何符合規定的付款方式都能傳進去。之後要加一個「轉帳」，只要再寫一個 `implements Payment` 的類別，`checkout` 一行都不用改。

### 少了東西就報錯

`implements` 的作用是請 TypeScript 檢查「類別真的有照規定寫」。建立 `cash.ts`：

```ts,fails
interface Payment {
  name: string;
  pay(amount: number): string;
}

class Cash implements Payment {
  name = "現金";
}

console.log(new Cash());
```

```text
cash.ts:6:7 - error TS2420: Class 'Cash' incorrectly implements interface 'Payment'.
  Property 'pay' is missing in type 'Cash' but required in type 'Payment'.

6 class Cash implements Payment {
        ~~~~

  cash.ts:3:3 - 'pay' is declared here.
    3   pay(amount: number): string;
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Found 1 error in cash.ts:6
```

「`Cash` 沒有正確實作 `Payment`：`Payment` 要求的 `pay`，`Cash` 沒有」。錯誤出現在類別定義的地方，你一寫完類別就知道漏了什麼，不用等到有人呼叫 `pay` 才發現。

一個類別也可以同時符合好幾個規定，用逗號隔開：

```ts
interface Named {
  name: string;
}

interface Refundable {
  refund(amount: number): string;
}

class CreditCard implements Named, Refundable {
  name = "信用卡";

  refund(amount: number): string {
    return `退款 ${amount} 元到信用卡`;
  }
}

console.log(new CreditCard().refund(300));
```

```text
退款 300 元到信用卡
```

### 為什麼這裡用 `interface`

第 3 章定過一個習慣：物件型別一律用 `type`。其實 `implements` 後面接 `type` 也可以：

```ts
type Payment = {
  name: string;
  pay(amount: number): string;
};

class Cash implements Payment {
  name = "現金";

  pay(amount: number): string {
    return `付現 ${amount} 元`;
  }
}

console.log(new Cash().pay(50));
```

```text
付現 50 元
```

效果完全一樣。那為什麼這一集用 `interface`？因為「規定一個類別要有哪些東西」正是 `interface` 這個名字的原意，大部分的 TypeScript 程式碼在搭配 `implements` 時都用 `interface`，你在函式庫和別人的專案裡也最常看到這種寫法。這本書的習慣是：**一般的物件型別用 `type`，要給類別 `implements` 的規定用 `interface`**。

### `interface` 不只給類別用

`implements` 只是多請 TypeScript 檢查一次。`checkout` 收的是 `Payment` 型別，根據第 3 章的結構型別，只要形狀對，直接用大括號寫的物件也能傳進去：

```ts
interface Payment {
  name: string;
  pay(amount: number): string;
}

const transfer: Payment = {
  name: "轉帳",
  pay(amount: number): string {
    return `轉帳 ${amount} 元`;
  },
};

console.log(transfer.pay(1000));
```

```text
轉帳 1000 元
```

## 重點整理

- `interface` 可以規定類別要有哪些屬性和方法，`class X implements 介面` 會讓 TypeScript 檢查類別有沒有照做。
- 少了規定的東西，錯誤會出現在類別定義的地方。
- 一個類別可以 `implements` 好幾個介面，用逗號隔開。
- `implements` 後面接 `type` 也可以；本書習慣在這種情況用 `interface`。
- 參數型別寫介面，任何形狀符合的物件都能傳進去，不一定要是類別的實例。
