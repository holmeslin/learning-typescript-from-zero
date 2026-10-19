# `satisfies`

## 本集目標

用 `satisfies` 檢查值符合某個型別，同時保留推論出來的精確型別。

## 正文

### 型別標註的副作用

網站的頁面清單，每一頁都有網址和標題。用第 3 章的 `Record` 標上型別，建立 `routes.ts`：

```ts
type Route = { path: string; title: string };

const routes: Record<string, Route> = {
  home: { path: "/", title: "首頁" },
  about: { path: "/about", title: "關於我們" },
};

console.log(routes.contact.title);
```

`npx tsc` 沒有報錯，但執行就當掉了：

```text
TypeError: Cannot read properties of undefined (reading 'title')
```

問題出在型別標註。`routes` 標成 `Record<string, Route>`，意思是「任何字串都可以當屬性名稱」，所以 TypeScript 認為 `routes.contact` 一定存在。你明明只寫了 `home` 和 `about`，這個資訊被型別標註**蓋掉**了。

不標型別呢？推論會記得 `home` 和 `about`，但就沒人檢查每一頁的格式對不對，`title` 打成 `titel` 也不會發現。

### `satisfies`：檢查，但不蓋掉

把型別標註換成 `satisfies`，寫在值的後面。建立 `routes2.ts`：

```ts,fails
type Route = { path: string; title: string };

const routes = {
  home: { path: "/", title: "首頁" },
  about: { path: "/about", title: "關於我們" },
} satisfies Record<string, Route>;

console.log(routes.home.title);
console.log(routes.contact.title);
```

```text
routes2.ts:9:20 - error TS2339: Property 'contact' does not exist on type '{ home: { path: string; title: string; }; about: { path: string; title: string; }; }'.

9 console.log(routes.contact.title);
                     ~~~~~~~


Found 1 error in routes2.ts:9
```

`routes` 的型別是推論出來的 `{ home: ...; about: ... }`，TypeScript 知道只有這兩頁，所以 `routes.contact` 被擋下了。

同時，`satisfies` 也會檢查值符不符合 `Record<string, Route>`。把 `about` 的 `title` 打錯，建立 `routes3.ts`：

```ts,fails
type Route = { path: string; title: string };

const routes = {
  home: { path: "/", title: "首頁" },
  about: { path: "/about", titel: "關於我們" },
} satisfies Record<string, Route>;

console.log(routes.home.title);
```

```text
routes3.ts:5:28 - error TS2561: Object literal may only specify known properties, but 'titel' does not exist in type 'Route'. Did you mean to write 'title'?

5   about: { path: "/about", titel: "關於我們" },
                             ~~~~~


Found 1 error in routes3.ts:5
```

這是第 3 章的多餘屬性檢查，連「你是不是想打 `title`」都猜到了。

### 三種寫法比一比

| 寫法 | 檢查格式 | 記得有哪些頁面 |
| --- | --- | --- |
| 不寫型別 | 不檢查 | 記得 |
| `const routes: Record<string, Route> = ...` | 檢查 | 不記得 |
| `const routes = ... satisfies Record<string, Route>` | 檢查 | 記得 |

讀法可以記成：型別標註是「它**就是**這個型別」，`satisfies` 是「它**符合**這個型別」。

什麼時候用 `satisfies`？像這種「寫死在程式裡的設定或對照表」，你想要檢查格式，又想保留確切的屬性名稱，就用 `satisfies`。一般的變數和函式參數，照舊用型別標註就好。

`satisfies` 也可以和上一集的 `as const` 一起用，寫成 `{ ... } as const satisfies 型別`，同時得到唯讀的字面值型別和格式檢查。

## 重點整理

- 型別標註會用標註的型別取代推論出來的型別，細節會不見。
- `值 satisfies 型別` 會檢查值符合型別，但變數保留推論出來的精確型別。
- 寫死在程式裡的設定、對照表，適合用 `satisfies`。
- `satisfies` 寫在值的後面，跟型別標註的位置不同。
