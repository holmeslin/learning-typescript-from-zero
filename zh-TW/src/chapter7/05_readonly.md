# `readonly` 屬性

## 本集目標

用 `readonly` 讓類別的屬性在建立之後就不能再修改。

## 正文

### 只能在建構子裡設定

帳號的編號一旦建立就不該變。建立 `ro.ts`：

```ts,fails
class Account {
  readonly id: number;
  owner: string;

  constructor(id: number, owner: string) {
    this.id = id;
    this.owner = owner;
  }
}

const account = new Account(1, "小明");
account.owner = "小華";
account.id = 2;
console.log(account);
```

```text
ro.ts:13:9 - error TS2540: Cannot assign to 'id' because it is a read-only property.

13 account.id = 2;
           ~~


Found 1 error in ro.ts:13
```

「`id` 是唯讀屬性，不能指定新的值」。`owner` 沒有 `readonly`，改成 `"小華"` 沒問題；`id` 有，就不能改。

這跟第 3 章物件型別的 `readonly` 是同一個關鍵字、同一個意思。在類別裡多了一條規則：**`readonly` 屬性只能在宣告的地方或建構子裡給值**。

### 類別自己的方法也不能改

`readonly` 不只擋外面，連類別自己的方法也擋。建立 `ro2.ts`：

```ts,fails
class Account {
  readonly id: number;

  constructor(id: number) {
    this.id = id;
  }

  reset(): void {
    this.id = 0;
  }
}

console.log(new Account(1));
```

```text
ro2.ts:9:10 - error TS2540: Cannot assign to 'id' because it is a read-only property.

9     this.id = 0;
           ~~


Found 1 error in ro2.ts:9
```

這是 `readonly` 和 `#` 不一樣的地方：`#` 管的是「誰看得到」，`readonly` 管的是「建立之後能不能改」。

### 不能換掉，但內容可以變

`readonly` 只保證屬性不會被**換成另一個值**。如果屬性是陣列或物件，裡面的內容還是可以改：

```ts
class Order {
  readonly items: string[] = [];

  add(item: string): void {
    this.items.push(item);
  }
}

const order = new Order();
order.add("咖啡");
order.add("蛋糕");
console.log(order.items);
```

```text
[ '咖啡', '蛋糕' ]
```

`this.items = []` 會被擋下，但 `this.items.push(...)` 沒問題，因為 `items` 還是同一個陣列。

### 搭配 `#`

`readonly` 和 `#` 可以一起用，表示「外面看不到，裡面也不能改」：

```ts
class Account {
  readonly #id: number;
  owner: string;

  constructor(id: number, owner: string) {
    this.#id = id;
    this.owner = owner;
  }

  getId(): number {
    return this.#id;
  }
}

const account = new Account(1, "小明");
console.log(account.getId());
```

```text
1
```

跟 `private` 一樣，`readonly` 也是 TypeScript 的語法，只在 `tsc` 檢查時有效，執行時會被拿掉。

## 重點整理

- `readonly` 屬性只能在宣告的地方或建構子裡給值，之後就不能再改。
- 類別自己的方法也不能修改 `readonly` 屬性。
- `readonly` 擋的是「換成別的值」，陣列或物件的內容還是可以改。
- `readonly` 可以和 `#` 一起用。
