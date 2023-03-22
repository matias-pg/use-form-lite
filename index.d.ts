/// <reference types="react" />
declare module "use-form-lite" {
    import { ChangeEventHandler, FormEvent } from "react";
    type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    type FormConfig<T> = {
        /** The initial value of this form. */
        initialValue: T;
        /** Whether to re-render when any value changes. */
        renderAllChanges?: boolean;
        /** Function that's called when the form is submitted. */
        onSubmit?: (value: T) => void;
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
    export default function useForm<T>(config: FormConfig<T>): {
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
         * Creates an event handler that updates the value of a form field.
         *
         * @param fieldName Name of the field
         * @returns The event handler
         */
        handleChange<E extends FormElement>(fieldName: keyof T, { render }?: HandleChangeConfig): ChangeEventHandler<E>;
        /**
         * Partially updates the form value.
         *
         * @param changes Changes to be made
         */
        patchValue(changes: Partial<T>, { render }?: HandleChangeConfig): void;
        /**
         * Handles the submit event of this form.
         */
        handleSubmit(event: FormEvent<HTMLFormElement>): void;
    };
}
