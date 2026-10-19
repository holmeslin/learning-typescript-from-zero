# `Promise.all` 的型別

## 本集目標

用 `Promise.all` 同時等好幾個 `Promise`，並知道每個結果的型別都會被保留。

## 正文

### 依序等，還是同時等

有兩件互不相關的非同步工作時，一個一個 `await` 會比較慢，因為第二件要等第一件做完才開始。建立 `wait.ts`：

```ts
function wait(ms: number, text: string): Promise<string> {
  return new Promise((resolve) => setTimeout(() => resolve(text), ms));
}

console.time("依序");
const a = await wait(300, "甲");
const b = await wait(300, "乙");
console.timeEnd("依序");

console.time("同時");
const [c, d] = await Promise.all([wait(300, "丙"), wait(300, "丁")]);
console.timeEnd("同時");

console.log(a, b, c, d);
```

```text
依序: 602.355ms
同時: 301.115ms
甲 乙 丙 丁
```

`console.time` 和 `console.timeEnd` 會印出中間經過的時間，數字每次執行都會有些微差異。依序等花了兩倍的時間；`Promise.all` 讓兩件工作同時開始，總共只等了一次。

`Promise.all` 收一個裝著 `Promise` 的陣列，等全部完成之後，把結果照原本的順序放進一個陣列回傳。上面用陣列解構，把兩個結果分別拿出來。

### 每個位置的型別都記得

`Promise.all` 裡的 `Promise` 可以是不同的型別。建立 `all.ts`：

```ts
async function getName() {
  return "小明";
}

async function getAge() {
  return 20;
}

const [name, age] = await Promise.all([getName(), getAge()]);
console.log(`${name} 今年 ${age} 歲`);
```

```text
小明 今年 20 歲
```

把游標移到 `name` 上是 `string`，移到 `age` 上是 `number`。TypeScript 不是把結果當成「字串或數字的陣列」，而是記得「第一個是字串、第二個是數字」，就像第 2 章學過的元組。

所以用錯也抓得到。把最後一行改成：

```ts,fails
async function getName() {
  return "小明";
}

async function getAge() {
  return 20;
}

const [name, age] = await Promise.all([getName(), getAge()]);
console.log(age.toUpperCase());
```

```text
all.ts:10:17 - error TS2339: Property 'toUpperCase' does not exist on type 'number'.

10 console.log(age.toUpperCase());
                   ~~~~~~~~~~~


Found 1 error in all.ts:10
```

`age` 是數字，沒有 `toUpperCase`。

### 一個失敗，全部失敗

`Promise.all` 有一個要注意的特性：只要其中一個 `Promise` 失敗，整個 `Promise.all` 就算失敗，其他的結果你都拿不到。失敗的處理方式是 `try...catch`，第 7 集會講 `catch` 抓到的東西是什麼型別。

## 重點整理

- 互不相關的非同步工作，用 `Promise.all` 同時進行，比一個一個 `await` 快。
- `Promise.all` 的結果照原本的順序放在陣列裡，常搭配陣列解構使用。
- 每個位置的型別都會被保留，像元組一樣。
- 其中一個 `Promise` 失敗，整個 `Promise.all` 就失敗。
