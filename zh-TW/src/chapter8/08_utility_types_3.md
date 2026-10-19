# 工具型別（三）：從函式取出型別

## 本集目標

用 `ReturnType`、`Parameters`、`Awaited` 從函式取得回傳值和參數的型別。

## 正文

第 1 集學過用 `typeof` 取得函式的型別。這一集的工具型別，可以再從函式型別裡拆出回傳值和參數。

### `ReturnType`：回傳值的型別

建立 `return.ts`：

```ts,fails
function createUser(name: string, age: number) {
  return { id: Date.now(), name, age, createdAt: new Date() };
}

type User = ReturnType<typeof createUser>;

const user: User = createUser("小明", 20);
console.log(user.email);
```

`ReturnType<typeof createUser>` 要從裡面往外讀：

1. `typeof createUser` 取得函式的型別。
2. `ReturnType<...>` 取出這個函式回傳值的型別。

`createUser` 沒有寫回傳型別，是 TypeScript 推論出來的。用 `ReturnType`，就能把這個推論出來的型別拿來用，取名叫 `User`：

```text
return.ts:8:18 - error TS2339: Property 'email' does not exist on type '{ id: number; name: string; age: number; createdAt: Date; }'.

8 console.log(user.email);
                   ~~~~~


Found 1 error in return.ts:8
```

錯誤訊息印出了 `User` 的內容，就是 `createUser` 回傳的那個物件的型別。

注意角括號裡要放**型別**，所以 `typeof` 不能省。寫成 `ReturnType<createUser>` 會報錯，因為 `createUser` 是值，不是型別。

這在使用別人寫的函式庫時特別有用：有些函式庫只匯出函式、沒有匯出回傳值的型別，你就可以用 `ReturnType` 自己取出來。

### `Parameters`：參數的型別

`Parameters` 取出參數的型別，結果是一個元組。建立 `params.ts`：

```ts,fails
function createUser(name: string, age: number) {
  return { id: Date.now(), name, age, createdAt: new Date() };
}

type CreateUserArgs = Parameters<typeof createUser>;

const args: CreateUserArgs = ["小華", "二十"];
console.log(args);
```

`CreateUserArgs` 是 `[name: string, age: number]`，第 2 章學過的元組。第二個位置要放數字：

```text
params.ts:7:37 - error TS2322: Type 'string' is not assignable to type 'number'.

7 const args: CreateUserArgs = ["小華", "二十"];
                                      ~~~~


Found 1 error in params.ts:7
```

只想要某一個參數的型別，就用第 3 集的索引存取：`Parameters<typeof createUser>[0]` 是 `string`。

### `Awaited`：拆開 `Promise`

`async` 函式的回傳型別是第 6 章學過的 `Promise<T>`，所以 `ReturnType` 拿到的是 `Promise`，不是裡面的值。建立 `awaited.ts`：

```ts,fails
async function loadScore() {
  return 95;
}

type LoadResult = ReturnType<typeof loadScore>;
type Score = Awaited<LoadResult>;

const a: LoadResult = 95;
const b: Score = 95;
console.log(a, b);
```

```text
awaited.ts:8:7 - error TS2322: Type 'number' is not assignable to type 'Promise<number>'.

8 const a: LoadResult = 95;
        ~


Found 1 error in awaited.ts:8
```

- `LoadResult` 是 `Promise<number>`，數字放不進去。
- `Awaited<LoadResult>` 把 `Promise` 拆開，得到 `number`，所以 `b` 沒有錯誤。

`Awaited` 的名字來自 `await`：「`await` 之後會拿到什麼型別」。常見的寫法是兩個疊在一起：`Awaited<ReturnType<typeof 某個async函式>>`。

## 重點整理

- `ReturnType<typeof 函式>` 取得函式回傳值的型別。
- `Parameters<typeof 函式>` 取得參數的型別，結果是元組。
- 角括號裡要放型別，所以函式名稱前面要加 `typeof`。
- `Awaited<T>` 把 `Promise` 拆開，取得 `await` 之後的型別。
