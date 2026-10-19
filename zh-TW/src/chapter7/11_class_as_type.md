# 類別也是型別

## 本集目標

知道類別的名稱可以直接當型別用，以及它跟結構型別、`instanceof` 的關係。

## 正文

### 類別名稱就是型別

定義一個類別，TypeScript 會同時得到兩樣東西：一個可以 `new` 的類別，和一個同名的**型別**，描述這個類別的實例長什麼樣子。前面幾集的 `Account[]`、`Shape[]`、上一集的回傳型別 `Temperature`，都是在用這個型別。

建立 `point.ts`：

```ts
class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

function show(point: Point) {
  console.log(`(${point.x}, ${point.y})`);
}

show(new Point(1, 2));
show({ x: 3, y: 4 });
```

```text
(1, 2)
(3, 4)
```

第二次呼叫傳進去的不是 `Point` 的實例，只是一個普通的物件，TypeScript 卻沒有報錯。

這是第 3 章學過的**結構型別**：TypeScript 比對型別時只看形狀。`Point` 型別要求有數字的 `x` 和 `y`，`{ x: 3, y: 4 }` 剛好有，就通過了。類別的型別也照這個規則。

### 有 `#` 私有欄位就不一樣了

如果類別裡有 `#` 私有欄位，情況就不同了。建立 `report.ts`：

```ts,fails
class Account {
  owner: string;
  #balance = 0;

  constructor(owner: string) {
    this.owner = owner;
  }

  getBalance(): number {
    return this.#balance;
  }
}

function report(account: Account) {
  console.log(`${account.owner}：${account.getBalance()} 元`);
}

report(new Account("小明"));
report({ owner: "小華", getBalance: () => 1000000 });
```

```text
report.ts:19:8 - error TS2741: Property '#balance' is missing in type '{ owner: string; getBalance: () => number; }' but required in type 'Account'.

19 report({ owner: "小華", getBalance: () => 1000000 });
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  report.ts:3:3 - '#balance' is declared here.
    3   #balance = 0;
        ~~~~~~~~


Found 1 error in report.ts:19
```

私有欄位只有用這個類別建立的實例才會有，外面寫的物件不可能有，所以形狀永遠對不上。換句話說：**類別有私有成員時，它的型別只接受真正的實例**。這正好擋下了用假物件冒充帳戶、捏造餘額的情況。

### 用 `instanceof` 分辨自己寫的類別

第 5 章用 `instanceof` 分辨過 `Date` 和 `Error`，當時說過「你自己也可以寫出這種東西」。現在你會寫了：

```ts
class Dog {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  bark(): string {
    return `${this.name}：汪汪`;
  }
}

class Cat {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  meow(): string {
    return `${this.name}：喵～`;
  }
}

function speak(pet: Dog | Cat) {
  if (pet instanceof Dog) {
    console.log(pet.bark());
  } else {
    console.log(pet.meow());
  }
}

speak(new Dog("小黑"));
speak(new Cat("咪咪"));
```

```text
小黑：汪汪
咪咪：喵～
```

`pet instanceof Dog` 為真時，TypeScript 把 `pet` 縮小成 `Dog`，可以呼叫 `bark`；`else` 裡就只剩 `Cat`。

但要記得，`instanceof` 檢查的是「是不是用這個類別 `new` 出來的」，不是形狀：

```ts
class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

const p = { x: 3, y: 4 };
console.log(p instanceof Point);
console.log(new Point(3, 4) instanceof Point);
```

```text
false
true
```

`p` 的形狀跟 `Point` 一模一樣，型別檢查也會讓它通過，但它不是用 `Point` 建立的，所以 `instanceof` 是 `false`。如果一個參數可能收到普通的物件，就不要用 `instanceof` 判斷它，改用第 5 章的 `in` 或可辨識聯集。

## 重點整理

- 定義類別時，會同時得到一個同名的型別，描述它的實例。
- 類別的型別也是結構型別：形狀對得上的普通物件也能通過。
- 類別有 `#` 私有欄位時，只有真正的實例才符合它的型別。
- `instanceof` 檢查的是「是不是這個類別建立的」，可以用來縮小自己寫的類別。
