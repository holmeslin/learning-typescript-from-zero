# `strict` 幫你開了哪些檢查

## 本集目標

知道 `strict` 是一整組檢查的總開關，以及其中最重要的兩個。

## 正文

### 一個開關，一整組檢查

`"strict": true` 不是一個檢查，而是一個**總開關**。打開它，等於一次打開下面這些選項：

| 選項 | 檢查什麼 |
| --- | --- |
| `noImplicitAny` | 沒標型別、又推論不出來的地方，不准默默變成 `any` |
| `strictNullChecks` | `null` 和 `undefined` 要另外處理，不能直接當成其他型別用 |
| `useUnknownInCatchVariables` | `catch (error)` 的 `error` 是 `unknown`，不是 `any` |
| `strictFunctionTypes` | 把函式指定給函式型別時，參數型別檢查得更仔細 |
| `strictBindCallApply` | 檢查 `bind`、`call`、`apply` 的引數 |
| `strictPropertyInitialization` | 類別的屬性要在建構子裡給初始值 |
| `strictBuiltinIteratorReturn` | 內建迭代器的回傳值型別更精確 |
| `noImplicitThis` | `this` 的型別不明確時報錯 |

不用全部記住。後面幾個你很少會直接碰到；`useUnknownInCatchVariables` 第 10 章會遇到，`strictPropertyInitialization` 跟第 7 章的類別有關。真正每天都在幫你的，是前兩個。

### 關掉 `strict` 看看

最快理解 `strict` 的方法，是把它關掉。建立 `shout.ts`：

```ts,fails
function shout(text: string | null) {
  return text.toUpperCase();
}

function greet(name) {
  return `你好，${name}`;
}

console.log(greet("小明"));
console.log(shout(null));
```

現在的設定下，`npx tsc` 會抓到兩個錯誤：

```text
shout.ts:2:10 - error TS18047: 'text' is possibly 'null'.

2   return text.toUpperCase();
           ~~~~

shout.ts:5:16 - error TS7006: Parameter 'name' implicitly has an 'any' type.

5 function greet(name) {
                 ~~~~


Found 2 errors in the same file, starting at: shout.ts:2
```

- **TS18047**「`text` 可能是 `null`」：這是 `strictNullChecks` 抓到的。`text` 的型別是 `string | null`，沒有先檢查就呼叫 `toUpperCase`。
- **TS7006**「參數 `name` 被暗中當成 `any`」：這是 `noImplicitAny` 抓到的，第 1 章看過。

現在打開 `tsconfig.json`，把 `"strict": true` 改成 `"strict": false`，再執行一次 `npx tsc`：什麼都沒印。兩個錯誤都消失了。

但錯誤真的消失了嗎？執行看看：

```bash
node shout.ts
```

```text
你好，小明
TypeError: Cannot read properties of null (reading 'toUpperCase')
```

（省略了錯誤的位置和細節。）

程式照樣當掉。關掉 `strict` 不會讓程式變正確，只是讓 `tsc` 閉上嘴。

**看完記得把 `strict` 改回 `true`**，再刪掉 `shout.ts`。

### `strictNullChecks` 是最重要的一個

沒有 `strictNullChecks` 的時候，TypeScript 認為 `null` 和 `undefined` 可以放進任何型別。`string` 其實是「字串，或 `null`，或 `undefined`」，所以它沒辦法提醒你「這裡可能沒有值」。

`Cannot read properties of null`、`Cannot read properties of undefined` 是 JavaScript 最常見的執行時錯誤。`strictNullChecks` 就是專門抓這種錯誤的，第 5 章學的型別縮小，大部分也是在處理它抓出來的問題。

### 不寫 `strict` 會怎樣

在這本書用的 TypeScript 7 裡，`strict` 的預設值就是 `true`。也就是說，把 `"strict": true` 這一行整個刪掉，效果還是一樣。

那為什麼還要寫？因為你在網路上會看到很多舊專案和舊教學，那時候 `strict` 預設是關的。寫出來，看設定檔的人一眼就知道「這個專案是嚴格模式」，不用去查是哪個版本的預設值。

如果你接手一個 `"strict": false` 的舊專案，也不用急著一次打開。可以一個一個打開上面那張表裡的選項，例如先開 `noImplicitAny`，修完再開 `strictNullChecks`。

## 重點整理

- `strict` 是總開關，一次打開一整組嚴格的檢查。
- 最重要的是 `noImplicitAny`（TS7006）和 `strictNullChecks`（`possibly 'null'` 這類錯誤）。
- 關掉 `strict` 只會讓錯誤訊息消失，錯誤本身還在。
- TypeScript 7 的 `strict` 預設就是 `true`，寫出來是為了讓看設定檔的人一目了然。
