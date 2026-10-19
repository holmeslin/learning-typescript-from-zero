# 表單輸入

## 本集目標

處理表單送出的事件，把輸入框的文字正確轉成數字。

## 正文

這一集做一個計算 BMI 的小工具。把 `index.html` 的 `<body>` 換成：

```html
<body>
  <form>
    <label>身高（公分）<input id="height" type="number" /></label>
    <label>體重（公斤）<input id="weight" type="number" /></label>
    <button>計算 BMI</button>
  </form>
  <p id="result"></p>
  <script type="module" src="/src/main.ts"></script>
</body>
```

### `value` 永遠是字串

先試著讀身高，換算成公尺：

```ts,fails
const input = document.querySelector("input");

if (input) {
  const height = input.value;
  console.log(height / 100);
}
```

```text
src/main.ts:5:15 - error TS2362: The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.

5   console.log(height / 100);
                ~~~~~~


Found 1 error in src/main.ts:5
```

第 1 章綜合練習看過類似的錯誤：「算術運算的左邊必須是數字」。輸入框的 `value` 型別是 `string`，**就算 `<input type="number">` 也一樣**。`type="number"` 只是讓瀏覽器顯示數字鍵盤、擋掉非數字的輸入，拿出來的值還是字串。

在 JavaScript 裡，`"170" / 100` 會自動轉成數字算出 `1.7`，看起來沒問題；但換成 `+` 就會變成接字串。TypeScript 要你自己明確地轉換。

### 轉成數字

有兩種常見的轉法：`Number(input.value)`，或是輸入框專用的 `input.valueAsNumber`。兩者的差別在輸入框是空的時候：

| 輸入框的內容 | `input.value` | `Number(input.value)` | `input.valueAsNumber` |
| --- | --- | --- | --- |
| `170` | `"170"` | `170` | `170` |
| 空的 | `""` | `0` | `NaN` |

`Number("")` 是 `0`，使用者什麼都沒填，程式卻當成填了 0，這種錯誤很難發現。`valueAsNumber` 在空的時候給 `NaN`（不是數字），可以用 `Number.isNaN()` 檢查出來。所以數字輸入框建議用 `valueAsNumber`。

`valueAsNumber` 只有 `HTMLInputElement` 才有，這又是一個要先縮小型別的理由。

### 處理表單送出

完整的 `src/main.ts`：

```ts
function getInput(selector: string): HTMLInputElement {
  const element = document.querySelector(selector);
  if (!(element instanceof HTMLInputElement)) {
    throw new Error(`找不到輸入框 ${selector}`);
  }
  return element;
}

const form = document.querySelector("form");
const heightInput = getInput("#height");
const weightInput = getInput("#weight");
const result = document.querySelector("#result");

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!result) {
    return;
  }

  const height = heightInput.valueAsNumber / 100;
  const weight = weightInput.valueAsNumber;

  if (Number.isNaN(height) || Number.isNaN(weight)) {
    result.textContent = "請輸入身高和體重";
    return;
  }

  const bmi = weight / (height * height);
  result.textContent = `BMI：${bmi.toFixed(1)}`;
});
```

幾個地方：

- `getInput` 是第 4 集寫的函式，拿到的一定是 `HTMLInputElement`。
- `querySelector("form")` 用標籤名稱找，型別是 `HTMLFormElement | null`。上一集說過，這樣 `"submit"` 的 `event` 才會被推論成 `SubmitEvent`。
- `event.preventDefault()` 阻止表單的預設行為。表單送出時，瀏覽器預設會重新載入頁面，你算好的結果會一閃就不見。
- `result` 在 callback 裡用 `if (!result) return;` 排除 `null`。`return` 之後的程式碼，TypeScript 都知道 `result` 不是 `null`。

輸入身高 `170`、體重 `65`，按「計算 BMI」，下面會顯示 `BMI：22.5`。什麼都不填就按，會顯示「請輸入身高和體重」。

## 重點整理

- 輸入框的 `value` 永遠是 `string`，`type="number"` 也一樣。
- 數字輸入框用 `valueAsNumber` 轉成數字，空的時候是 `NaN`，用 `Number.isNaN()` 檢查。
- `Number("")` 是 `0`，不適合用來判斷使用者有沒有填。
- 表單的 `"submit"` 事件裡要呼叫 `event.preventDefault()`，避免頁面重新載入。
