# 型別參數的推論

## 本集目標

知道 TypeScript 怎麼推論出型別參數，以及什麼時候要自己寫型別引數。

## 正文

### 從引數推論

呼叫泛型函式時，你幾乎不用寫 `<string>` 這種型別引數，TypeScript 會從你傳的引數推論出來：

```ts
function first<T>(items: T[]): T {
  return items[0];
}

const price = first([120, 80]);
console.log(price.toFixed(0));
```

在 VS Code 裡把游標移到 `first` 上面，會看到：

```text
function first<number>(items: number[]): number
```

TypeScript 看到你傳了 `number[]`，就把 `T` 定成 `number`。這跟第 1 章的型別推論是一樣的道理，只是推論的對象換成了型別參數。

### 推論出來的型別會被檢查

同一個 `T` 出現在好幾個參數時，它們必須一致。建立 `same.ts`：

```ts,fails
function same<T>(a: T, b: T): boolean {
  return a === b;
}

console.log(same(1, "1"));
```

```text
same.ts:5:21 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

5 console.log(same(1, "1"));
                      ~~~


Found 1 error in same.ts:5
```

TypeScript 從第一個引數 `1` 把 `T` 定成 `number`，第二個引數 `"1"` 就對不上了。這正是泛型的用處：它記得兩個參數「要是同一種型別」。

如果你真的想讓它同時收數字和字串，就明確寫出型別引數：

```ts
function same<T>(a: T, b: T): boolean {
  return a === b;
}

console.log(same<number | string>(1, "1"));
```

```text
false
```

### 沒東西可以推論的時候

有些泛型函式的參數裡根本沒有 `T`，TypeScript 就沒有線索可以推論。建立 `list.ts`：

```ts,fails
function createList<T>(): T[] {
  return [];
}

const names = createList();
names.push("小明");
console.log(names[0].toUpperCase());
```

```text
list.ts:7:13 - error TS2571: Object is of type 'unknown'.

7 console.log(names[0].toUpperCase());
              ~~~~~~~~


Found 1 error in list.ts:7
```

推論不出來的時候，`T` 會變成 `unknown`，所以 `names` 是 `unknown[]`。第 2 章學過，`unknown` 的值在檢查之前什麼都不能做。

這時就要自己寫型別引數：

```ts
function createList<T>(): T[] {
  return [];
}

const names = createList<string>();
names.push("小明");
console.log(names[0].toUpperCase());
```

### 規則

跟變數的型別標註一樣：**推論得出來就交給推論，推論不出來才寫。** 呼叫泛型函式時，如果結果變成 `unknown` 或不是你要的型別，就在函式名稱後面補上 `<型別>`。

## 重點整理

- 呼叫泛型函式時，TypeScript 會從引數推論出型別參數。
- 同一個型別參數出現在好幾個地方，推論出來的型別必須一致。
- 沒有線索可以推論時，型別參數會變成 `unknown`。
- 推論不出來或不是你要的型別時，才自己寫型別引數。
