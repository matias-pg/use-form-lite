import { ChangeEvent, ChangeEventHandler, useRef, useState } from "react";

// Add more elements as needed (these are the ones I remember for now)
type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

// TODO: Use "extractors" to use different properties depending on the type
// (e.g. use `checked` for checkboxes) rather than just the value property
const VALUE_TRANSFORMERS = {
  number: (value: string) => Number(value),

  // The timezone is missing on purpose to use the local one
  date: (value: string) => new Date(value + "T00:00:00"),
};

/**
 * Transforms a value depending on the field type.
 */
function transformValue(value: string, fieldType: string) {
  return fieldType in VALUE_TRANSFORMERS
    ? VALUE_TRANSFORMERS[fieldType as keyof typeof VALUE_TRANSFORMERS](value)
    : value;
}

type FormConfig<T> = {
  /** The initial value of this form. */
  initialValue: T;

  /** Whether to re-render when any value changes. */
  renderAllChanges?: boolean;
};

type HandleChangeConfig = {
  /** Whether to re-render when the value changes. */
  render?: boolean;
};

/**
 * Returns an object containing the current form value and a function that
 * creates event handlers for when a field value changes.
 *
 * @param config Form configuration
 * @returns An object containing the current value of the
 */
export default function useForm<T>(config: FormConfig<T>) {
  // Use a ref so we don't re-render the whole component when a value changes
  const formValue = useRef<T>(config.initialValue);

  // Since we don't re-render on value changes, we still need a way to
  // re-render when a specific field changes, e.g. when a field is conditionally
  // rendered based on another field's value
  // This may be a premature optimization, but I wanted to try this trick that
  // I saw on SWR's codebase a few years ago
  const [, rerender] = useState({});

  function rerenderIf(render: boolean) {
    if (render || config.renderAllChanges) {
      // This always re-renders since it sets a different reference
      rerender({});
    }
  }

  return {
    /**
     * Returns the form value until the last render.
     *
     * Since the component may not be re-rendered after every change, this
     * value may be outdated.
     *
     * To get the up-to-date form value, use {@link getValue()}.
     */
    value: formValue.current,

    /**
     * Returns the current form value.
     */
    getValue() {
      return formValue.current;
    },

    /**
     * Creates an event handler that updates the value of a form field.
     *
     * @param fieldName Name of the field
     * @returns The event handler
     */
    handleChange<E extends FormElement>(
      fieldName: keyof T,
      { render = false }: HandleChangeConfig = {}
    ): ChangeEventHandler<E> {
      return ({ currentTarget: { value, type } }: ChangeEvent<E>) => {
        const newValue = transformValue(value, type);
        formValue.current = { ...formValue.current, [fieldName]: newValue };

        rerenderIf(render);
      };
    },

    /**
     * Partially updates the form value.
     *
     * @param changes Changes to be made
     * @param render Whether to re-render
     */
    patchValue(
      changes: Partial<T>,
      { render = false }: HandleChangeConfig = {}
    ) {
      formValue.current = { ...formValue.current, ...changes };

      rerenderIf(render);
    },
  };
}
