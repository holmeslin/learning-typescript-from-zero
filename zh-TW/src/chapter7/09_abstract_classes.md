# 抽象類別

## 本集目標

用 `abstract` 寫出「只能被繼承、不能直接建立」的類別。

## 正文

### 有些類別不該直接 `new`

圓形和長方形都是「形狀」，都有名稱、都能算面積、都能用同樣的格式描述自己。但「形狀」本身是個籠統的概念，算不出面積，也不該被直接建立。建立 `shape.ts`：

```ts
abstract class Shape {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract area(): number;

  describe(): string {
    return `${this.name}的面積是 ${this.area().toFixed(1)}`;
  }
}

class Circle extends Shape {
  radius: number;

  constructor(radius: number) {
    super("圓形");
    this.radius = radius;
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    super("長方形");
    this.width = width;
    this.height = height;
  }

  area(): number {
    return this.width * this.height;
  }
}

const shapes: Shape[] = [new Circle(2), new Rectangle(3, 4)];
for (const shape of shapes) {
  console.log(shape.describe());
}
```

```text
圓形的面積是 12.6
長方形的面積是 12.0
```

- `abstract class Shape`：**抽象類別**。它只能被繼承，不能直接 `new`。
- `abstract area(): number;`：**抽象方法**。只寫名稱和型別，沒有大括號、沒有內容，意思是「每個子類別都必須自己寫出 `area`」。
- `describe` 是普通的方法，有完整的內容，子類別直接繼承來用。`describe` 裡呼叫了 `this.area()`，實際執行的是各個子類別自己的版本。

這樣一來，「描述的格式」只寫一次，放在 `Shape`；「怎麼算面積」交給每個子類別。

### 兩條規則

建立 `shape2.ts`：

```ts,fails
abstract class Shape {
  abstract area(): number;
}

class Triangle extends Shape {}

const shape = new Shape();
console.log(shape, new Triangle());
```

```text
shape2.ts:5:7 - error TS2515: Non-abstract class 'Triangle' does not implement inherited abstract member area from class 'Shape'.

5 class Triangle extends Shape {}
        ~~~~~~~~

shape2.ts:7:15 - error TS2511: Cannot create an instance of an abstract class.

7 const shape = new Shape();
                ~~~~~~~~~~~


Found 2 errors in the same file, starting at: shape2.ts:5
```

1. **子類別一定要寫出所有的抽象方法。**`Triangle` 不是抽象類別，卻沒有寫 `area`，所以報錯。
2. **抽象類別不能直接 `new`。**

### 抽象類別和 `implements` 怎麼選

抽象類別跟上一集的 `interface` 很像，都是在規定「要有什麼」。差別在於：

| | `interface` 加 `implements` | 抽象類別加 `extends` |
| --- | --- | --- |
| 能不能放共用的程式碼 | 不能，只能描述形狀 | 可以，例如上面的 `describe` |
| 一個類別可以有幾個 | 可以 `implements` 好幾個 | 只能 `extends` 一個 |
| 執行時存不存在 | 不存在，會被拿掉 | 存在，是真的類別 |

子類別之間有一段**共用的程式碼**時，用抽象類別；只是要規定形狀時，用 `interface` 就好。

`abstract` 跟 `private` 一樣是 TypeScript 的語法，執行時會被拿掉，但它拿掉之後剩下的就是普通的 JavaScript 類別，所以 Node.js 可以直接執行。

## 重點整理

- `abstract class` 是抽象類別，只能被繼承，不能直接 `new`。
- `abstract` 方法只寫名稱和型別，子類別一定要自己寫出內容。
- 抽象類別可以放子類別共用的程式碼，`interface` 只能描述形狀。
- 有共用的程式碼時用抽象類別，只是規定形狀時用 `interface`。
