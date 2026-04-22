/** Combine class strings, filtering falsy values */
export const cn = (...classes) => classes.filter(Boolean).join(' ')
