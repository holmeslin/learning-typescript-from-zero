# 匯入時要寫 `.ts` 副檔名

## 本集目標

知道在這本書的環境裡，匯入自己的檔案為什麼一定要寫 `.ts`。

## 正文

### 省略副檔名

你在別的教學裡，可能看過匯入時不寫副檔名：

```ts,ignore
import { formatPrice } from "./product";
```

把 `shop/main.ts` 的兩個 `"./product.ts"` 都改成 `"./product"`，執行 `npx tsc`：

```text
shop/main.ts:1:29 - error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './product.js'?

1 import { formatPrice } from "./product";
                              ~~~~~~~~~~~

shop/main.ts:2:30 - error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './product.js'?

2 import type { Product } from "./product";
                               ~~~~~~~~~~~


Found 2 errors in the same file, starting at: shop/main.ts:1
```

「相對路徑的匯入，必須寫出副檔名」。這是 Node.js 的規則：它不會幫你猜 `./product` 指的是 `product.ts`、`product.js` 還是 `product` 資料夾。`tsconfig.json` 的 `module: "nodenext"` 讓 `tsc` 照著這個規則檢查。

不管錯誤直接執行，Node.js 也會說找不到：

```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/ts-practice/shop/product' imported from …/ts-practice/shop/main.ts
```

（`…` 是你電腦上的路徑，每個人都不一樣，這裡省略了。）

### 錯誤訊息建議的 `.js` 呢

錯誤訊息最後問：「你是不是想寫 `./product.js`？」照著改成 `"./product.js"`，`npx tsc` 真的不報錯了。但是執行：

```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/ts-practice/shop/product.js' imported from …/ts-practice/shop/main.ts
```

一樣找不到，因為資料夾裡根本沒有 `product.js`。

這是因為很多專案的做法跟這本書不一樣：它們先用 `tsc` 把所有 `.ts` 轉成 `.js`，再執行轉出來的 `.js`。到那個時候，`product.ts` 已經變成 `product.js`，所以原始碼裡要寫 `.js`。`tsc` 知道 `./product.js` 指的是轉換前的 `product.ts`，所以檢查得過。

這本書是讓 Node.js 直接執行 `.ts`，不轉換，所以要寫**實際存在的檔名**，也就是 `.ts`。第 2 集講過的 `allowImportingTsExtensions`，就是讓 `tsc` 接受 `.ts` 副檔名的設定。

### 一張表整理

| 寫法 | `npx tsc` | `node` 執行 |
| --- | --- | --- |
| `"./product"` | TS2835 | 找不到 |
| `"./product.js"` | 通過 | 找不到 |
| `"./product.ts"` | 通過 | 正常 |

記住：**在這本書的環境裡，匯入自己的 `.ts` 檔，就寫 `.ts`。** 你在網路上看到的範例寫 `.js` 或不寫副檔名，通常是因為它們用的是先轉換再執行的做法，或是第 11 章會用到的 Vite 這類工具。

匯入套件不用寫副檔名，例如 `import { readFile } from "node:fs/promises"`，這條規則只管 `./`、`../` 開頭的相對路徑。

看完記得把 `shop/main.ts` 改回 `.ts`。

## 重點整理

- `module: "nodenext"` 照 Node.js 的規則檢查，相對路徑的匯入一定要寫副檔名，不寫會出現 TS2835。
- 錯誤訊息建議的 `.js` 是給「先轉換再執行」的專案用的，這本書的環境要寫 `.ts`。
- 寫 `.ts` 副檔名需要 `allowImportingTsExtensions`。
- 匯入套件不用寫副檔名，規則只管相對路徑。
