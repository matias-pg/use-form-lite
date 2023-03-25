import {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  useRef,
  useState,
} from "react";

// Add more elements as needed (these are the ones I remember for now)
type FormField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const EXTRACTORS_BY_TYPE = {
  number: ({ value }: HTMLInputElement) => Number(value),

  checkbox: ({ checked }: HTMLInputElement) => checked,

  // The timezone is missing on purpose to use the local one
  date: ({ value }: HTMLInputElement) => new Date(value + "T00:00:00"),
};

type Extractor = keyof typeof EXTRACTORS_BY_TYPE;

/**
 * Extracts the value depending on the field type.
 */
function extractValue(formField: FormField) {
  if (formField.type in EXTRACTORS_BY_TYPE) {
    const extractor = EXTRACTORS_BY_TYPE[formField.type as Extractor];
    return extractor(formField as Parameters<typeof extractor>[0]);
  }
  return formField.value;
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
     * Handles the submit event of this form.
     */
    handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();

      options.onSubmit?.(formValue.current);
    },

    /**
     * Creates an event handler that updates the value of a form field.
     *
     * @param fieldName Name of the field
     * @returns The event handler
     */
    handleChange<E extends FormField>(
      fieldName: keyof T,
      options: HandleChangeOptions = {}
    ): ChangeEventHandler<E> {
      return ({ currentTarget }: ChangeEvent<E>) => {
        const fieldValue = extractValue(currentTarget);
        formValue.current = { ...formValue.current, [fieldName]: fieldValue };

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
  };
}
