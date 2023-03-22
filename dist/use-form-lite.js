import { useRef as o, useState as V } from "react";
const a = {
  number: (e) => Number(e),
  // The timezone is missing on purpose to use the local one
  date: (e) => new Date(e + "T00:00:00")
};
function d(e, r) {
  return r in a ? a[r](e) : e;
}
function h(e) {
  const r = o(e.initialValue), [, l] = V({});
  function u(t) {
    (t || e.renderAllChanges) && l({});
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
    value: r.current,
    /**
     * Returns the current form value.
     */
    getValue() {
      return r.current;
    },
    /**
     * Creates an event handler that updates the value of a form field.
     *
     * @param fieldName Name of the field
     * @returns The event handler
     */
    handleChange(t, { render: n = !1 } = {}) {
      return ({ currentTarget: { value: s, type: c } }) => {
        const m = d(s, c);
        r.current = { ...r.current, [t]: m }, u(n);
      };
    },
    /**
     * Partially updates the form value.
     *
     * @param changes Changes to be made
     */
    patchValue(t, { render: n = !1 } = {}) {
      r.current = { ...r.current, ...t }, u(n);
    },
    /**
     * Handles the submit event of this form.
     */
    handleSubmit(t) {
      var n;
      t.preventDefault(), (n = e.onSubmit) == null || n.call(e, r.current);
    }
  };
}
export {
  h as default
};
