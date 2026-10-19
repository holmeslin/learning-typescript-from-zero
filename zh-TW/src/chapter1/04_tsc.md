# 用 `tsc` 檢查型別

## 本集目標

用 `npx tsc` 檢查整個資料夾的型別，並記住一個常見的陷阱。

## 正文

### 執行和檢查是兩件事

建立 `double.ts`：

```ts,fails
function double(n: number) {
  return n * 2;
}

console.log(double("5"));
```

`n: number` 說明參數 `n` 要收數字，呼叫的時候卻傳了字串 `"5"`。先用 Node.js 執行：

```bash
node double.ts
```

```text
10
```

執行得很順利，甚至答案也對，因為 `"5" * 2` 會把字串轉成數字。但這只是運氣好，換成 `+` 就會出事（還記得第 1 集的 `1005` 嗎）。

現在換 `tsc` 來檢查：

```bash
npx tsc
```

```text
double.ts:5:20 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

5 console.log(double("5"));
                     ~~~


Found 1 error in double.ts:5
```

`tsc` 抓到了：第 5 行傳進去的是字串，但參數要的是數字。下一集會一個字一個字教你看懂這段訊息。

所以 TypeScript 的工作流程是兩個指令：

| 指令 | 做什麼 |
| --- | --- |
| `node 檔名.ts` | 拿掉型別、執行程式，不檢查型別 |
| `npx tsc` | 檢查型別，不執行程式 |

型別沒有錯誤時，`npx tsc` 什麼都不會印。**什麼都沒印就是好消息。**

現在把 `double("5")` 改成 `double(5)`，再跑一次 `npx tsc`，確認它安靜下來。

### `npx tsc` 檢查的是整個資料夾

`npx tsc` 後面不用加檔名。它會讀 `tsconfig.json`，然後把資料夾裡**所有**的 `.ts` 檔都檢查一遍。

這就是第 2 集說「寫錯的練習檔要改對或刪掉」的原因：只要資料夾裡還有一個檔案有錯，之後每次 `npx tsc` 都會印出它的錯誤，你會分不清哪些是新的、哪些是舊的。

### 陷阱：不要在後面加檔名

你可能會想「我只想檢查一個檔案」，然後打：

```bash
npx tsc double.ts
```

```text
error TS5112: tsconfig.json is present but will not be loaded if files are specified on commandline. Use '--ignoreConfig' to skip this error.
```

意思是「資料夾裡有 `tsconfig.json`，但你在指令裡指定了檔案，這樣設定檔就不會被讀進來」。不讀設定檔，`strict` 這些設定都不會生效，檢查結果會跟你預期的不一樣，所以 TypeScript 乾脆拒絕執行。

記住：**`npx tsc` 後面什麼都不要加。**

## 重點整理

- `node 檔名.ts` 只執行、不檢查型別；`npx tsc` 只檢查型別、不執行。
- `npx tsc` 沒有印出任何東西，代表沒有型別錯誤。
- `npx tsc` 會檢查資料夾裡所有的 `.ts` 檔。
- 不要在 `npx tsc` 後面加檔名，否則會出現 TS5112 錯誤。
