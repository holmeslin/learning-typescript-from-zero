# 可辨識聯集

## 本集目標

在每種物件裡放一個字面值型別的「標籤」欄位，用它來分辨聯集裡的物件。

## 正文

### 每種形狀都帶一個標籤

要算圓形和長方形的面積。圓形需要半徑，長方形需要寬和高。與其像第 5 集那樣用 `in` 猜「有 `radius` 的應該是圓形」，不如讓每個物件直接說出自己是什麼：

```ts
type Circle = { kind: "circle"; radius: number };
type Rectangle = { kind: "rectangle"; width: number; height: number };
type Shape = Circle | Rectangle;

function area(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
  }
}

console.log(area({ kind: "circle", radius: 1 }).toFixed(2));
console.log(area({ kind: "rectangle", width: 3, height: 4 }));
```

```text
3.14
12
```

關鍵在 `kind` 這個欄位：

- `Circle` 的 `kind` 型別是字面值型別 `"circle"`，`Rectangle` 的是 `"rectangle"`。每一種的值都不一樣。
- `switch (shape.kind)` 判斷到 `case "circle"` 時，TypeScript 知道只有 `Circle` 的 `kind` 會是 `"circle"`，所以在這個 `case` 裡，`shape` 縮小成 `Circle`，可以讀 `radius`。
- `case "rectangle"` 裡也一樣，`shape` 縮小成 `Rectangle`。

這種「聯集裡的每個物件型別，都有一個同名欄位，而且這個欄位是不同的字面值型別」的寫法，叫**可辨識聯集**（discriminated union）。那個用來分辨的欄位（這裡是 `kind`）常見的名字有 `kind`、`type`、`status`。

`switch` 是 JavaScript 本來就有的語法，用 `if (shape.kind === "circle")` 寫也一樣能縮小，只是種類多的時候，`switch` 比較整齊。

### 寫錯資料也會被抓到

標籤除了用來分辨，也讓 TypeScript 能檢查每種物件該有的欄位。建立 `shape.ts`：

```ts,fails
type Circle = { kind: "circle"; radius: number };
type Rectangle = { kind: "rectangle"; width: number; height: number };
type Shape = Circle | Rectangle;

const shape: Shape = { kind: "circle", width: 3 };
console.log(shape);
```

```text
shape.ts:5:40 - error TS2353: Object literal may only specify known properties, and 'width' does not exist in type 'Circle'.

5 const shape: Shape = { kind: "circle", width: 3 };
                                         ~~~~~


Found 1 error in shape.ts:5
```

`kind` 寫了 `"circle"`，TypeScript 就照 `Circle` 的規格檢查：「`Circle` 沒有 `width` 這個屬性」。這是第 3 章學過的多餘屬性檢查。

### 為什麼這麼好用

可辨識聯集適合描述「有好幾種狀態、每種狀態帶的資料不一樣」的東西，例如：

```ts
type LoadState =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; message: string };

function render(state: LoadState) {
  if (state.status === "success") {
    return state.data.join("、");
  }
  if (state.status === "error") {
    return `出錯了：${state.message}`;
  }
  return "載入中……";
}

console.log(render({ status: "success", data: ["蘋果", "香蕉"] }));
console.log(render({ status: "error", message: "網路斷線" }));
```

```text
蘋果、香蕉
出錯了：網路斷線
```

聯集很長的時候，可以像這樣把第一個 `|` 也寫出來，每一種各占一行，比較好讀。

這樣設計的好處是：**不可能出現矛盾的資料**。`"loading"` 的時候不會有 `data`，`"error"` 的時候一定有 `message`。如果改用 `{ isLoading: boolean; data?: string[]; error?: string }` 這種寫法，就可能出現「正在載入，同時又有錯誤訊息」這種說不通的組合。

## 重點整理

- 可辨識聯集：聯集裡的每個物件都有同一個欄位，而且這個欄位的字面值型別各不相同。
- 用 `switch` 或 `if` 判斷這個欄位，TypeScript 會縮小成對應的物件型別。
- 標籤寫好之後，TypeScript 也會照對應的型別檢查物件有沒有寫錯欄位。
- 有好幾種狀態、每種狀態資料不同的東西，最適合用可辨識聯集描述。
