# 聯集型別

## 本集目標

用 `|` 寫出「這幾種型別之一」，並知道拿到這種值之後能做什麼、不能做什麼。

## 正文

### 用 `|` 列出可能的型別

商品編號有時候是數字，有時候是字串。建立 `print-id.ts`：

```ts,fails
function printId(id: string | number) {
  console.log(`編號：${id}`);
}

printId(101);
printId("A01");
printId(true);
```

`string | number` 讀作「字串或數字」。這種用 `|` 把好幾個型別接起來的寫法，叫**聯集型別**（union type）。傳字串、傳數字都可以，傳布林值就不行：

```text
print-id.ts:7:9 - error TS2345: Argument of type 'boolean' is not assignable to parameter of type 'string | number'.

7 printId(true);
          ~~~~


Found 1 error in print-id.ts:7
```

「布林值不能放進『字串或數字』」。

聯集可以接任意多個型別，也可以搭配第 2 章的型別別名取個名字：

```ts
type Id = string | number;

const ids: Id[] = [101, "A01", 102];
console.log(ids);
```

`Id[]` 是「每個元素都是字串或數字」的陣列。

### 第 2 章的 `string | null` 就是聯集

第 2 章看過的 `string | null`，就是「字串或 `null`」的聯集型別，沒有什麼特別的語法。

### 能用的只有「每一種都有」的東西

聯集型別的值，TypeScript 只讓你做「每一種型別都能做」的事。建立 `format-id.ts`：

```ts,fails
function formatId(id: string | number) {
  return id.toUpperCase();
}

console.log(formatId("a01"));
```

```text
format-id.ts:2:13 - error TS2339: Property 'toUpperCase' does not exist on type 'string | number'.
  Property 'toUpperCase' does not exist on type 'number'.

2   return id.toUpperCase();
              ~~~~~~~~~~~


Found 1 error in format-id.ts:2
```

第二行縮排的說明把原因講得很清楚：「數字沒有 `toUpperCase`」。`id` 有可能是數字，TypeScript 不能讓你冒這個險。

上面的 `printId` 沒有問題，是因為放進樣板字面值裡，字串和數字都可以。

`string | null` 也是一樣的道理。建立 `shout.ts`：

```ts,fails
function shout(name: string | null) {
  return name.toUpperCase();
}

console.log(shout("hi"));
```

```text
shout.ts:2:10 - error TS18047: 'name' is possibly 'null'.

2   return name.toUpperCase();
           ~~~~


Found 1 error in shout.ts:2
```

「`name` 有可能是 `null`」。這是開了 `strict` 之後最常看到的錯誤之一，它幫你擋掉了 JavaScript 裡最常見的當機原因：對 `null` 讀屬性。

那要怎麼用到 `toUpperCase`？你得先**確認**它是字串。怎麼確認、TypeScript 又怎麼知道你確認過了，就是接下來幾集的主題：**型別縮小**。

## 重點整理

- `A | B` 是聯集型別，意思是「`A` 或 `B`」，可以接任意多個型別。
- `string | null` 就是聯集型別。
- 聯集型別的值，只能做「每一種型別都能做」的事。
- 想用某一種型別才有的功能，要先確認它是哪一種，這叫型別縮小。
