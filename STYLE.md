# 寫作慣例與術語表

這份文件給所有寫內容的人看，包括作者、貢獻者，以及協助產生內容的 AI。

## 讀者

會 JavaScript 基礎、沒寫過 TypeScript 的人。可以假設讀者懂變數、函式、陣列方法、物件、解構、`import` / `export`、`async` / `await`；TypeScript 的術語則一律不能假設，第一次出現都要解釋。

## 每一集的結構

每一集是 `zh-TW/src/chapterN/##_topic.md` 一個檔案，固定三段：

```markdown
# 標題

## 本集目標

一句話說明這一集學完會做到什麼。

## 正文

口語化的說明，搭配可以直接執行的小範例。

## 重點整理

- 三到五條，每條一句話。
```

- 一集只講一個觀念。講不完就拆成兩集，不要塞。
- 範例要小，要能單獨執行。讀者應該能把範例整段複製到 `ts-practice` 裡的新檔案，用 `node` 跑起來、用 `npx tsc` 檢查。
- 新觀念先給範例、再解釋，不要先講定義。
- 盡量只用讀者已經學過的東西。真的需要用到後面才教的語法，就明講「這個後面會教，現在先照抄」。
- 章節開頭的 `README.md` 說明這一章要學什麼、為什麼要學。
- 每章最後一集是綜合練習：題目、提示、放在 `<details>` 裡的參考解答。

## 程式碼區塊

- 程式碼一律用 `ts`。終端機指令用 `bash`，執行結果和錯誤訊息用 `text`，設定檔用 `json`。只有刻意對照純 JavaScript 時才用 `js`，`js` 區塊不會被檢查。
- CI 會把每個 `ts` 區塊當成一個獨立的檔案，用專案根目錄的 `tsconfig.json`（和第 1 章教讀者建立的那份相同）跑 `tsc` 做型別檢查。所以：
  - 一般的 `ts` 區塊不能有任何型別錯誤。
  - 每個區塊都要自給自足，不能用到其他區塊宣告的東西。
  - 故意示範型別錯誤的區塊標成 ` ```ts,fails `，在下一個 `ts,fails` 區塊之前，要有一個 `text` 區塊貼出 `npx tsc` 的錯誤訊息（中間可以穿插執行結果或其他範例）。CI 會確認這個區塊真的有錯，而且錯誤代碼（例如 `TS2322`）和 `text` 區塊寫的一樣。
  - 語法不完整的片段、需要多個檔案的範例，以及故意寫錯但當下不貼錯誤訊息的範例，標成 ` ```ts,ignore `。
- 錯誤訊息照 `npx tsc` 在終端機實際印出的樣子貼英文原文，再用中文解釋意思。不要自己翻譯或改寫錯誤訊息。
- `console.log` 的執行結果要實際跑過 `node` 再貼。
- 範例裡的變數名稱和型別名稱用英文，字串內容和註解用繁體中文。
- 每行不超過 80 個字元，避免網頁上出現橫向捲軸。
- 不用 `enum`、`namespace`、參數屬性（附錄除外），它們在 Node.js 不能直接執行。

## 用詞

- 全部用台灣慣用的繁體中文。標點用全形，但程式碼和英文術語之間用半形空格隔開，例如「用 `const` 宣告」。
- 專有名詞保留英文：TypeScript、JavaScript、Node.js、npm、VS Code、Promise、DOM、API、JSON。
- 其他術語用下表的中文；第一次出現時在括號裡附英文原文，例如「型別推論（type inference）」。
- 講關鍵字本身時用程式碼格式，例如「用 `interface` 宣告」；講觀念時用中文，例如「介面可以擴充」。
- 口氣：像朋友在旁邊講解，用「你」稱呼讀者。不要用「我們來看看」這種空話開頭，直接講。

### TypeScript 術語

