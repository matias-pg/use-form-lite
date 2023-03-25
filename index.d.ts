/// <reference types="react" />
declare module "use-form-lite" {
    import { ChangeEventHandler, FormEvent } from "react";
    type FormField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
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
    export default function useForm<T>(options: Options<T>): {
        /**
         * Returns the form value until the last render.
         *
         * Since the component may not be re-rendered after every change, this
         * value may be outdated.
         *
         * To get the up-to-date form value, use {@link getValue()}.
         */
        value: T;
        /**
         * Returns the current form value.
         */
        getValue(): T;
        /**
         * Handles the submit event of this form.
         */
        handleSubmit(event: FormEvent<HTMLFormElement>): void;
        /**
         * Creates an event handler that updates the value of a form field.
         *
         * @param fieldName Name of the field
         * @returns The event handler
         */
        handleChange<E extends FormField>(fieldName: keyof T, options?: HandleChangeOptions): ChangeEventHandler<E>;
        /**
         * Partially updates the form value.
         *
         * @param changes Changes to be made
         */
        patchValue(changes: Partial<T>, options?: HandleChangeOptions): void;
    };
}
