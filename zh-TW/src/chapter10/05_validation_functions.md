# 手寫驗證函式

## 本集目標

用型別守衛寫出驗證函式，檢查外部資料是不是符合某個物件型別。

## 正文

### 把檢查包成型別守衛

上一集的四個條件，用第 5 章第 9 集的型別守衛包起來，就變成一個可以到處用的驗證函式。建立 `is-user.ts`：

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

const inputs = [
  '{ "name": "小明", "age": 20 }',
  '{ "name": "小華", "age": "二十" }',
  '{ "name": "小美" }',
];

for (const text of inputs) {
  const data: unknown = JSON.parse(text);
  if (isUser(data)) {
    console.log(`${data.name}：${data.age} 歲`);
  } else {
    console.log(`格式不對：${text}`);
  }
}
```

```text
小明：20 歲
格式不對：{ "name": "小華", "age": "二十" }
格式不對：{ "name": "小美" }
```

幾個重點：

- 參數的型別是 `unknown`，因為這個函式就是用來檢查「還不知道是什麼」的值。
- 回傳型別 `value is User`，讓呼叫的地方在 `if (isUser(data))` 裡把 `data` 縮小成 `User`。
- `User` 的每個屬性都要檢查：有沒有這個屬性、型別對不對。上一集的模式，每個屬性重複一次。

第 2 筆的 `age` 是字串，第 3 筆沒有 `age`，都被擋了下來。第 3 集那個 `toFixed is not a function` 的錯誤，在這裡不會發生。

### 型別守衛不會檢查你

第 5 章提醒過：TypeScript **不會檢查**型別守衛的判斷寫得對不對。如果 `User` 加了一個 `email` 屬性，`isUser` 卻忘了跟著改，TypeScript 不會報錯，它會繼續相信 `isUser`，把沒有 `email` 的資料當成 `User`。

所以改了型別，就要記得回頭改驗證函式。這是手寫驗證最大的缺點，附錄會介紹用 Zod 自動產生驗證的做法。

### 檢查陣列

外部資料常常是一個陣列。用 `Array.isArray` 確認是陣列，再用 `every` 確認每一個元素：

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

function isUserList(value: unknown): value is User[] {
  return Array.isArray(value) && value.every(isUser);
}

const text =
  '[{ "name": "小明", "age": 20 }, { "name": "小華", "age": 22 }]';
const data: unknown = JSON.parse(text);

if (isUserList(data)) {
  console.log(`共 ${data.length} 位使用者`);
}
```

```text
共 2 位使用者
```

`value.every(isUser)` 把 `isUser` 當成 callback 傳進去，每個元素都通過才回傳 `true`。

要注意一件事：`Array.isArray` 會把 `unknown` 縮小成 `any[]`，不是 `unknown[]`。也就是說，`Array.isArray(value)` 之後，陣列**裡面的元素**又變回不檢查的 `any` 了。所以一定要接著用 `every` 或 `filter` 檢查每個元素，不能只確認「是陣列」就直接用。

### 只留下合格的資料

有時候你不想因為一筆壞資料就整批丟掉，而是想把合格的留下來。`filter` 搭配型別守衛，結果的型別會自動變成 `User[]`：

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

const data: unknown = JSON.parse(
  '[{ "name": "小明", "age": 20 }, { "name": "小華" }]',
);

if (Array.isArray(data)) {
  const users = data.filter(isUser);
  for (const user of users) {
    console.log(`${user.name}：${user.age} 歲`);
  }
}
```

```text
小明：20 歲
```

把游標移到 `users` 上，型別是 `User[]`。

## 重點整理

- 驗證函式寫成型別守衛：參數是 `unknown`，回傳型別是 `value is 型別`。
- 物件型別的每個屬性都要檢查存在與型別。
- 陣列用 `Array.isArray` 加 `every` 或 `filter` 檢查，`Array.isArray` 之後元素是 `any`，不能省略。
- TypeScript 不會檢查驗證函式寫得對不對，改了型別要記得改驗證函式。
