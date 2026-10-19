# `async` 函式與忘了 `await`

## 本集目標

寫出 `async` 函式的回傳型別，並看懂「忘了寫 `await`」時 TypeScript 給的提示。

## 正文

### 複習：回傳型別是 `Promise<T>`

第 6 章第 8 集講過，`async` 函式不管 `return` 什麼，實際回傳的都是 `Promise`，所以回傳型別要寫成 `Promise<T>`：

```ts
async function getPrice(): Promise<number> {
  return 100;
}

const price = await getPrice();
console.log(price + 1);
```

```text
101
```

`async` 函式什麼都不回傳時，回傳型別是 `Promise<void>`。`void` 是第 4 章學過的「沒有回傳值」，外面包一層 `Promise`：

```ts
async function logLater(text: string): Promise<void> {
  console.log(text);
}

await logLater("你好");
```

```text
你好
```

箭頭函式也一樣，回傳型別寫在小括號後面：

```ts
const getName = async (): Promise<string> => "小明";
console.log(await getName());
```

```text
小明
```

### 最常見的錯：忘了 `await`

寫非同步程式最常犯的錯，是忘了寫 `await`。建立 `forget.ts`：

```ts,fails
async function getPrice(): Promise<number> {
  return 100;
}

const price = getPrice();
console.log(price + 1);
```

先用 Node.js 執行：

```bash
node forget.ts
```

```text
[object Promise]1
```

`price` 拿到的不是 `100`，而是一個還沒完成的 `Promise` 物件。`Promise` 加上 `1`，JavaScript 把它轉成字串 `"[object Promise]"` 再接上 `1`。沒有錯誤訊息，只有一個奇怪的結果。

`npx tsc` 就不一樣了：

```text
forget.ts:6:13 - error TS2365: Operator '+' cannot be applied to types 'Promise<number>' and '1'.

6 console.log(price + 1);
              ~~~~~~~~~

  forget.ts:6:13 - Did you forget to use 'await'?
    6 console.log(price + 1);
                  ~~~~~~~~~


Found 1 error in forget.ts:6
```

第一句說「`+` 不能用在 `Promise<number>` 和 `1` 上」，下面的補充說明更直接：「你是不是忘了寫 `await`？」

讀物件屬性時也會出現一樣的提示。建立 `forget-user.ts`：

```ts,fails
type User = { name: string };

async function getUser(): Promise<User> {
  return { name: "小明" };
}

const user = getUser();
console.log(user.name);
```

```text
forget-user.ts:8:18 - error TS2339: Property 'name' does not exist on type 'Promise<User>'.

8 console.log(user.name);
                   ~~~~

  forget-user.ts:8:18 - Did you forget to use 'await'?
    8 console.log(user.name);
                       ~~~~


Found 1 error in forget-user.ts:8
```

「`Promise<User>` 沒有 `name` 這個屬性」。在 JavaScript 裡，這行只會安靜地印出 `undefined`。

所以只要錯誤訊息裡出現 `Promise<...>`，又跟你預期的型別不一樣，第一個懷疑的就是：**是不是少寫了 `await`？**

看完記得把兩個檔案改對或刪掉。

## 重點整理

- `async` 函式的回傳型別是 `Promise<T>`；什麼都不回傳時是 `Promise<void>`。
- 忘了寫 `await`，拿到的會是 `Promise` 物件本身，JavaScript 不會報錯。
- TypeScript 會指出型別對不上，還會補一句 `Did you forget to use 'await'?`。
- 錯誤訊息裡出現意料之外的 `Promise<...>`，先檢查是不是少了 `await`。
