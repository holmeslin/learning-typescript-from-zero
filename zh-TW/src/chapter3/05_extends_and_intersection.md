# `extends` 與交集型別

## 本集目標

用 `extends` 和 `&`，從現有的物件型別組合出新的型別。

## 正文

### 從現有的型別延伸

狗是一種動物：動物有名字，狗除了名字，還有品種。與其把 `name` 再寫一次，可以讓 `Dog` **延伸**（extend）`Animal`。建立 `animal.ts`：

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

const dog: Dog = { name: "小黑", breed: "柴犬" };
console.log(`${dog.name} 是${dog.breed}`);
```

`interface Dog extends Animal` 的意思是：`Dog` 擁有 `Animal` 的所有屬性，再加上自己的 `breed`。

### 用 `&` 組合

`type` 沒有 `extends`，但可以用 `&` 達到一樣的效果：

```ts
type Animal = {
  name: string;
};

type Dog = Animal & {
  breed: string;
};

const dog: Dog = { name: "小黑", breed: "柴犬" };
console.log(`${dog.name} 是${dog.breed}`);
```

`A & B` 叫**交集型別**（intersection type），意思是「同時是 `A` 也是 `B`」。放在物件型別上，結果就是「兩邊的屬性都要有」。

少了任何一邊的屬性都不行：

```ts,fails
type Animal = {
  name: string;
};

type Dog = Animal & {
  breed: string;
};

const dog: Dog = { breed: "柴犬" };
console.log(dog);
```

```text
animal.ts:9:7 - error TS2322: Type '{ breed: string; }' is not assignable to type 'Dog'.
  Property 'name' is missing in type '{ breed: string; }' but required in type 'Animal'.

9 const dog: Dog = { breed: "柴犬" };
        ~~~

  animal.ts:2:3 - 'name' is declared here.
    2   name: string;
        ~~~~


Found 1 error in animal.ts:9
```

這則錯誤訊息有兩層：第一行說「這個物件不能放進 `Dog`」，縮排的第二行說明原因：「少了 `Animal` 要求的 `name`」。TypeScript 的錯誤常常這樣一層一層往下講，**原因通常在最後一層**。

### 組合好幾塊

`&` 可以一次接好幾個型別。把常常一起出現的屬性拆成小塊，需要的時候組起來：

```ts
type HasId = { id: number };
type HasTimestamps = { createdAt: string; updatedAt: string };

type Post = HasId & HasTimestamps & {
  title: string;
};

const post: Post = {
  id: 1,
  title: "第一篇文章",
  createdAt: "2026-10-01",
  updatedAt: "2026-10-02",
};
console.log(post.title);
```

### 不要把 `&` 用在字串、數字上

`&` 是「同時是兩種型別」。一個值不可能同時是字串又是數字，所以 `string & number` 不會報錯，但沒有任何值放得進去。`&` 只拿來組合物件型別就好。

和 `&` 相對的是 `|`，意思是「其中一種就好」，第 5 章會詳細講。

## 重點整理

- `interface B extends A` 讓 `B` 擁有 `A` 的所有屬性，再加上自己的。
- `A & B` 是交集型別，用在物件上表示兩邊的屬性都要有。
- `type` 用 `&` 組合，`interface` 用 `extends` 延伸，效果差不多。
- 錯誤訊息有好幾層時，原因通常寫在最後一層。
