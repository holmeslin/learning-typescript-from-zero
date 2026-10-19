# 看得懂 `namespace`

## 本集目標

看懂舊程式碼和型別定義檔裡的 `namespace`。

## 正文

在 JavaScript 還沒有 `import` / `export` 的年代，TypeScript 用 `namespace`（命名空間）把相關的程式碼包在同一個名字底下，避免名稱互相衝突。

> 這一集的第一個範例需要關掉 `erasableSyntaxOnly` 才跑得起來，看懂就好。

```ts,ignore
namespace Geometry {
  export const PI = 3.14;

  export function circleArea(radius: number) {
    return PI * radius * radius;
  }
}

console.log(Geometry.circleArea(2));
```

```text
12.56
```

- `namespace Geometry { ... }` 建立一個叫 `Geometry` 的容器。
- 裡面加了 `export` 的東西，外面才能用 `Geometry.名稱` 拿到；沒加 `export` 的只有裡面用得到。
- 使用的時候寫 `Geometry.circleArea(2)`，很像在用一個物件。

`tsc` 轉出來的 JavaScript 也確實是一個物件：

```js
var Geometry;
(function (Geometry) {
    Geometry.PI = 3.14;
    function circleArea(radius) {
        return Geometry.PI * radius * radius;
    }
    Geometry.circleArea = circleArea;
})(Geometry || (Geometry = {}));
```

跟 `enum` 一樣，這是「會產生程式碼」的語法，所以 Node.js 不能直接執行，`npx tsc` 也會擋：

```ts,fails
namespace Geometry {
  export const PI = 3.14;

  export function circleArea(radius: number) {
    return PI * radius * radius;
  }
}

console.log(Geometry.circleArea(2));
```

```text
geometry.ts:1:11 - error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.

1 namespace Geometry {
            ~~~~~~~~


Found 1 error in geometry.ts:1
```

### 現在怎麼寫

一個檔案就是一個模組，`export` / `import` 已經能做到 `namespace` 做的事。上面的例子，現在會寫成一個 `geometry.ts` 檔案：

```ts
export const PI = 3.14;

export function circleArea(radius: number) {
  return PI * radius * radius;
}
```

要用的地方 `import { circleArea } from "./geometry.ts"`，第 9 章就是這樣寫的。

### 只有型別的 `namespace` 可以用

如果 `namespace` 裡**只有型別**，拿掉之後什麼都不剩，就不會產生程式碼，Node.js 可以直接執行，`erasableSyntaxOnly` 也不會擋：

```ts
namespace Shapes {
  export type Circle = { radius: number };
  export type Square = { side: number };
}

const circle: Shapes.Circle = { radius: 1 };
console.log(circle);
```

```text
{ radius: 1 }
```

你最常在套件的型別定義（`.d.ts` 檔）裡看到這種寫法，用來把一大堆型別分門別類。看到 `Shapes.Circle` 這種「名稱裡有點」的型別，就知道它是從某個 `namespace` 裡拿出來的。

## 重點整理

- `namespace` 把相關的程式碼包在一個名字底下，用 `名稱.成員` 存取，加了 `export` 的成員外面才拿得到。
- 有值的 `namespace` 會產生物件，Node.js 不能直接執行；新程式碼改用一個檔案一個模組。
- 只有型別的 `namespace` 可以用，常出現在 `.d.ts` 檔裡。
