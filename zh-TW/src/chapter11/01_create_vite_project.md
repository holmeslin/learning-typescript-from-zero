# 用 Vite 建立專案

## 本集目標

用 Vite 建立一個 TypeScript 網頁專案，在瀏覽器裡打開它。

## 正文

瀏覽器跟 Node.js 不一樣，它**完全看不懂** TypeScript，連「拿掉型別」都不會。所以要在網頁上用 TypeScript，需要一個工具先把 `.ts` 轉成 JavaScript，再交給瀏覽器。這本書用的工具是 **Vite**（念法跟法文的「快」一樣，接近「vit」）。

Vite 做兩件事：

- **開發的時候**：開一個本機的網頁伺服器，你改了程式碼、存檔，瀏覽器就自動更新。
- **要發布的時候**：把所有程式碼打包成瀏覽器看得懂的 JavaScript 檔案，這個步驟叫建置（build）。

### 建立專案

這一章不在 `ts-practice` 裡練習。在 VS Code 打開終端機，先確認自己**不在** `ts-practice` 資料夾裡面（例如回到桌面或「文件」），再執行：

```bash
npm create vite@latest hello-ts -- --template vanilla-ts --no-immediate
```

這一行有點長，拆開來看：

| 部分 | 意思 |
| --- | --- |
| `npm create vite@latest` | 用最新版的 Vite 建立專案 |
| `hello-ts` | 專案資料夾的名稱 |
| `--` | 後面的選項交給 Vite，不是給 npm 的 |
| `--template vanilla-ts` | 使用「不搭配任何框架的 TypeScript」範本 |
| `--no-immediate` | 建好就停，先不要自動安裝和啟動 |

`vanilla` 是「香草」，在程式圈的意思是「原味、什麼都不加」，也就是不用 React 這類框架，直接操作網頁。

執行完，最後幾行會是：

```text
└  Done. Now run:

  cd hello-ts
  npm install
  npm run dev
```

照它說的，三個指令一個一個執行：

```bash
cd hello-ts
npm install
npm run dev
```

`npm install` 會安裝 Vite 和 TypeScript，`npm run dev` 會啟動開發用的伺服器：

```text
  VITE v8.3.4  ready in 60 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

用瀏覽器打開 <http://localhost:5173/>，會看到 Vite 的範例頁面，中間有一個按鈕，點一下數字就加一。

要停止伺服器，在終端機按 `Ctrl + C`。

接著用 VS Code 打開 `hello-ts` 資料夾（「檔案」→「開啟資料夾」），之後這一章都在這個專案裡。

### `npm run dev` 不檢查型別

這件事很重要，跟第 1 章的 Node.js 一樣：**Vite 只負責把型別拿掉，不檢查型別。**

打開 `src/counter.ts`，找到最後一行的 `setCounter(0)`，改成傳字串：

```ts,ignore
  setCounter("0")
```

VS Code 會在 `"0"` 底下畫紅線，但如果你開著 `npm run dev`，網頁照樣會更新、照樣能用，沒有任何警告。

那什麼時候會檢查？答案是建置的時候。停掉伺服器，執行：

```bash
npm run build
```

```text
> hello-ts@0.0.0 build
> tsc && vite build

src/counter.ts:8:14 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

8   setCounter("0")
               ~~~


Found 1 error in src/counter.ts:8
```

`npm run build` 會先跑 `tsc`，型別有錯就停下來，不會產生任何檔案。所以在 Vite 專案裡的分工是：

| 指令 | 做什麼 |
| --- | --- |
| `npm run dev` | 開發用，拿掉型別就執行，不檢查 |
| `npm run build` | 先用 `tsc` 檢查型別，沒問題才建置 |
| `npx tsc` | 只檢查型別，跟 `ts-practice` 裡的用法一樣 |

寫的時候一樣看 VS Code 的紅線，寫完用 `npx tsc` 或 `npm run build` 確認。

確認完，把 `"0"` 改回 `0`。

## 重點整理

- 瀏覽器看不懂 TypeScript，要用 Vite 這類工具轉成 JavaScript。
- `npm create vite@latest 名稱 -- --template vanilla-ts` 建立不搭配框架的 TypeScript 專案。
- `npm run dev` 啟動開發伺服器，但不檢查型別。
- `npm run build` 會先跑 `tsc`，型別有錯就不會建置。
