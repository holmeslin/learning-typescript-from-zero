# 預設型別參數

## 本集目標

幫型別參數設定預設值，讓常用的情況可以省略不寫。

## 正文

### 跟參數的預設值一樣

函式的參數可以有預設值，型別參數也可以：

```ts
type ApiResponse<T = string> = {
  status: number;
  data: T;
};

const a: ApiResponse = { status: 200, data: "成功" };
const b: ApiResponse<number[]> = { status: 200, data: [1, 2] };

console.log(a, b);
```

```text
{ status: 200, data: '成功' } { status: 200, data: [ 1, 2 ] }
```

`T = string` 的意思是「沒有指定的話，`T` 就是 `string`」。所以：

- `ApiResponse` 等於 `ApiResponse<string>`。
- `ApiResponse<number[]>` 照你指定的，`data` 是 `number[]`。

上一集說過，使用泛型型別時型別引數不能省略。有了預設值之後，就可以省略了。

### 什麼時候用

當某個泛型型別「大部分時候都用同一種型別」，就適合加預設值。使用的人在常見情況下少寫一點，特殊情況再自己指定。

預設值也可以和約束一起用，約束寫在前面：

```ts
type Named<T extends { name: string } = { name: string }> = {
  items: T[];
};

const list: Named = { items: [{ name: "小明" }] };
console.log(list.items[0].name);
```

### 有預設值的要放後面

跟函式參數一樣，有預設值的型別參數要放在沒有預設值的後面。建立 `order.ts`：

```ts,fails
type Pair<A = string, B> = { first: A; second: B };

const p: Pair<string, number> = { first: "a", second: 1 };
console.log(p);
```

```text
order.ts:1:23 - error TS2706: Required type parameters may not follow optional type parameters.

1 type Pair<A = string, B> = { first: A; second: B };
                        ~


Found 1 error in order.ts:1
```

「必填的型別參數不能放在選填的後面」。把 `B` 移到前面，或也給 `B` 一個預設值，錯誤就消失了。

## 重點整理

- 型別參數可以用 `<T = 型別>` 設定預設值。
- 有預設值的型別參數，使用時可以省略不寫。
- 預設值可以和約束一起用，寫成 `<T extends 約束 = 預設>`。
- 有預設值的型別參數要放在沒有預設值的後面。
