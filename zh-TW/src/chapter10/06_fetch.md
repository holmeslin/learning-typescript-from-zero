# `fetch` 回應的型別

## 本集目標

看懂 `fetch` 回傳的 `Response` 型別，寫出一個會檢查狀態碼和資料格式的讀取函式。

## 正文

### 不依賴網路的練習方式

`fetch` 會連上網路，向伺服器要資料。但練習的時候，網址可能失效、網路可能不通、伺服器的資料可能隨時改變，範例的結果就會跟書上不一樣。

所以這一章用 `new Response(...)` 假裝收到了伺服器的回應。`Response` 就是 `fetch` 回傳的那種物件，Node.js 內建，不用另外安裝：

```ts
// 真實情況：const res = await fetch("https://example.com/api/user");
const res = new Response(JSON.stringify({ name: "小明", age: 20 }));

console.log(res.status, res.ok);
console.log(await res.json());
```

```text
200 true
{ name: '小明', age: 20 }
```

`new Response` 的第一個參數是回應的內容，這裡用 `JSON.stringify` 把物件轉成 JSON 字串。寫真正的程式時，把 `new Response(...)` 那一行換成註解裡的 `await fetch(網址)` 就好，後面的程式碼完全不用改。

### `Response` 有哪些型別

把游標移到 `res` 上，型別是 `Response`。常用的幾個成員：

| 成員 | 型別 | 意思 |
| --- | --- | --- |
| `res.ok` | `boolean` | 狀態碼是不是 200～299 |
| `res.status` | `number` | 狀態碼，例如 `200`、`404` |
| `res.json()` | `Promise<any>` | 把內容當成 JSON 解析 |
| `res.text()` | `Promise<string>` | 把內容當成文字讀出來 |

注意 `res.json()` 的型別：`Promise<any>`。跟 `JSON.parse` 一樣，TypeScript 不知道伺服器會傳什麼回來，所以 `await res.json()` 拿到的是 `any`。第 3 集的陷阱在這裡完全一樣，處理方式也一樣：**放進 `unknown`，再用驗證函式檢查**。

### 寫一個安全的讀取函式

把狀態碼的檢查和資料的驗證放在一起。建立 `load-user.ts`：

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

const res = new Response(JSON.stringify({ name: "小明", age: 20 }));
const user = await loadUser(res);
console.log(`${user.name}：${user.age} 歲`);
```

```text
小明：20 歲
```

`loadUser` 收一個 `Response`，有兩道關卡：

1. **狀態碼。** `res.ok` 是 `false` 時，例如 `404`（找不到）或 `500`（伺服器出錯），內容通常不是你要的資料，直接丟出錯誤。
2. **資料格式。** `res.json()` 的結果放進 `unknown`，用 `isUser` 檢查，不合格也丟出錯誤。

兩道關卡都過了，`data` 已經縮小成 `User`，可以直接 `return`。函式的回傳型別寫 `Promise<User>`，呼叫的人 `await` 之後拿到的就是貨真價實檢查過的 `User`。

> 真實的程式通常會讓函式收網址，在裡面呼叫 `fetch`。這裡讓函式收一個 `Response`，是為了方便用 `new Response` 練習。

### 試試失敗的情況

`new Response` 的第二個參數可以設定狀態碼。把 `load-user.ts` 最後三行換掉，模擬伺服器回應 `404`：

```ts,ignore
const res = new Response("找不到", { status: 404 });
const user = await loadUser(res);
console.log(`${user.name}：${user.age} 歲`);
```

執行時，程式會在 `throw` 的地方停下來，印出 `Error: 伺服器回應 404` 和一長串錯誤位置。丟出去的錯誤要怎麼接住、接住之後是什麼型別，是下一集的主題。

## 重點整理

- 練習時用 `new Response(...)` 模擬伺服器回應，換成 `await fetch(網址)` 就是真實的程式。
- `res.ok` 和 `res.status` 用來檢查狀態碼，不正常時不要去讀內容。
- `res.json()` 的型別是 `Promise<any>`，結果要放進 `unknown` 再驗證。
- 檢查都通過之後再回傳，函式的回傳型別才是可以相信的。
