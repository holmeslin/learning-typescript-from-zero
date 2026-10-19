# 用 `typeof` 取得型別

## 本集目標

用 `typeof` 從一個值取得它的型別，不必把型別再寫一遍。

## 正文

### 型別已經寫在值裡了

假設你有一份預設設定：

```ts
const defaultSettings = {
  theme: "light",
  fontSize: 16,
  showSidebar: true,
};

console.log(defaultSettings);
```

使用者的設定應該和預設設定長得一樣。照前面學的，你得替它寫一個型別：

```ts
type Settings = {
  theme: string;
  fontSize: number;
  showSidebar: boolean;
};

const mySettings: Settings = {
  theme: "dark",
  fontSize: 18,
  showSidebar: false,
};

console.log(mySettings);
```

但這個型別和 `defaultSettings` 的內容根本是同一件事，寫了兩遍。哪天在 `defaultSettings` 加了一個屬性，還得記得回來改型別。

### 在型別的位置寫 `typeof`

建立 `settings.ts`：

```ts,fails
const defaultSettings = {
  theme: "light",
  fontSize: 16,
  showSidebar: true,
};

type Settings = typeof defaultSettings;

const mySettings: Settings = {
  theme: "dark",
  fontSize: "大",
  showSidebar: false,
};
console.log(mySettings);
```

`type Settings = typeof defaultSettings` 的意思是：「`Settings` 就是 `defaultSettings` 這個變數的型別」。TypeScript 本來就推論出 `defaultSettings` 的型別了，`typeof` 只是把它拿出來、取個名字。

`fontSize` 放了字串，被擋下來了：

```text
settings.ts:11:3 - error TS2322: Type 'string' is not assignable to type 'number'.

11   fontSize: "大",
     ~~~~~~~~

  settings.ts:3:3 - The expected type comes from property 'fontSize' which is declared here on type '{ theme: string; fontSize: number; showSidebar: boolean; }'
    3   fontSize: 16,
        ~~~~~~~~~~~~


Found 1 error in settings.ts:11
```

第二段補充說明寫得很清楚：「預期的型別來自 `fontSize` 屬性，它宣告在 `{ theme: string; fontSize: number; showSidebar: boolean; }` 這個型別上」。這就是 `typeof` 拿到的型別，跟你手寫的一模一樣。

之後在 `defaultSettings` 加屬性，`Settings` 會自動跟著變。

### 兩種 `typeof`

你在第 5 章用過 `typeof` 做型別縮小：

```ts
function show(value: string | number) {
  if (typeof value === "string") {
    console.log(`字串：${value}`);
  } else {
    console.log(`數字：${value}`);
  }
}

show("你好");
show(42);
```

這兩個 `typeof` 長得一樣，但做的事情不同：

| 寫在哪裡 | 什麼時候算 | 得到什麼 |
| --- | --- | --- |
| 程式碼裡，例如 `if (typeof x === "string")` | 執行時 | 一個字串，例如 `"string"`、`"number"` |
| 型別的位置，例如 `type T = typeof x` | 檢查時 | 一個 TypeScript 型別 |

分辨的方法很簡單：**看它寫在哪裡**。寫在 `type ... =` 後面、冒號後面這些放型別的位置，就是取型別的 `typeof`。它在執行時跟其他型別一樣會被拿掉。

### `typeof` 也能用在函式上

```ts
function formatPrice(price: number) {
  return `${price} 元`;
}

type Formatter = typeof formatPrice;

const formatWithTax: Formatter = (price) => `${price * 1.05} 元`;
console.log(formatWithTax(100));
```

```text
105 元
```

`Formatter` 是 `(price: number) => string`，就是第 4 章學過的函式型別。`formatWithTax` 標了這個型別，參數 `price` 自動就是 `number`，不用再寫。

## 重點整理

- 在型別的位置寫 `typeof 變數`，可以取得那個變數的型別。
- 從值取得型別，就不必把型別再寫一遍，值改了型別會跟著變。
- 寫在程式碼裡的 `typeof` 是執行時的 JavaScript；寫在型別位置的 `typeof` 是檢查時的 TypeScript。
- `typeof` 也能用在函式上，取得函式的型別。
