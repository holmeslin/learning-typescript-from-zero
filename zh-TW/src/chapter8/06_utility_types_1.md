# 工具型別（一）：改造物件型別

## 本集目標

用 `Partial`、`Required`、`Readonly`、`Pick`、`Omit` 從現有的物件型別產生新的型別。

## 正文

TypeScript 內建了一批泛型型別，專門用來把一個型別改造成另一個型別，叫做**工具型別**（utility type）。用法都一樣：角括號裡放進原本的型別，得到新的型別。

這一集介紹五個改造物件的工具型別，下面都用這個 `User` 當例子：

```ts
type User = { id: number; name: string; email: string };

const user: User = { id: 1, name: "小明", email: "ming@example.com" };
console.log(user);
```

### `Partial`：全部變成可選

更新使用者資料時，通常只會改其中幾個欄位。建立 `partial.ts`：

```ts,fails
type User = { id: number; name: string; email: string };

function updateUser(user: User, changes: Partial<User>): User {
  return { ...user, ...changes };
}

const user: User = { id: 1, name: "小明", email: "ming@example.com" };
console.log(updateUser(user, { email: "ming@example.tw" }));
console.log(updateUser(user, { nickname: "阿明" }));
```

`Partial<User>` 是「每個屬性都變成可選的 `User`」，等於：

```ts
type PartialUser = { id?: number; name?: string; email?: string };

const changes: PartialUser = { email: "ming@example.tw" };
console.log(changes);
```

所以只傳 `email` 沒問題。但 `User` 根本沒有的屬性還是會被擋下：

```text
partial.ts:9:32 - error TS2353: Object literal may only specify known properties, and 'nickname' does not exist in type 'Partial<User>'.

9 console.log(updateUser(user, { nickname: "阿明" }));
                                 ~~~~~~~~


Found 1 error in partial.ts:9
```

### `Required`：全部變成必填

`Required` 剛好相反，把所有可選屬性變成必填。建立 `required.ts`：

```ts,fails
type Options = { size?: number; color?: string };

const full: Required<Options> = { size: 12 };
console.log(full);
```

```text
required.ts:3:7 - error TS2741: Property 'color' is missing in type '{ size: number; }' but required in type 'Required<Options>'.

3 const full: Required<Options> = { size: 12 };
        ~~~~

  required.ts:1:33 - 'color' is declared here.
    1 type Options = { size?: number; color?: string };
                                      ~~~~~


Found 1 error in required.ts:3
```

常見的用法是：使用者傳進來的設定是 `Options`，可以只填一部分；你補上預設值之後，內部用的設定就是 `Required<Options>`，每個屬性都保證有值。

### `Readonly`：全部變成唯讀

`Readonly<User>` 是每個屬性都加上第 3 章的 `readonly`。建立 `readonly.ts`：

```ts,fails
type User = { id: number; name: string };

const user: Readonly<User> = { id: 1, name: "小明" };
user.name = "小華";
console.log(user);
```

```text
readonly.ts:4:6 - error TS2540: Cannot assign to 'name' because it is a read-only property.

4 user.name = "小華";
       ~~~~


Found 1 error in readonly.ts:4
```

### `Pick`：只留下某些屬性

`Pick<User, "id" | "name">` 是「只留下 `id` 和 `name` 的 `User`」。第二個型別參數放屬性名稱的聯集，而且只能放 `User` 真的有的屬性名稱。建立 `pick.ts`：

```ts,fails
type User = { id: number; name: string; email: string; password: string };

type UserPreview = Pick<User, "id" | "name">;

const preview: UserPreview = { id: 1 };
console.log(preview);
```

```text
pick.ts:5:7 - error TS2741: Property 'name' is missing in type '{ id: number; }' but required in type 'UserPreview'.

5 const preview: UserPreview = { id: 1 };
        ~~~~~~~

  pick.ts:1:27 - 'name' is declared here.
    1 type User = { id: number; name: string; email: string; password: string };
                                ~~~~


Found 1 error in pick.ts:5
```

### `Omit`：拿掉某些屬性

`Omit` 和 `Pick` 相反，列出要**拿掉**的屬性。例如要顯示在畫面上的使用者，不應該有密碼。建立 `omit.ts`：

```ts,fails
type User = { id: number; name: string; email: string; password: string };

type PublicUser = Omit<User, "password">;

const shown: PublicUser = {
  id: 1,
  name: "小明",
  email: "ming@example.com",
  password: "123456",
};
console.log(shown);
```

```text
omit.ts:9:3 - error TS2353: Object literal may only specify known properties, and 'password' does not exist in type 'PublicUser'.

9   password: "123456",
    ~~~~~~~~


Found 1 error in omit.ts:9
```

要留下的屬性少，用 `Pick`；要拿掉的屬性少，用 `Omit`。

### 為什麼不自己寫

這五個型別，你都可以用第 3 章的寫法一個字一個字寫出來。但工具型別是從 `User` **算**出來的：`User` 多了一個屬性，`Partial<User>`、`Omit<User, "password">` 全部自動跟著變，不會有哪一份忘了改。

## 重點整理

- 工具型別是 TypeScript 內建的泛型型別，用來從現有的型別產生新的型別。
- `Partial<T>` 讓所有屬性變可選，`Required<T>` 讓所有屬性變必填。
- `Readonly<T>` 讓所有屬性變唯讀。
- `Pick<T, 屬性名稱>` 只留下指定的屬性，`Omit<T, 屬性名稱>` 拿掉指定的屬性。
