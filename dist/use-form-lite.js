import { useRef as d, useState as V } from "react";
const a = {
  number: (e) => Number(e),
  // The timezone is missing on purpose to use the local one
  date: (e) => new Date(e + "T00:00:00")
};
function h(e, r) {
  return r in a ? a[r](e) : e;
}
function R(e) {
  const r = d(e.initialValue), [, c] = V({});
  function t(n = !1) {
    (n || e.renderAllChanges) && c({});
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
    handleChange(n, u = {}) {
      return ({ currentTarget: { value: l, type: f } }) => {
        const m = h(l, f);
        r.current = { ...r.current, [n]: m }, t(u.render);
      };
    },
    /**
     * Partially updates the form value.
     *
     * @param changes Changes to be made
     */
    patchValue(n, u = {}) {
      r.current = { ...r.current, ...n }, t(u.render);
    },
    /**
     * Handles the submit event of this form.
     */
    handleSubmit(n) {
      var u;
      n.preventDefault(), (u = e.onSubmit) == null || u.call(e, r.current);
    }
  };
}
export {
  R as default
};
