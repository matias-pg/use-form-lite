# `useForm` (lite)

## Features

- Easily track the status of your forms
- Re-render the component only when you need it
- Type-safety and automatic transformation of form values
  - `number` and `date` inputs are transformed to `number` and `Date` respectively
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
  const { value, handleChange, getValue } = useForm<Transaction>({
    initialValue: {
      type: "EXPENSE",
      title: "Food",
      amount: 50_000,
    },
    // If you don't wan't to manually enable re-rendering on all inputs, use this
    // renderAllChanges: true,
  });

  function onSubmitForm(event: FormEvent) {
    event.preventDefault();

    // Sends back a `Transaction`
    onSubmit(getValue());
  }

  return (
    <form onSubmit={onSubmitForm}>
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
- Add support for checkboxes: for now it uses only the `value` attribute, but it should use `checked` for them
- Allow configuring an `onSubmit` handler that receives the current form value as the first argument, and return a `handleSubmit` function that can be set as in `<form onSubmit={handleSubmit}>`
- (?) Validation by allowing the integration of external libraries
- (?) Move `index.d.ts` to `dist/`

## License

MIT
