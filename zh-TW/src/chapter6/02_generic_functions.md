# 泛型函式

## 本集目標

學會宣告和呼叫泛型函式，包括多個型別參數和箭頭函式的寫法。

## 正文

### 拆解寫法

建立 `generic.ts`：

```ts
function first<T>(items: T[]): T {
  return items[0];
}

console.log(first([10, 20, 30]));
```

```text
10
```

逐一看：

| 部分 | 意思 |
| --- | --- |
| `<T>` | 宣告一個型別參數，名字叫 `T` |
| `items: T[]` | 參數是「`T` 的陣列」 |
| `: T` | 回傳一個 `T` |

可以把它跟普通的參數對照著看：`items` 是「值的參數」，呼叫時傳進一個值；`T` 是「型別的參數」，呼叫時決定一個型別。宣告了 `T` 之後，就能在參數、回傳型別和函式內容裡使用它。

`T` 只是習慣用的名字，取自 type 的第一個字母，換成別的名字也可以。你會常看到 `T`、`U`、`K`（key）、`V`（value）這種單一大寫字母，型別參數有特定意思時，也可以取完整的名字，例如 `Item`。

> 陣列是空的時候，`items[0]` 其實會拿到 `undefined`，但這裡的型別說它是 `T`。TypeScript 預設不檢查這種情況，第 9 章會介紹怎麼打開這項檢查。

### 自己指定型別參數

呼叫時可以在函式名稱後面用角括號，明確寫出 `T` 是什麼。寫在這裡的型別叫**型別引數**（type argument），就像傳給參數的值叫引數一樣：

```ts
function first<T>(items: T[]): T {
  return items[0];
}

const name = first<string>(["小明", "小華"]);
console.log(name);
```

大部分時候不用寫，TypeScript 會自己推論出來，下一集會講。

### 多個型別參數

型別參數可以有好幾個，用逗號隔開：

```ts
function pair<A, B>(first: A, second: B): [A, B] {
  return [first, second];
}

const p = pair("小明", 20);
console.log(p);
```

```text
[ '小明', 20 ]
```

`[A, B]` 是第 2 章學過的元組。`A` 推論成 `string`、`B` 推論成 `number`，所以 `p` 的型別是 `[string, number]`。

### 箭頭函式的寫法

箭頭函式把 `<T>` 放在參數的小括號前面：

```ts
const last = <T>(items: T[]): T => items[items.length - 1];

console.log(last(["甲", "乙", "丙"]));
```

```text
丙
```

### 泛型的資料可以傳下去

型別參數也可以傳給函式裡用到的其他型別。例如把任何值包成一個陣列：

```ts
function repeat<T>(value: T, times: number): T[] {
  const result: T[] = [];
  for (let i = 0; i < times; i++) {
    result.push(value);
  }
  return result;
}

console.log(repeat("哈", 3));
```

```text
[ '哈', '哈', '哈' ]
```

函式裡的 `result: T[]`，和回傳型別的 `T[]` 是同一個 `T`。

## 重點整理

- 泛型函式在名稱後面用 `<T>` 宣告型別參數，之後就能在參數、回傳型別和內容裡用 `T`。
- 呼叫時可以用 `first<string>(...)` 明確寫出型別引數。
- 型別參數可以有好幾個，例如 `<A, B>`。
- 箭頭函式把 `<T>` 寫在參數的小括號前面。
