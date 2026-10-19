# `type` 與 `interface`

## 本集目標

認識定義物件型別的另一種寫法 `interface`，知道它和 `type` 的差別。

## 正文

### 另一種寫法

除了 `type`，TypeScript 還有一個專門用來定義物件形狀的關鍵字 `interface`。建立 `pet.ts`：

```ts
interface Pet {
  name: string;
  age: number;
}

const cat: Pet = { name: "咪咪", age: 3 };
console.log(cat.name);
```

這和下面的寫法效果一樣：

```ts
type Pet = {
  name: string;
  age: number;
};

const cat: Pet = { name: "咪咪", age: 3 };
console.log(cat.name);
```

寫法上只差兩個地方：

- `interface` 後面直接接名稱和大括號，**沒有等號**。
- `interface` 結尾不用分號；`type` 是一個敘述，結尾習慣加分號。

`interface` 中文叫**介面**。用起來和 `type` 定義的物件型別完全一樣，可以標在變數、參數、回傳值上。

### 差別一：`type` 什麼都能取名，`interface` 只能描述物件

`type` 是「替任何型別取名字」，所以不只物件，聯集、字串都可以：

```ts
type Status = string | null;

interface Pet {
  name: string;
  status: Status;
}

const cat: Pet = { name: "咪咪", status: null };
console.log(cat);
```

`string | null` 不是物件，只能用 `type` 取名。`interface` 只能用來描述物件的形狀。

### 差別二：同名的 `interface` 會合併

同一個名稱的 `interface` 寫兩次，TypeScript 會把它們**合併**成一個：

```ts
interface Pet {
  name: string;
}

interface Pet {
  age: number;
}

const cat: Pet = { name: "咪咪", age: 3 };
console.log(cat);
```

`Pet` 同時有 `name` 和 `age`。這個功能主要是給函式庫用的，讓別人可以替既有的型別補上新的屬性。你自己寫程式時很少需要它。

同名的 `type` 寫兩次則會報錯：

```ts,fails
type Pet = {
  name: string;
};

type Pet = {
  age: number;
};
```

```text
pet.ts:1:6 - error TS2300: Duplicate identifier 'Pet'.

1 type Pet = {
       ~~~

pet.ts:5:6 - error TS2300: Duplicate identifier 'Pet'.

5 type Pet = {
       ~~~


Found 2 errors in the same file, starting at: pet.ts:1
```

「`Pet` 這個名稱重複了」。

### 該用哪一個

描述物件時，兩個都可以，大部分情況下效果一模一樣。很多團隊會訂下「統一用其中一種」的規則，照團隊的習慣就好。

這本書的習慣是：**物件型別用 `type`**，因為它什麼型別都能取名，不用另外記規則。你在別人的程式碼或函式庫裡看到 `interface`，知道它是同一件事就好。之後在第 7 章講類別時，會再遇到 `interface`。

## 重點整理

- `interface 名稱 { ... }` 是定義物件型別的另一種寫法，沒有等號。
- `type` 可以替任何型別取名，`interface` 只能描述物件。
- 同名的 `interface` 會自動合併，同名的 `type` 會報錯。
- 這本書的物件型別一律用 `type`，看到 `interface` 知道是同一件事就好。
