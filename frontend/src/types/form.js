/**
 * @typedef {Object} FormField
 * @property {string} id
 * @property {string} label
 * @property {string} type
 * @property {any} [value]
 * @property {boolean} [required]
 * @property {string} [placeholder]
 * @property {Array<{label: string, value: string}>} [options]
 */

/**
 * @typedef {Object} Form
 * @property {string} id
 * @property {string} title
 * @property {FormField[]} fields
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

export {};