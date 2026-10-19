# `catch` 拿到的是 `unknown`

## 本集目標

知道 `catch` 抓到的錯誤為什麼是 `unknown`，並用 `instanceof Error` 安全地讀出錯誤訊息。

## 正文

### 直接讀 `message` 會被擋

`JSON.parse` 碰到格式不對的字串會丟出錯誤。用 `try...catch` 接住它，再印出錯誤訊息。建立 `catch.ts`：

```ts,fails
try {
  JSON.parse("{ name: 小明 }");
} catch (error) {
  console.log(error.message);
}
```

用 Node.js 執行，結果是對的：

```text
Expected property name or '}' in JSON at position 2 (line 1 column 3)
```

但 `npx tsc` 不讓你這樣寫：

```text
catch.ts:4:15 - error TS18046: 'error' is of type 'unknown'.

4   console.log(error.message);
                ~~~~~


Found 1 error in catch.ts:4
```

`catch` 抓到的 `error`，型別是 `unknown`。

### 為什麼是 `unknown`

因為 JavaScript 的 `throw` 什麼都能丟，不一定是 `Error` 物件：

```ts
try {
  throw "出事了";
} catch (error) {
  console.log(error);
}
```

```text
出事了
```

這裡丟出去的是一個字串，字串沒有 `message`。你自己的程式碼可能很守規矩，只丟 `Error`；但 `try` 裡面呼叫的函式庫、別人寫的程式碼丟出什麼，TypeScript 沒辦法知道。所以它把 `error` 當成 `unknown`，要你檢查過再用。這是 `tsconfig.json` 裡 `"strict": true` 打開的其中一項檢查。

也不能直接把它標成 `Error`：

```ts,fails
try {
  JSON.parse("{ name: 小明 }");
} catch (error: Error) {
  console.log(error.message);
}
```

```text
catch.ts:3:17 - error TS1196: Catch clause variable type annotation must be 'any' or 'unknown' if specified.

3 } catch (error: Error) {
                  ~~~~~


Found 1 error in catch.ts:3
```

「`catch` 的變數如果要標型別，只能是 `any` 或 `unknown`」。標成 `any` 等於關掉檢查，不要這樣做。

### 用 `instanceof Error` 縮小

第 5 章第 6 集學過，`instanceof Error` 可以把型別縮小成 `Error`。把它寫成一個小函式，以後每個 `catch` 都能用：

```ts
function describeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

try {
  JSON.parse("{ name: 小明 }");
} catch (error) {
  console.log(`解析失敗：${describeError(error)}`);
}

try {
  throw "出事了";
} catch (error) {
  console.log(`發生錯誤：${describeError(error)}`);
}
```

```text
解析失敗：Expected property name or '}' in JSON at position 2 (line 1 column 3)
發生錯誤：出事了
```

- 是 `Error` 物件，就讀它的 `message`。
- 不是的話，用 `String(...)` 把它轉成文字。不管丟出來的是什麼，都不會讓程式在處理錯誤的時候又出錯。

### 接住上一集的錯誤

上一集的 `loadUser` 在狀態碼不對、資料格式不對時會丟出錯誤。搭配 `describeError`：

```ts
type User = { name: string; age: number };

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    typeof value.name === "string" &&
    "age" in value &&
    typeof value.age === "number"
  );
}

async function loadUser(res: Response): Promise<User> {
  if (!res.ok) {
    throw new Error(`伺服器回應 ${res.status}`);
  }
  const data: unknown = await res.json();
  if (!isUser(data)) {
    throw new Error("資料格式不對");
  }
  return data;
}

function describeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

const responses = [
  new Response(JSON.stringify({ name: "小明", age: 20 })),
  new Response("找不到", { status: 404 }),
  new Response(JSON.stringify({ name: "小華" })),
];

for (const res of responses) {
  try {
    const user = await loadUser(res);
    console.log(`${user.name}：${user.age} 歲`);
  } catch (error) {
    console.log(`讀取失敗：${describeError(error)}`);
  }
}
```

```text
小明：20 歲
讀取失敗：伺服器回應 404
讀取失敗：資料格式不對
```

三種情況各走各的路，沒有一種會讓程式當掉。

## 重點整理

- `catch` 抓到的錯誤，型別是 `unknown`，因為 `throw` 什麼都能丟。
- `catch` 的變數只能標成 `any` 或 `unknown`，不能標成 `Error`。
- 用 `error instanceof Error` 縮小之後，才能讀 `message`。
- 不是 `Error` 的情況，用 `String(error)` 轉成文字。
