# 在瀏覽器用 TypeScript

前十章的程式都在 Node.js 裡執行。這一章換個地方，把 TypeScript 用在網頁上。

在瀏覽器寫 TypeScript，最常碰到的問題是：**TypeScript 看不到 HTML。** 你在 HTML 裡放了一個輸入框，TypeScript 不知道它在不在、是不是輸入框，所以每次從網頁上拿元素，它都會要你先確認。這正好是第 5 章型別縮小和型別斷言最常派上用場的地方。

這一章會：

- 用 Vite 建立一個 TypeScript 網頁專案，看懂它的結構和設定檔。
- 處理 `querySelector` 可能回傳 `null` 的問題。
- 認識 `HTMLElement` 家族，知道什麼時候該縮小、什麼時候可以斷言。
- 幫事件、表單輸入和 `fetch` 回來的資料加上型別。
- 最後做一個待辦清單。

這一章不在 `ts-practice` 裡練習，而是另外建立一個 Vite 專案。開始之前，你應該會用 `document.querySelector` 找元素、用 `addEventListener` 監聽事件、用 `textContent` 改文字。如果還不熟，可以先讀[《從零開始學 React》第 3 章](https://holmeslin.github.io/learning-react-from-zero/zh-TW/chapter3/index.html)。
