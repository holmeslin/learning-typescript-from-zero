# 元組

## 本集目標

用元組表示「長度固定、每個位置型別固定」的陣列。

## 正文

### 每個位置的型別不一樣

有時候一個陣列裡，每個位置放的是不同意義的東西。例如座標的 x 和 y，或是「名字和年齡」這一對資料。建立 `tuple.ts`：

```ts
const point: [number, number] = [3, 4];
const student: [string, number] = ["小明", 20];

const [name, age] = student;
console.log(point[0] + point[1], name, age);
```

```text
7 小明 20
```

`[string, number]` 這種寫法叫**元組**（tuple）：長度固定，而且每個位置的型別都固定。`student` 一定剛好兩個元素，第一個是字串、第二個是數字。

和陣列的寫法比一比：

| 寫法 | 意思 |
| --- | --- |
| `number[]` | 陣列，長度不限，每個元素都是數字 |
| `[number, number]` | 元組，剛好兩個元素，兩個都是數字 |
| `[string, number]` | 元組，剛好兩個元素，第一個是字串、第二個是數字 |

解構也照常可以用。上面的 `const [name, age] = student` 裡，TypeScript 知道 `name` 是字串、`age` 是數字，把游標移上去就看得到。

### 順序放錯

元組的型別是照位置檢查的。建立 `order.ts`：

```ts,fails
const student: [string, number] = [20, "小明"];
console.log(student);
```

```text
order.ts:1:36 - error TS2322: Type 'number' is not assignable to type 'string'.

1 const student: [string, number] = [20, "小明"];
                                     ~~

order.ts:1:40 - error TS2322: Type 'string' is not assignable to type 'number'.

1 const student: [string, number] = [20, "小明"];
                                         ~~~~


Found 2 errors in the same file, starting at: order.ts:1
```

兩個位置都放錯了，所以有兩個錯誤，各自指出是哪一個。

### 長度不對

多放一個也不行。建立 `length.ts`：

```ts,fails
const point: [number, number] = [3, 4, 5];
console.log(point);
```

```text
length.ts:1:7 - error TS2322: Type '[number, number, number]' is not assignable to type '[number, number]'.
  Source has 3 element(s) but target allows only 2.

1 const point: [number, number] = [3, 4, 5];
        ~~~~~


Found 1 error in length.ts:1
```

錯誤說明的下一行多了一段縮排的補充：「來源有 3 個元素，但目標只允許 2 個」。很多錯誤訊息都會像這樣，在第一行底下補充細節，記得往下看。

讀超過長度的位置，也會被擋下來。把 `length.ts` 改成這樣：

```ts,fails
const point: [number, number] = [3, 4];
console.log(point[2]);
```

```text
length.ts:2:19 - error TS2493: Tuple type '[number, number]' of length '2' has no element at index '2'.

2 console.log(point[2]);
                    ~


Found 1 error in length.ts:2
```

在 JavaScript 裡，`point[2]` 只會默默得到 `undefined`。

### 什麼時候用元組

元組適合「兩三個、一看就知道每個位置是什麼」的資料，例如座標。如果位置一多，或是光看 `student[1]` 不知道是什麼意思，就該改用有屬性名稱的物件，第 3 章會教物件的型別。

## 重點整理

- 元組的寫法是 `[string, number]`，長度固定、每個位置的型別固定。
- 順序放錯、個數不對、讀超過長度的位置，TypeScript 都會報錯。
- 元組一樣可以解構，每個變數會拿到對應位置的型別。
- 位置多了或意義不明顯時，改用物件比較好讀。
