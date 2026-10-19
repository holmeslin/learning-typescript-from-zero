# 用 `fetch` 把資料顯示在畫面上

## 本集目標

用 `fetch` 讀取 JSON，驗證格式之後，把資料變成網頁上的清單。

## 正文

### 準備資料

在 `public` 資料夾裡建立 `products.json`：

```json
[
  { "name": "筆記本", "price": 45 },
  { "name": "原子筆", "price": 15 },
  { "name": "便利貼", "price": 30 }
]
```

第 2 集說過，`public` 裡的檔案會原封不動地提供給瀏覽器。開著 `npm run dev` 的話，打開 <http://localhost:5173/products.json> 就看得到這份資料。所以在程式裡，可以用 `fetch("/products.json")` 讀到它。

`index.html` 的 `<body>`：

```html
<body>
  <h1>文具清單</h1>
  <ul id="products"></ul>
  <script type="module" src="/src/main.ts"></script>
</body>
```

### 讀取並驗證

`fetch` 回來的資料是從網路上來的。第 1 章說過，TypeScript 看不到程式外面的資料。`response.json()` 的回傳型別是 `Promise<any>`，如果直接拿來用，`any` 會讓型別檢查整個失效。

做法跟第 10 章一樣：先把它當成 `unknown`，再用型別守衛（第 5 章）檢查過，才當成你要的型別使用。

```ts
type Product = {
  name: string;
  price: number;
};

function isProduct(value: unknown): value is Product {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    typeof value.name === "string" &&
    "price" in value &&
    typeof value.price === "number"
  );
}

async function loadProducts(): Promise<Product[]> {
  const response = await fetch("/products.json");
  if (!response.ok) {
    throw new Error(`讀取失敗：${response.status}`);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data) || !data.every(isProduct)) {
    throw new Error("資料格式不對");
  }
  return data;
}
```

- `const data: unknown = await response.json()`：主動把 `any` 標成 `unknown`，之後不檢查就不能用。
- `Array.isArray(data)` 確認是陣列，`data.every(isProduct)` 確認每一個元素都是 `Product`。
- `response.ok` 是 HTTP 狀態碼在 200～299 之間時為 `true`。檔案不存在時，`fetch` 不會丟出錯誤，而是回傳狀態碼 404 的回應，所以要自己檢查。

### 顯示在畫面上

在同一個檔案的最後面接著寫：

```ts,ignore
const list = document.querySelector("#products");

async function showProducts() {
  if (!list) {
    return;
  }

  try {
    const products = await loadProducts();
    for (const product of products) {
      const item = document.createElement("li");
      item.textContent = `${product.name}：${product.price} 元`;
      list.append(item);
    }
  } catch (error) {
    list.textContent = "讀取失敗，請稍後再試";
    console.error(error);
  }
}

showProducts();
```

（這一段用到上面的 `loadProducts`，要和上面那段放在同一個檔案裡。）

- `document.createElement("li")` 的回傳型別是 `HTMLLIElement`。跟 `querySelector` 不同，`createElement` 是「建立」新元素，一定拿得到，所以沒有 `| null`。標籤名稱決定型別，`createElement("input")` 就是 `HTMLInputElement`。
- `list.append(item)` 把新的 `<li>` 加到清單裡。
- 讀取或驗證失敗時，`loadProducts` 會丟出錯誤，這裡用 `try...catch` 接住，在畫面上顯示訊息，把細節印到 Console。

存檔之後，網頁上會出現三行：

```text
筆記本：45 元
原子筆：15 元
便利貼：30 元
```

試著把 `products.json` 裡的某個 `45` 改成字串 `"45"`，重新整理網頁，會看到「讀取失敗，請稍後再試」，Console 裡印著 `Error: 資料格式不對`。資料的格式不對，程式在一開始就攔下來，而不是讓 `"45"` 一路流進後面的計算。

## 重點整理

- `public` 裡的檔案可以用 `fetch("/檔名")` 讀取。
- `response.json()` 回傳 `Promise<any>`，要主動當成 `unknown`，用型別守衛驗證之後再用。
- `fetch` 碰到 404 不會丟出錯誤，要自己檢查 `response.ok`。
- `document.createElement("標籤")` 一定拿得到元素，型別由標籤名稱決定。
