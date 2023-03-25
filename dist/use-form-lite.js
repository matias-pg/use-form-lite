import { useRef as d, useState as h } from "react";
const a = {
  number: ({ value: e }) => Number(e),
  checkbox: ({ checked: e }) => e,
  // The timezone is missing on purpose to use the local one
  date: ({ value: e }) => new Date(e + "T00:00:00")
};
function V(e) {
  if (e.type in a) {
    const r = a[e.type];
    return r(e);
  }
  return e.value;
}
function m(e) {
  const r = d(e.initialValue), [, c] = h({});
  function u(t = !1) {
    (t || e.renderAllChanges) && c({});
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
     * Handles the submit event of this form.
     */
    handleSubmit(t) {
      var n;
      t.preventDefault(), (n = e.onSubmit) == null || n.call(e, r.current);
    },
    /**
     * Creates an event handler that updates the value of a form field.
     *
     * @param fieldName Name of the field
     * @returns The event handler
     */
    handleChange(t, n = {}) {
      return ({ currentTarget: l }) => {
        const f = V(l);
        r.current = { ...r.current, [t]: f }, u(n.render);
      };
    },
    /**
     * Partially updates the form value.
     *
     * @param changes Changes to be made
     */
    patchValue(t, n = {}) {
      r.current = { ...r.current, ...t }, u(n.render);
    }
  };
}
export {
  m as default
};
