# 把外部資料當成 `unknown`

## 本集目標

把外部資料放進 `unknown`，再用型別縮小一步一步確認它的內容。

## 正文

### 先把門關上

第 2 章第 6 集說過，`JSON.parse` 的結果適合先放進 `unknown` 型別的變數。這樣一來，直接使用就會被擋下來。建立 `check.ts`：

```ts,fails
const data: unknown = JSON.parse('{ "name": "小明" }');
console.log(data.name);
```

```text
check.ts:2:13 - error TS18046: 'data' is of type 'unknown'.

2 console.log(data.name);
              ~~~~


Found 1 error in check.ts:2
```

`any` 是「不管它」，`unknown` 是「先檢查」。現在的問題是：要怎麼檢查一個 `unknown`，才能讓 TypeScript 相信它有 `name`？

答案是用第 5 章學過的型別縮小，一層一層確認。下面每一步都把 `if` 裡面的條件加長一點，看 TypeScript 的反應。

### 第一步：是不是物件

```ts,fails
const data: unknown = JSON.parse('{ "name": "小明" }');

if (typeof data === "object") {
  console.log(data.name);
}
```

```text
check.ts:4:15 - error TS18047: 'data' is possibly 'null'.

4   console.log(data.name);
                ~~~~

check.ts:4:20 - error TS2339: Property 'name' does not exist on type 'object'.

4   console.log(data.name);
                     ~~~~


Found 2 errors in the same file, starting at: check.ts:4
```

兩個錯誤。第一個說「`data` 可能是 `null`」：這是 JavaScript 的老問題，`typeof null` 的結果也是 `"object"`，所以光靠 `typeof` 排除不了 `null`。

### 第二步：排除 `null`

```ts,fails
const data: unknown = JSON.parse('{ "name": "小明" }');

if (typeof data === "object" && data !== null) {
  console.log(data.name);
}
```

```text
check.ts:4:20 - error TS2339: Property 'name' does not exist on type 'object'.

4   console.log(data.name);
                     ~~~~


Found 1 error in check.ts:4
```

剩下一個錯誤。`data` 已經縮小成 `object`，也就是「某種物件」，但 TypeScript 還不知道它有沒有 `name`。

### 第三步：有沒有這個屬性

第 5 章第 5 集學過 `in`，用它確認屬性存在：

```ts,fails
const data: unknown = JSON.parse('{ "name": "小明" }');

if (typeof data === "object" && data !== null && "name" in data) {
  const name = data.name;
  console.log(name.toUpperCase());
}
```

```text
check.ts:5:15 - error TS18046: 'name' is of type 'unknown'.

5   console.log(name.toUpperCase());
                ~~~~


Found 1 error in check.ts:5
```

讀 `data.name` 不再報錯了，但它的型別是 `unknown`。這很合理：你只確認了「有 `name` 這個屬性」，還沒確認「`name` 是字串」。

### 第四步：屬性的型別

```ts
const data: unknown = JSON.parse('{ "name": "小明" }');

if (
  typeof data === "object" &&
  data !== null &&
  "name" in data &&
  typeof data.name === "string"
) {
  console.log(data.name.length);
}
```

```text
2
```

終於沒有錯誤了。四個條件各自負責一件事：

| 條件 | 確認的事 |
| --- | --- |
| `typeof data === "object"` | 是物件（或 `null`） |
| `data !== null` | 不是 `null` |
| `"name" in data` | 有 `name` 這個屬性 |
| `typeof data.name === "string"` | `name` 是字串 |

這比直接寫 `const user: User = JSON.parse(text)` 囉嗦很多，但每一個條件都是真的在執行時檢查資料，而不是一個沒人確認過的假設。

物件的屬性一多，每次都寫這麼長的 `if` 不是辦法。下一集要把它包成一個可以重複使用的函式。

## 重點整理

- 外部資料先放進 `unknown`，直接使用會被擋下來。
- `typeof x === "object"` 排除不了 `null`，要再加上 `x !== null`。
- 用 `in` 確認屬性存在之後，屬性的型別是 `unknown`，還要再檢查一次。
- 一層一層縮小，直到 TypeScript 確認了你要用的每一個屬性。
