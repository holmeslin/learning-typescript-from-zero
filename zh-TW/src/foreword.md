# 前言

這是一本給「會一點 JavaScript、但還沒碰過 TypeScript」的人看的教學。

TypeScript 是在 JavaScript 上加了**型別**的語言。你可以事先說明「這個變數放的是數字」、「這個函式要收一個有 `name` 的物件」，然後在程式還沒執行之前，就讓工具把對不上的地方抓出來。現在新的前端專案、Node.js 專案，大多直接用 TypeScript 寫；你在網路上找到的範例和套件說明，也愈來愈常是 TypeScript。

## 你需要先會什麼

這本書不教 JavaScript 本身。開始之前，你應該已經會：

- 用 `const`、`let` 宣告變數，用 `if`、`for...of` 寫流程
- 寫函式和箭頭函式，用 `map`、`filter` 處理陣列
- 物件、解構、展開語法
- `import` / `export`
- `async` / `await` 與 `fetch`

如果其中有幾項還不熟，可以先讀[《從零開始學 React》](https://holmeslin.github.io/learning-react-from-zero/zh-TW/)的第 1、2 章，那兩章剛好涵蓋這些內容，讀完再回來。

## 這本書怎麼安排

全書分成兩部：

- **第一部**（第 1～8 章）學型別系統本身：基本型別、物件、函式、聯集與型別縮小、泛型、類別，最後是從型別產生型別的「型別運算」。
- **第二部**（第 9～11 章）把 TypeScript 用在真實的專案：設定檔與模組、處理從外面來的資料，以及在瀏覽器裡操作網頁元素。

每一集都很短，只講一個觀念，固定分成「本集目標」、「正文」、「重點整理」三段。每章最後一集是綜合練習。請照順序讀，因為每一集都建立在前面的基礎上。

## 怎麼讀最有效

**把每個範例自己打一遍，用 `npx tsc` 檢查，再故意改錯看看。** TypeScript 最重要的技能，是看懂錯誤訊息、知道它在抱怨什麼。書裡很多範例是故意寫錯的，請照著做，親眼看看錯誤訊息長什麼樣子。

第 1～10 章的範例都在第 1 章建立的 `ts-practice` 資料夾裡執行；第 11 章另外用 Vite 建立一個網頁專案。

## 版本

這本書使用的版本如下。版本不同時，畫面、指令或錯誤訊息可能會有些微差異。

| 工具 | 版本 |
| --- | --- |
| TypeScript | 7.0 |
| Node.js | 24（LTS） |
| Vite | 8（只有第 11 章用到） |

套件管理工具一律用 Node.js 內建的 npm。

## 搭配 AI 一起學

讀的時候遇到不懂的地方，可以問 AI。為了讓 AI 的回答符合你目前的進度、不會一次丟給你一堆還沒學的東西，請先下載這本書的原始檔 [ts-book-src.zip](ts-book-src.zip)，把它連同你的問題一起交給 AI，並告訴它你讀到第幾章第幾集。壓縮檔裡是整本書的原始檔，AI 看了就知道你學到哪裡、還沒學過什麼。

## 授權與回報問題

除非另有標示，本書的文字、圖片與其他非程式碼內容採用 [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh-hant) 授權；程式碼範例以 [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/deed.zh-hant) 釋出，可以自由複製、修改與使用。

發現錯字、程式碼跑不起來或哪裡講不清楚，歡迎到 [GitHub](https://github.com/holmeslin/learning-typescript-from-zero) 開 issue。每一頁右上角的編輯按鈕可以直接提出修改。
