import { useRef as f, useState as i } from "react";
const a = {
  number: (e) => Number(e),
  // The timezone is missing on purpose to use the local one
  date: (e) => new Date(e + "T00:00:00")
};
function m(e, r) {
  return r in a ? a[r](e) : e;
}
function d(e) {
  const r = f(e.initialValue), [, c] = i({});
  function u(n) {
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
    handleChange(n, { render: t = !1 } = {}) {
      return ({ currentTarget: { value: l, type: o } }) => {
        const s = m(l, o);
        r.current = { ...r.current, [n]: s }, u(t);
      };
    },
    /**
     * Partially updates the form value.
     *
     * @param changes Changes to be made
     * @param render Whether to re-render
     */
    patchValue(n, { render: t = !1 } = {}) {
      r.current = { ...r.current, ...n }, u(t);
    }
  };
}
export {
  d as default
};