| 英文 | 用這個 | 不要用 |
| --- | --- | --- |
| type | 型別 | 類型 |
| type annotation | 型別標註 | 型別註解、類型註釋 |
| type inference | 型別推論 | 類型推斷 |
| type alias | 型別別名 | |
| type checking | 型別檢查 | |
| compiler | 編譯器 | |
| union type | 聯集型別 | 聯合類型 |
| intersection type | 交集型別 | 交叉類型 |
| literal type | 字面值型別 | 字面量類型 |
| narrowing | 型別縮小 | 類型收窄 |
| type guard | 型別守衛 | 類型保護 |
| type assertion | 型別斷言 | 類型斷言 |
| discriminated union | 可辨識聯集 | |
| exhaustiveness check | 窮舉檢查 | |
| structural typing | 結構型別 | |
| tuple | 元組 | |
| optional property | 可選屬性 | 可選屬性值 |
| index signature | 索引簽章 | 索引簽名 |
| interface | 介面 | 接口 |
| generics | 泛型 | |
| type parameter | 型別參數 | 類型參數 |
| constraint | 約束 | |
| utility type | 工具型別 | 工具類型 |
| mapped type | 映射型別 | |
| conditional type | 條件型別 | |
| declaration file | 宣告檔 | 聲明文件 |
| overload | 多載 | 重載 |
| class | 類別 | 類 |
| instance | 實例 | |
| constructor | 建構子 | 構造函數 |
| method | 方法 | |
| field | 欄位 | 字段 |
| inheritance | 繼承 | |
| superclass / subclass | 父類別 / 子類別 | 超類、親代類別 |
| access modifier | 存取修飾詞 | 訪問修飾符 |
| enum | 列舉 | 枚舉 |
| namespace | 命名空間 | |
| runtime | 執行時、執行期 | 運行時 |
| error message | 錯誤訊息 | 報錯信息 |
| file extension | 副檔名 | 後綴、擴展名 |
| editor | 編輯器 | |
| hover | 把游標移到……上面 | 懸停 |

### 一般術語

| 英文 | 用這個 | 不要用 |
| --- | --- | --- |
| function | 函式 | 函數、方法（method 才叫方法） |
| variable | 變數 | 變量 |
| constant | 常數 | |
| string | 字串 | 字符串 |
| number | 數字 | 數值 |
| boolean | 布林值 | 布爾值 |
| array | 陣列 | 數組 |
| object | 物件 | 對象 |
| property | 屬性 | |
| parameter / argument | 參數 / 引數 | |
| return | 回傳 | 返回 |
| call | 呼叫 | 調用 |
| loop | 迴圈 | 循環 |
| print（console.log） | 印出 | 打印、輸出 |
| file | 檔案 | 文件 |
| folder / directory | 資料夾（「根目錄」「專案根目錄」是台灣慣用語，可以用） | 文件夾、目錄 |
| code | 程式碼 | 代碼 |
| program | 程式 | 程序 |
| software | 軟體 | 軟件 |
| data | 資料 | 數據 |
| default | 預設 | 默認、缺省 |
| terminal | 終端機 | 終端、命令行 |
| run / execute | 執行 | 運行 |
| install | 安裝 | |
| package | 套件 | 包 |
| module | 模組 | 模塊 |
| library | 函式庫 | 庫 |
| framework | 框架 | |
| build | 建置 | 構建 |
| create | 建立 | 創建 |
| configure / settings | 設定 | 配置 |
| user | 使用者 | 用戶 |
| interface（UI） | 介面 | 界面 |
| network | 網路 | 網絡 |
| information | 資訊 | 信息 |
| screen | 螢幕 | 屏幕 |
| mouse / click | 滑鼠 / 點 | 鼠標 / 點擊 |
| memory | 記憶體 | 內存 |
| support | 支援 | 支持 |
| optimize | 最佳化 | 優化 |
| implement | 實作 | 實現 |
| quality | 品質 | 質量 |
| video | 影片 | 視頻 |
| template literal | 樣板字面值 | 模板字串 |
| strict equality | 嚴格相等 | |
| callback | 回呼函式、callback | 回調 |
| event | 事件 | |
| browser | 瀏覽器 | |

寫完可以用 zhtw 之類的工具再掃一次，抓漏網的中國大陸用語。
