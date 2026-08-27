import { COLUMN_TYPES, resolveColumnType } from './columnTypes'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[+]?[\d\s()-]{7,20}$/
const NUMBER_PATTERN = /^-?\d+(\.\d+)?$/

const GENDER_VALUES = new Set(['male', 'female', 'other', 'm', 'f', 'o'])
const STATUS_VALUES = new Set(['active', 'inactive', 'pending'])

/** Accepts YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY, MM/DD/YYYY */
function isValidDate(value) {
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/
  const dmy = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/

  let year
  let month
  let day

  const isoMatch = value.match(iso)
  if (isoMatch) {
    ;[, year, month, day] = isoMatch.map(Number)
  } else {
    const dmyMatch = value.match(dmy)
    if (!dmyMatch) return false
    const a = Number(dmyMatch[1])
    const b = Number(dmyMatch[2])
    year = Number(dmyMatch[3])
    if (a > 12) {
      day = a
      month = b
    } else if (b > 12) {
      month = a
      day = b
    } else {
      const asDmy = isRealDate(year, b, a)
      const asMdy = isRealDate(year, a, b)
      return asDmy || asMdy
    }
  }

  return isRealDate(year, month, day)
}

function isRealDate(year, month, day) {
  if (!year || !month || !day) return false
  if (month < 1 || month > 12 || day < 1 || day > 31) return false
  const date = new Date(year, month - 1, day)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

/**
 * Central validator map — shared by EVERY pool template.
 * New template columns with type "email" | "date" | … use these automatically.
 */
const VALIDATORS = {
  [COLUMN_TYPES.TEXT]: () => null,

  [COLUMN_TYPES.EMAIL]: (value) =>
    EMAIL_PATTERN.test(value)
      ? null
      : 'Enter a valid email (e.g. name@company.com)',

  [COLUMN_TYPES.DATE]: (value) =>
    isValidDate(value)
      ? null
      : 'Enter a valid date (YYYY-MM-DD or DD/MM/YYYY)',

  [COLUMN_TYPES.GENDER]: (value) =>
    GENDER_VALUES.has(value.toLowerCase())
      ? null
      : 'Enter Male, Female, or Other',

  [COLUMN_TYPES.NUMBER]: (value) =>
    NUMBER_PATTERN.test(value.replace(/,/g, ''))
      ? null
      : 'Enter a valid number',

  [COLUMN_TYPES.PHONE]: (value) =>
    PHONE_PATTERN.test(value) ? null : 'Enter a valid phone number',

  [COLUMN_TYPES.STATUS]: (value) =>
    STATUS_VALUES.has(value.toLowerCase())
      ? null
      : 'Enter Active, Inactive, or Pending',
}

/**
 * Validates a cell using the column definition from any pool template.
 * Empty cells are allowed (user may fill later).
 * @returns {string|null} error message or null when valid
 */
export function validateCellValue(value, column) {
  const trimmed = String(value ?? '').trim()
  if (!trimmed) return null

  const type = resolveColumnType(column)
  const validator = VALIDATORS[type] ?? VALIDATORS[COLUMN_TYPES.TEXT]
  return validator(trimmed)
}

/**
 * Scans all rows/columns for any template.
 * Automatically picks validators from each column's type (or key fallback).
 * @returns {{ [cellKey: string]: string }} map of "row:col" → error message
 */
export function getInvalidCells(rows, columns) {
  const invalid = {}

  rows.forEach((row, rowIndex) => {
    columns.forEach((column, colIndex) => {
      const message = validateCellValue(row[colIndex], column)
      if (message) {
        invalid[`${rowIndex}:${colIndex}`] = message
      }
    })
  })

  return invalid
}
