# `useForm` (lite)

## Features

- Easily manage the state of your forms
- Re-render the component only when needed
- Type-safety and automatic transformation of form values
  - The value of `number`, `checkbox` and `date` inputs are transformed to `number`, `boolean` and `Date` respectively
- Simplicity (it doesn't do that much for now lol)

## Installation

```shell
$ npm i use-form-lite
```

## Usage

```tsx
import useForm from "use-form-lite";

type Props = {
  onSubmit: (transaction: Transaction) => void;
};

export default function AddTransactionForm({ onSubmit }: Props) {
  const { value, handleChange, handleSubmit } = useForm<Transaction>({
    initialValue: {
      type: "EXPENSE",
      title: "Food",
      amount: 50_000,
    },

    // transaction is of type Transaction:
    onSubmit(transaction) {
      onSubmit(transaction);
    },
    // Could also just be:
    // onSubmit,

    // If you don't wan't to manually enable re-rendering on every field:
    // renderAllChanges: true,
  });

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="type">Type</label>
        {/*
          Since this field is used for conditional rendering below,
          we need to re-render every change (that's why `{ render: true }`)
        */}
        <select
          id="type"
          defaultValue={value.type}
          onChange={handleChange("type", { render: true })}
        >
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>
      </div>

      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          defaultValue={value.title}
          onChange={handleChange("title")}
        />
      </div>

      <div>
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          id="amount"
          min={0}
          defaultValue={value.amount}
          onChange={handleChange("amount")}
        />
      </div>

      {value.type === "EXPENSE" && <p>Remember to save money!</p>}

      <div>
        <button>Add transaction</button>
      </div>
    </form>
  );
}
```

## TODO

- (!) Testing
- (?) Validation by allowing the integration of external libraries
- (?) Move `index.d.ts` to `dist/`

## License

MIT
