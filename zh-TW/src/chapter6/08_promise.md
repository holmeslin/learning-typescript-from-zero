# `Promise<T>`

## 本集目標

看懂 `Promise<T>` 的型別，正確標註 `async` 函式的回傳型別。

## 正文

### `async` 函式回傳的是 `Promise`

`Promise` 也是一個泛型型別，`T` 是它最後會給你的值的型別。`async` 函式不管 `return` 什麼，實際回傳的都是一個 `Promise`：

```ts
async function getAge() {
  return 20;
}

const promise = getAge();
const age = await promise;
console.log(age + 1);
```

```text
21
```

把游標移到 `promise` 上，會看到 `Promise<number>`；移到 `age` 上，會看到 `number`。`await` 會把 `Promise<number>` 「拆開」，拿出裡面的 `number`。

> 這裡的 `await` 直接寫在檔案最外層，沒有包在 `async` 函式裡。在 `"type": "module"` 的專案裡可以這樣寫，範例會比較短。

### 標註 `async` 函式的回傳型別

要自己寫 `async` 函式的回傳型別時，要寫 `Promise<T>`，不是 `T`。建立 `async.ts`：

```ts,fails
async function getAge(): number {
  return 20;
}

console.log(await getAge());
```

```text
async.ts:1:26 - error TS1064: The return type of an async function or method must be the global Promise<T> type. Did you mean to write 'Promise<number>'?

1 async function getAge(): number {
                           ~~~~~~


Found 1 error in async.ts:1
```

錯誤訊息甚至直接告訴你答案：「你是不是想寫 `Promise<number>`？」改成這樣就對了：

```ts
async function getAge(): Promise<number> {
  return 20;
}

console.log(await getAge());
```

### 自己建立 `Promise`

用 `new Promise` 自己建立 `Promise` 時，TypeScript 常常推論不出裡面的型別。建立 `promise.ts`：

```ts,fails
const p = new Promise((resolve) => resolve(1));
const v = await p;
console.log(v + 1);
```

```text
promise.ts:3:13 - error TS18046: 'v' is of type 'unknown'.

3 console.log(v + 1);
              ~


Found 1 error in promise.ts:3
```

`p` 被推論成 `Promise<unknown>`，所以 `await` 出來的 `v` 是 `unknown`。跟上一集的 `Map` 一樣，在 `new Promise` 後面寫出型別引數就好：

```ts
const p = new Promise<number>((resolve) => resolve(1));
const v = await p;
console.log(v + 1);
```

或者在函式的回傳型別寫清楚，TypeScript 就會照著推論：

```ts
function wait(ms: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`等了 ${ms} 毫秒`), ms);
  });
}

const message = await wait(100);
console.log(message);
```

```text
等了 100 毫秒
```

這裡沒有寫 `new Promise<string>`，因為回傳型別已經說了是 `Promise<string>`，TypeScript 從那裡推論出 `resolve` 要收字串。

處理從網路抓回來的資料、同時等好幾個 `Promise` 時要注意的事，第 10 章會專門講。

## 重點整理

- `Promise<T>` 的 `T` 是 `Promise` 完成後給你的值的型別。
- `async` 函式的回傳型別要寫 `Promise<T>`，寫成 `T` 會出現 TS1064。
- `await` 會把 `Promise<T>` 拆開，拿到 `T`。
- `new Promise` 推論不出型別時，寫成 `new Promise<T>`，或在函式的回傳型別寫清楚。
