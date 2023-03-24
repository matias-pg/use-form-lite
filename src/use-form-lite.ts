import {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  useRef,
  useState,
} from "react";

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

type Options<T> = {
  /** The initial value of this form. */
  initialValue: T;

  /** Whether to re-render when any value changes. */
  renderAllChanges?: boolean;

  /** Function that's called when the form is submitted. */
  onSubmit?: (value: T) => void;
};

type HandleChangeOptions = {
  /** Whether to re-render when the value changes. */
  render?: boolean;
};

/**
 * Initializes the form state.
 *
 * @param options Options to configure the behavior of this hook
 * @returns An object containing fields/methods to read/update the form state
 */
export default function useForm<T>(options: Options<T>) {
  // Use a ref so we don't re-render the whole component when a value changes
  const formValue = useRef<T>(options.initialValue);

  // Since we don't re-render on value changes, we still need a way to
  // re-render when a specific field changes, e.g. when a field is conditionally
  // rendered based on another field's value
  // This may be a premature optimization, but I wanted to try this trick that
  // I saw on SWR's codebase a few years ago
  const [, rerender] = useState({});

  function reRenderIf(render = false) {
    if (render || options.renderAllChanges) {
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
      options: HandleChangeOptions = {}
    ): ChangeEventHandler<E> {
      return ({ currentTarget: { value, type } }: ChangeEvent<E>) => {
        const newValue = transformValue(value, type);
        formValue.current = { ...formValue.current, [fieldName]: newValue };

        reRenderIf(options.render);
      };
    },

    /**
     * Partially updates the form value.
     *
     * @param changes Changes to be made
     */
    patchValue(changes: Partial<T>, options: HandleChangeOptions = {}) {
      formValue.current = { ...formValue.current, ...changes };

      reRenderIf(options.render);
    },

    /**
     * Handles the submit event of this form.
     */
    handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();

      options.onSubmit?.(formValue.current);
    },
  };
}
