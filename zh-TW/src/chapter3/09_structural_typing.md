# 結構型別

## 本集目標

理解 TypeScript 比對物件型別時，只看形狀，不看名字。

## 正文

### 名字不一樣，形狀一樣

建立 `shape.ts`：

```ts
type Point = {
  x: number;
  y: number;
};

type Size = {
  x: number;
  y: number;
};

function show(point: Point) {
  console.log(`(${point.x}, ${point.y})`);
}

const size: Size = { x: 1920, y: 1080 };
show(size);
```

```text
(1920, 1080)
```

`show` 要的是 `Point`，傳進去的卻是 `Size`。兩個型別名字不一樣，但 TypeScript 沒有報錯。

因為 TypeScript 比對物件型別時，**只看屬性**：`Point` 要求有數字的 `x` 和 `y`，`size` 剛好有，那就通過。型別的名字只是方便人閱讀的標籤，不參與比對。這種規則叫**結構型別**（structural typing）。

### 多了沒關係，少了不行

只看屬性，代表「屬性比要求的多」也可以：

```ts,fails
type Point = {
  x: number;
  y: number;
};

function show(point: Point) {
  console.log(`(${point.x}, ${point.y})`);
}

const pixel = { x: 3, y: 4, color: "紅" };
show(pixel);

const flat = { x: 3 };
show(flat);
```

```text
shape.ts:14:6 - error TS2741: Property 'y' is missing in type '{ x: number; }' but required in type 'Point'.

14 show(flat);
        ~~~~

  shape.ts:3:3 - 'y' is declared here.
    3   y: number;
        ~


Found 1 error in shape.ts:14
```

- `pixel` 多了 `color`，沒問題。`show` 只會讀 `x` 和 `y`，`color` 在不在都不影響它。
- `flat` 少了 `y`，被擋下來。`show` 要讀 `point.y`，沒有的話會印出 `undefined`。

這就是上一集「先放進變數就不檢查多餘屬性」的原因：多出來的屬性不會讓程式出錯，少了才會。

### 這樣的好處

結構型別讓你不必事先規劃「誰是誰的一種」。只要形狀對得上，就能直接用：

```ts
type Named = { name: string };

function greet(item: Named) {
  console.log(`你好，${item.name}`);
}

const user = { name: "小明", age: 20 };
const city = { name: "台北", population: 2500000 };

greet(user);
greet(city);
```

```text
你好，小明
你好，台北
```

`user` 和 `city` 完全不相干，也從來沒有寫過「我是一種 `Named`」，但它們都有字串的 `name`，所以都能傳給 `greet`。

這和 JavaScript 平常的寫法很合：JavaScript 的函式本來就不管你傳進來的物件「是什麼」，只管它「有沒有需要的屬性」。TypeScript 只是把這件事寫清楚，並且幫你檢查。

## 重點整理

- TypeScript 比對物件型別時只看屬性，不看型別的名字，這叫結構型別。
- 屬性比要求的多可以，少了就會報錯。
- 不相干的物件只要形狀對得上，就能傳給同一個函式。
