# 多餘屬性檢查

## 本集目標

知道 TypeScript 什麼時候會擋下「型別裡沒有的屬性」，以及為什麼。

## 正文

### 多寫了一個屬性

建立 `config.ts`：

```ts,fails
type Settings = {
  theme: string;
  fontSize: number;
};

const settings: Settings = {
  theme: "dark",
  fontSize: 16,
  fontsize: 18,
};
console.log(settings);
```

```text
config.ts:9:3 - error TS2561: Object literal may only specify known properties, but 'fontsize' does not exist in type 'Settings'. Did you mean to write 'fontSize'?

9   fontsize: 18,
    ~~~~~~~~


Found 1 error in config.ts:9
```

「物件字面值只能寫型別裡有的屬性，`Settings` 沒有 `fontsize`。你是不是想寫 `fontSize`？」

物件字面值（object literal）就是直接用大括號寫出來的物件。直接把物件字面值放進有型別的地方時，TypeScript 會多做一個檢查：**型別裡沒有的屬性，一個都不能多**。這叫**多餘屬性檢查**（excess property check）。

這個檢查最大的用處就是抓錯字。`fontsize` 和 `fontSize` 只差一個大小寫，沒有這個檢查，`fontsize: 18` 會被默默忽略，你會一直想不通字級為什麼沒變。

直接把物件字面值傳給函式也一樣：

```ts,fails
type Settings = {
  theme: string;
  fontSize: number;
};

function apply(settings: Settings) {
  console.log(`主題：${settings.theme}，字級：${settings.fontSize}`);
}

apply({ theme: "dark", fontSize: 16, fontsize: 18 });
```

```text
config.ts:10:38 - error TS2561: Object literal may only specify known properties, but 'fontsize' does not exist in type 'Settings'. Did you mean to write 'fontSize'?

10 apply({ theme: "dark", fontSize: 16, fontsize: 18 });
                                        ~~~~~~~~


Found 1 error in config.ts:10
```

### 先放進變數就不檢查

奇怪的地方來了。先把物件放進一個變數，再傳進去：

```ts
type Settings = {
  theme: string;
  fontSize: number;
};

function apply(settings: Settings) {
  console.log(`主題：${settings.theme}，字級：${settings.fontSize}`);
}

const saved = { theme: "dark", fontSize: 16, updatedAt: "2026-10-19" };
apply(saved);
```

```text
主題：dark，字級：16
```

`saved` 多了 `updatedAt`，卻沒有報錯。

這是故意的設計。多餘屬性檢查**只針對直接寫出來的物件字面值**。理由是：

- 直接寫出來的物件，你寫它的目的就是要符合這個型別，多出來的屬性幾乎一定是打錯了。
- 已經存在的變數，可能本來就是為了別的用途建立的，帶著其他屬性很正常。`apply` 只會用到 `theme` 和 `fontSize`，多的屬性不會造成問題。

為什麼「多一點屬性沒關係」？這和下一集的結構型別有關。

## 重點整理

- 直接把物件字面值放進有型別的地方時，多了型別裡沒有的屬性會報錯。
- 這個檢查叫多餘屬性檢查，最大的用處是抓屬性名稱的錯字。
- 先放進變數再傳，就不會做這個檢查。
- 多出來的屬性不影響程式運作，所以只有在「很可能是打錯」的情況下才會擋。
