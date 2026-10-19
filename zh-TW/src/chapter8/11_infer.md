# `infer` 入門

## 本集目標

看得懂條件型別裡的 `infer`，知道 `ReturnType` 是怎麼寫出來的。

## 正文

這一集一樣是「入門就好」。

### 在條件裡「抓出」一部分型別

上一集的條件型別只能回答「是不是」。如果想要的是「如果 `T` 是陣列，**裡面放的是什麼**」，就需要 `infer`。建立 `infer.ts`：

```ts,fails
type ElementOf<T> = T extends (infer U)[] ? U : never;

const a: ElementOf<string[]> = "小明";
const b: ElementOf<number[]> = "小明";
console.log(a, b);
```

`T extends (infer U)[] ? U : never` 讀作：「如果 `T` 是某種東西的陣列，把那種東西取名叫 `U`，結果是 `U`；否則是 `never`」。

`infer U` 就像在型別裡挖一個洞：TypeScript 比對的時候，會自己推論出洞裡應該填什麼，然後你就可以在 `?` 後面使用它。

- `ElementOf<string[]>`：`string[]` 是 `string` 的陣列，`U` 是 `string`。
- `ElementOf<number[]>`：`U` 是 `number`，所以 `b` 報錯了。

```text
infer.ts:4:7 - error TS2322: Type 'string' is not assignable to type 'number'.

4 const b: ElementOf<number[]> = "小明";
        ~


Found 1 error in infer.ts:4
```

`infer` 只能寫在條件型別 `extends` 的右邊。

### `ReturnType` 是這樣寫出來的

第 8 集用過的 `ReturnType`，就是用 `infer` 寫的。這裡自己寫一個 `MyReturnType`，建立 `myreturn.ts`：

```ts,fails
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getTitle() {
  return "從零開始學 TypeScript";
}

const title: MyReturnType<typeof getTitle> = 123;
console.log(title);
```

把條件拆開讀：

- `(...args: any[]) => infer R`：一個函式，參數是什麼都可以，回傳型別取名叫 `R`。
- 如果 `T` 是這樣的函式，結果是 `R`，也就是它的回傳型別。

`getTitle` 回傳字串，所以 `MyReturnType<typeof getTitle>` 是 `string`：

```text
myreturn.ts:7:7 - error TS2322: Type 'number' is not assignable to type 'string'.

7 const title: MyReturnType<typeof getTitle> = 123;
        ~~~~~


Found 1 error in myreturn.ts:7
```

`any[]` 在這裡是少數合理使用 `any` 的地方：意思是「參數是什麼都無所謂」，因為我們只關心回傳型別。

內建的 `Parameters` 是同一個想法，只是把 `infer` 放在參數的位置：`T extends (...args: infer P) => any ? P : never`。

### 讀函式庫型別的訣竅

看到 `infer`，就找它在比對什麼形狀、把哪一部分取了名字，再看 `?` 後面怎麼用那個名字。大部分的 `infer` 都是在做「從某個型別裡拆出一塊」：陣列的元素、函式的回傳值、`Promise` 裡的值。

## 重點整理

- `infer` 寫在條件型別的 `extends` 右邊，讓 TypeScript 推論出某一部分的型別並取名字。
- `T extends (infer U)[] ? U : never` 可以取出陣列元素的型別。
- `ReturnType`、`Parameters` 都是用 `infer` 寫出來的。
- `infer` 是入門就好：看得懂函式庫的定義就夠了。
