# 可選參數與預設參數

## 本集目標

讓參數可以不傳：用 `?` 標成可選參數，或給它一個預設值。

## 正文

第 1 集說過，宣告了幾個參數就要傳幾個引數。但有些參數本來就不一定需要，例如稱謂。

### 可選參數

在參數名稱後面加 `?`，它就變成**可選參數**（optional parameter），呼叫時可以不傳。建立 `greet.ts`：

```ts
function greet(name: string, title?: string) {
  if (title) {
    return `${name}${title}您好`;
  }
  return `${name}您好`;
}

console.log(greet("王"));
console.log(greet("王", "經理"));
```

```text
王您好
王經理您好
```

這個 `?` 和第 3 章物件的可選屬性是同一個意思。

### 可選參數可能是 `undefined`

沒傳的參數，值是 `undefined`。所以在函式裡面，`title` 的型別其實是 `string | undefined`，TypeScript 不會讓你直接把它當字串用：

```ts,fails
function greet(name: string, title?: string) {
  return `${name}${title}（${title.length} 個字）`;
}

console.log(greet("王"));
```

```text
greet.ts:2:29 - error TS18048: 'title' is possibly 'undefined'.

2   return `${name}${title}（${title.length} 個字）`;
                              ~~~~~


Found 1 error in greet.ts:2
```

「`title` 可能是 `undefined`」。如果真的照這樣執行，沒傳 `title` 時就會當掉。

前面那個能通過檢查的版本，用 `if (title)` 先確認有值，TypeScript 就知道在 `if` 裡面 `title` 一定是字串。為什麼 `if` 檢查完就安全了，第 5 章會詳細講。

### 預設參數

另一種做法是給參數一個**預設值**，這是 JavaScript 本來就有的語法：

```ts,fails
function greet(name: string, title = "先生") {
  return `${name}${title}您好，稱謂有 ${title.length} 個字`;
}

console.log(greet("王"));
console.log(greet("林", "小姐"));
console.log(greet("陳", 5));
```

```text
greet.ts:7:24 - error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.

7 console.log(greet("陳", 5));
                         ~


Found 1 error in greet.ts:7
```

注意兩件事：

- `title` 沒有寫型別，TypeScript 從預設值 `"先生"` 推論出它是 `string`，所以傳數字 `5` 會報錯。
- 函式裡面直接用了 `title.length`，卻沒有報錯。因為沒傳的時候會用預設值，`title` 不可能是 `undefined`。

把最後一行刪掉，執行結果是：

```text
王先生您好，稱謂有 2 個字
林小姐您好，稱謂有 2 個字
```

### 可選參數要放在後面

可選參數不能放在必填參數的前面：

```ts,fails
function greet(title?: string, name: string) {
  return `${name}${title}您好`;
}

console.log(greet("經理", "王"));
```

```text
greet.ts:1:32 - error TS1016: A required parameter cannot follow an optional parameter.

1 function greet(title?: string, name: string) {
                                 ~~~~


Found 1 error in greet.ts:1
```

「必填參數不能跟在可選參數後面」。想想看：如果只傳一個引數，它應該給 `title` 還是 `name`？沒辦法判斷，所以規定可選的一律放後面。

### 怎麼選

- 沒傳的時候有合理的預設值，就用**預設參數**，函式裡面不用再檢查。
- 沒傳的時候要做不一樣的事，就用**可選參數**，再用 `if` 分開處理。

## 重點整理

- 參數名稱後面加 `?` 就是可選參數，呼叫時可以不傳。
- 可選參數的型別會多一個 `undefined`，使用前要先檢查。
- 預設參數不用寫型別，TypeScript 會從預設值推論，函式裡面也不用檢查 `undefined`。
- 可選參數要放在必填參數的後面。
