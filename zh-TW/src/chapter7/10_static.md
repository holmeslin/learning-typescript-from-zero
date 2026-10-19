# `static`

## 本集目標

用 `static` 寫出屬於類別本身、而不是屬於每個實例的屬性和方法。

## 正文

### 屬於類別本身的屬性

到目前為止，每個屬性都屬於「某一個實例」：每個帳戶有自己的餘額。但有些資料是大家共用的，例如「目前總共發了幾張號碼牌」。建立 `ticket.ts`：

```ts
class Ticket {
  static count = 0;
  readonly number: number;

  constructor() {
    Ticket.count++;
    this.number = Ticket.count;
  }
}

const a = new Ticket();
const b = new Ticket();
console.log(a.number, b.number);
console.log(Ticket.count);
```

```text
1 2
2
```

- `static count = 0`：`count` 前面加了 `static`，它屬於 `Ticket` 這個類別本身，整個程式只有一份。
- 使用時寫 `Ticket.count`，用類別的名稱，不是用 `this`。
- `number` 沒有 `static`，每張號碼牌各有一個。

### 不能從實例拿

`static` 屬性不在實例上。建立 `ticket2.ts`：

```ts,fails
class Ticket {
  static count = 0;
}

const ticket = new Ticket();
console.log(ticket.count);
```

```text
ticket2.ts:6:20 - error TS2576: Property 'count' does not exist on type 'Ticket'. Did you mean to access the static member 'Ticket.count' instead?

6 console.log(ticket.count);
                     ~~~~~


Found 1 error in ticket2.ts:6
```

「`Ticket` 的實例沒有 `count`。你是不是想用 static 成員 `Ticket.count`？」錯誤訊息直接告訴你正確的寫法。

### `static` 方法

方法也可以是 `static`。最常見的用途是「用不同的方式建立實例」：

```ts
class Temperature {
  readonly celsius: number;

  constructor(celsius: number) {
    this.celsius = celsius;
  }

  static fromFahrenheit(fahrenheit: number): Temperature {
    return new Temperature(((fahrenheit - 32) * 5) / 9);
  }
}

const today = Temperature.fromFahrenheit(86);
console.log(today.celsius);
```

```text
30
```

`Temperature.fromFahrenheit(86)` 不需要先有一個實例，直接用類別名稱呼叫，回傳一個新的 `Temperature`。回傳型別寫 `Temperature`，意思是「回傳一個 `Temperature` 的實例」，下一集會講類別怎麼當型別用。

你其實早就用過 `static` 方法了：`Math.round`、`Array.isArray`、`Object.keys` 都是。

### 搭配 `readonly` 和 `#`

`static` 可以和前面學的修飾詞一起用：

```ts
class Ticket {
  static readonly MAX = 3;
  static #count = 0;

  static issue(): number | null {
    if (Ticket.#count >= Ticket.MAX) {
      return null;
    }
    Ticket.#count++;
    return Ticket.#count;
  }
}

for (let i = 0; i < 4; i++) {
  console.log(Ticket.issue());
}
```

```text
1
2
3
null
```

`MAX` 是大家共用、不能改的上限；`#count` 是共用、但外面看不到的計數。號碼牌發完了，`issue` 就回傳 `null`。

## 重點整理

- `static` 屬性和方法屬於類別本身，整個程式只有一份。
- 用 `類別名稱.成員` 使用，不能從實例拿。
- `static` 方法常用來提供「建立實例的其他方式」。
- `static` 可以和 `readonly`、`#` 一起用。
