# 條件型別入門

## 本集目標

看得懂 `A extends B ? X : Y` 這種型別，知道 `Exclude` 是怎麼寫出來的。

## 正文

這一集也是「入門就好」，目標是看得懂。

### 型別也有三元運算子

JavaScript 的三元運算子是 `條件 ? 成立時的值 : 不成立時的值`。型別也有一樣的寫法。建立 `cond.ts`：

```ts,fails
type IsString<T> = T extends string ? "是字串" : "不是字串";

const a: IsString<"台北"> = "是字串";
const b: IsString<42> = "是字串";
console.log(a, b);
```

`T extends string ? "是字串" : "不是字串"` 讀作：「如果 `T` 可以放進 `string`，結果是 `"是字串"`，否則是 `"不是字串"`」。這叫**條件型別**（conditional type）。

- `IsString<"台北">`：`"台北"` 可以放進 `string`，結果是 `"是字串"`。
- `IsString<42>`：`42` 不能放進 `string`，結果是 `"不是字串"`，所以 `b` 報錯了。

```text
cond.ts:4:7 - error TS2322: Type '"是字串"' is not assignable to type '"不是字串"'.

4 const b: IsString<42> = "是字串";
        ~


Found 1 error in cond.ts:4
```

這裡的 `extends` 跟第 6 章泛型約束的 `extends` 是同一個意思：「可以放進」。只是約束是「不符合就報錯」，條件型別是「符合和不符合各給一個結果」。

### 遇到聯集，會一個一個算

條件型別有一個特別的地方：`T` 是聯集時，會對**每一個成員分開算**，再把結果合起來。內建的 `Exclude` 就是靠這一點寫出來的。這裡自己寫一個一模一樣的 `MyExclude`，建立 `myexclude.ts`：

```ts,fails
type MyExclude<T, U> = T extends U ? never : T;

type Status = "pending" | "shipped" | "cancelled";
const s: MyExclude<Status, "cancelled"> = "cancelled";
console.log(s);
```

`MyExclude<Status, "cancelled">` 會這樣算：

| 成員 | 可以放進 `"cancelled"` 嗎 | 結果 |
| --- | --- | --- |
| `"pending"` | 不行 | `"pending"` |
| `"shipped"` | 不行 | `"shipped"` |
| `"cancelled"` | 可以 | `never` |

第 5 章學過，`never` 是「不可能有的值」，放在聯集裡等於什麼都沒有。所以結果是 `"pending" | "shipped"`：

```text
myexclude.ts:4:7 - error TS2322: Type '"cancelled"' is not assignable to type '"pending" | "shipped"'.

4 const s: MyExclude<Status, "cancelled"> = "cancelled";
        ~


Found 1 error in myexclude.ts:4
```

跟第 7 集內建的 `Exclude` 結果一模一樣。`Extract` 也是同樣的寫法，只是把 `never` 和 `T` 的位置對調：`T extends U ? T : never`。

### 在函式庫裡看到時

你在函式庫的型別定義裡看到 `? :` 出現在型別的位置，就知道它是條件型別，照著「如果可以放進……就是……否則是……」讀下去就好。很長、有好幾層的條件型別，可以把游標移到使用它的地方，直接看 VS Code 算出來的結果，不必自己在腦中算。

## 重點整理

- 條件型別的寫法是 `A extends B ? X : Y`：`A` 可以放進 `B` 就是 `X`，否則是 `Y`。
- `A` 是聯集時，會對每一個成員分開算，再把結果合起來。
- `Exclude` 和 `Extract` 都是用條件型別搭配 `never` 寫出來的。
- 條件型別是入門就好：看得懂函式庫的定義就夠了。
