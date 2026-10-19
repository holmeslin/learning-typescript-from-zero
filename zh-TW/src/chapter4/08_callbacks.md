# callback 的型別

## 本集目標

幫「接收函式當參數」的函式標上型別，並看懂 callback 的參數為什麼不用寫型別。

## 正文

把函式當成引數傳給另一個函式，這個被傳進去的函式叫做回呼函式（callback）。你在 JavaScript 裡已經用過很多次，例如 `map` 和 `filter`。

### 參數是一個函式

參數是函式的時候，它的型別就寫上一集的函式型別。建立 `repeat.ts`：

```ts
function repeat(times: number, action: (round: number) => void) {
  for (let i = 1; i <= times; i++) {
    action(i);
  }
}

repeat(3, (round) => {
  console.log(`第 ${round} 次`);
});
```

```text
第 1 次
第 2 次
第 3 次
```

`action: (round: number) => void` 的意思是：「`action` 是一個函式，它會收到一個數字，不用回傳任何東西」。

呼叫 `repeat` 時，傳進去的箭頭函式 `(round) => { ... }` 沒有幫 `round` 標型別。TypeScript 看到這個函式要放進 `action` 這個位置，就從 `action` 的型別知道 `round` 是數字。這就是上一集說的「從使用的位置推論出型別」。

這也是為什麼你寫 `[1, 2, 3].map((n) => n * 2)` 時不用幫 `n` 標型別：TypeScript 知道陣列裡是數字，`map` 的 callback 收到的當然也是數字。

### callback 的型別不合

如果你自己標了型別，而且跟 `action` 要的不一樣：

```ts,fails
function repeat(times: number, action: (round: number) => void) {
  for (let i = 1; i <= times; i++) {
    action(i);
  }
}

repeat(2, (round: string) => {
  console.log(round.padStart(3, "0"));
});
```

```text
repeat.ts:7:11 - error TS2345: Argument of type '(round: string) => void' is not assignable to parameter of type '(round: number) => void'.
  Types of parameters 'round' and 'round' are incompatible.
    Type 'number' is not assignable to type 'string'.

7 repeat(2, (round: string) => {
            ~~~~~~~~~~~~~~~~~~~~


Found 1 error in repeat.ts:7
```

這則錯誤有三層縮排，由外往內讀：

1. 你傳的函式型別，不能放進 `action` 要的函式型別。
2. 原因是兩邊的參數 `round` 型別不合。
3. 再往下是：`repeat` 會傳數字進來，但你的函式要的是字串。

TypeScript 的錯誤訊息常常像這樣一層一層往下說明原因。**最底下那一層通常就是真正的問題。**

### 回傳 `void` 的 callback 可以回傳值

最後一個細節。看這段：

```ts
function repeat(times: number, action: (round: number) => void) {
  for (let i = 1; i <= times; i++) {
    action(i);
  }
}

const rounds: number[] = [];
repeat(3, (round) => rounds.push(round));
console.log(rounds);
```

```text
[ 1, 2, 3 ]
```

`rounds.push(round)` 會回傳陣列的新長度，所以這個箭頭函式其實回傳了數字。可是 `action` 的型別說回傳 `void`，為什麼沒有報錯？

這就是第 3 集說的 `void` 的意思：「別管我回傳什麼，不要用它」。callback 的型別寫 `void`，代表 `repeat` 不會使用 callback 的回傳值，所以你回傳什麼都沒關係。這讓簡短的箭頭函式寫起來很方便。

（第 3 集那個「寫了 `: void` 就不能 `return` 值」的規則，是用在你自己宣告函式、直接寫上回傳型別的時候。）

## 重點整理

- 參數是函式時，用函式型別描述它，例如 `action: (round: number) => void`。
- 傳 callback 進去時，參數不用寫型別，TypeScript 會從參數的位置推論出來。
- 錯誤訊息有好幾層縮排時，由外往內讀，最底下那層通常是真正的原因。
- callback 的回傳型別是 `void` 時，傳進去的函式回傳什麼都可以。
