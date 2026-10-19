# 綜合練習

## 本集目標

讀取一份 API 資料，驗證格式、留下合格的資料，並處理所有可能的錯誤。

## 正文

這一集沒有新東西，只有一個題目。請先自己寫，卡住再看提示，最後再對照參考解答。

### 題目：商品清單

伺服器會回傳一個商品陣列，但資料不太乾淨，有些商品的價格是字串，有些少了名稱。建立 `shop.ts`，用下面這段模擬伺服器的回應：

```ts
const res = new Response(
  JSON.stringify([
    { id: 1, name: "筆記本", price: 45 },
    { id: 2, name: "原子筆", price: "15" },
    { id: 3, name: "橡皮擦", price: 10 },
    { id: 4, price: 30 },
  ]),
);
console.log(res.ok);
```

（最後一行 `console.log` 只是讓這段程式碼可以單獨執行，寫題目時可以刪掉。）

請完成下面的事：

1. 定義 `Product` 型別：`id` 是數字、`name` 是字串、`price` 是數字。
2. 寫型別守衛 `isProduct(value: unknown): value is Product`。
3. 寫 `async function loadProducts(res: Response): Promise<Product[]>`：
   - 狀態碼不正常時，丟出錯誤「伺服器回應 狀態碼」。
   - 資料不是陣列時，丟出錯誤「資料不是陣列」。
   - 只留下合格的商品；有不合格的資料時，印出「略過 N 筆格式不對的資料」。
4. 呼叫 `loadProducts(res)`，印出每個商品和合計金額。用 `try...catch` 接住錯誤，印出「讀取失敗：錯誤訊息」。

預期的輸出：

```text
略過 2 筆格式不對的資料
筆記本：45 元
橡皮擦：10 元
合計：55 元
```

全程不能用 `any`，也不能用 `as`。

### 提示

- `isProduct` 照第 5 集 `isUser` 的寫法，三個屬性各檢查一次。
- 第 6 集的 `loadUser` 是很好的起點：先檢查 `res.ok`，再把 `await res.json()` 放進 `unknown`。
- 確認是陣列用 `Array.isArray`，留下合格的商品用 `filter(isProduct)`。
- 略過的筆數，是原本陣列的長度減掉合格商品的數量。
- 讀出錯誤訊息，用第 7 集的 `describeError`。

### 參考解答

寫完再看。

<details>
<summary>展開參考解答</summary>

```ts
type Product = { id: number; name: string; price: number };

function isProduct(value: unknown): value is Product {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "number" &&
    "name" in value &&
    typeof value.name === "string" &&
    "price" in value &&
    typeof value.price === "number"
  );
}

async function loadProducts(res: Response): Promise<Product[]> {
  if (!res.ok) {
    throw new Error(`伺服器回應 ${res.status}`);
  }
  const data: unknown = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("資料不是陣列");
  }
  const products = data.filter(isProduct);
  const skipped = data.length - products.length;
  if (skipped > 0) {
    console.log(`略過 ${skipped} 筆格式不對的資料`);
  }
  return products;
}

function describeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

const res = new Response(
  JSON.stringify([
    { id: 1, name: "筆記本", price: 45 },
    { id: 2, name: "原子筆", price: "15" },
    { id: 3, name: "橡皮擦", price: 10 },
    { id: 4, price: 30 },
  ]),
);

try {
  const products = await loadProducts(res);
  let total = 0;
  for (const product of products) {
    console.log(`${product.name}：${product.price} 元`);
    total += product.price;
  }
  console.log(`合計：${total} 元`);
} catch (error) {
  console.log(`讀取失敗：${describeError(error)}`);
}
```

幾個值得注意的地方：

- `data.filter(isProduct)` 的結果型別是 `Product[]`，後面的 `product.price` 可以直接相加，不用再檢查。
- `Array.isArray(data)` 之後，`data` 是 `any[]`。`data.length` 可以放心用，因為陣列一定有 `length`；但元素本身一定要經過 `isProduct` 才能用。
- 第 2 筆的 `price` 是字串 `"15"`。如果沒有驗證，`total += product.price` 會變成接字串，合計會印出 `45151030` 這種莫名其妙的結果，就像第 1 章第 1 集的 `1005`。
- `loadProducts` 回傳之後，整個程式裡再也沒有 `any` 或 `unknown`，外部資料在一個地方檢查完，其他地方就能放心使用。

</details>

### 延伸挑戰

- 把 `res` 換成 `new Response("找不到", { status: 404 })`，確認印出「讀取失敗：伺服器回應 404」。
- 把 `res` 換成 `new Response(JSON.stringify({ id: 1 }))`，確認印出「讀取失敗：資料不是陣列」。
- 讓 `isProduct` 再多檢查一件事：`price` 不能是負數。

## 重點整理

- 外部資料在進入程式的地方一次檢查完，之後的程式碼就能相信型別。
- 狀態碼、資料結構、每個欄位的型別，都要檢查。
- `filter` 搭配型別守衛，可以只留下合格的資料，型別也會跟著變。
- 錯誤用 `try...catch` 接住，用 `instanceof Error` 讀出訊息。
