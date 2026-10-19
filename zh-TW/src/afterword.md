# 後記

如果你一路讀到這裡，你已經從「第一次用 `npx tsc` 看到紅字」，走到了能設定專案、處理外部資料、在瀏覽器裡用 TypeScript 操作網頁。這中間你碰過的東西不少：基本型別、物件、函式、聯集與型別縮小、泛型、類別、型別運算，還有模組和宣告檔。

這本書沒有教完 TypeScript 的所有功能，也不打算這麼做。這本書用的是 2026 年 10 月的 TypeScript 7.0，幾年之後，有些錯誤訊息的寫法、設定檔的預設值一定會不一樣。但你學到的底層觀念不會過期：

- **型別是寫給工具看的說明書。** 寫清楚每個值是什麼，讓工具在程式執行之前幫你挑錯。
- **型別在執行時不存在。** 從外面來的資料，TypeScript 看不到，一定要自己檢查過，才能相信它的型別。
- **能推論的就交給推論。** 型別標註寫在參數、寫在邊界，其他地方讓 TypeScript 自己算。

## 接下來可以往哪裡走

**第一個建議：把型別用在你真正在寫的程式上。** 拿一個你寫過的 JavaScript 小專案，把副檔名改成 `.ts`、打開 `strict`，照著錯誤訊息一個一個修。你會發現原本沒注意到的 bug，也會遇到書裡沒講的狀況，每一次查資料都是在學新東西。

**想把 TypeScript 用在 React，** 請接著讀[《從零開始學 React》](https://holmeslin.github.io/learning-react-from-zero/zh-TW/)第 10 章。那一章教 props、state、事件和 Hook 的型別，你在這本書學到的東西都用得上，可以讀得很快。

**需要查資料的時候，去看官方文件：**

- TypeScript 官方手冊：[typescriptlang.org/docs](https://www.typescriptlang.org/docs/)
- 線上試玩，不用安裝就能看型別和錯誤訊息：[TypeScript Playground](https://www.typescriptlang.org/play)
- `tsconfig.json` 每個選項的說明：[typescriptlang.org/tsconfig](https://www.typescriptlang.org/tsconfig/)

**遇到看不懂的型別定義，** 不用急著全部搞懂。把游標移上去看、用第 8 章學到的工具型別一層一層拆，通常就能看出它想表達什麼。真的看不懂，把錯誤訊息原封不動地貼去搜尋或問 AI。

## 最後

如果有哪一集你覺得講得不清楚、有錯字、有程式碼跑不起來，歡迎到 [GitHub](https://github.com/holmeslin/learning-typescript-from-zero) 開 issue 告訴我。你卡住的地方，就是這本書下一次修改的地方。

謝謝你讀完。現在，去幫你的程式碼加上型別吧。
