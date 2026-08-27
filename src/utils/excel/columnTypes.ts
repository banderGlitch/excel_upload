/**
 * Supported column validation types.
 * Add a new pool template? Just set column.type to one of these —
 * row validation / highlighting applies automatically.
 */
export const COLUMN_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  DATE: 'date',
  GENDER: 'gender',
  NUMBER: 'number',
  PHONE: 'phone',
  STATUS: 'status',
} as const

export type ColumnTypeValue =
  (typeof COLUMN_TYPES)[keyof typeof COLUMN_TYPES]

/** All supported type strings (for docs / API contracts). */
export const SUPPORTED_COLUMN_TYPES: ColumnTypeValue[] =
  Object.values(COLUMN_TYPES)

export interface ColumnLike {
  key?: string
  type?: string
  label?: string
}

/**
 * If a future API/template omits `type`, infer it from the column key.
 * e.g. key: 'workEmail' | 'email' → email validator
 */
const KEY_TYPE_HINTS: { match: RegExp; type: ColumnTypeValue }[] = [
  { match: /(^|_)email$/i, type: COLUMN_TYPES.EMAIL },
  { match: /email/i, type: COLUMN_TYPES.EMAIL },
  { match: /(^|_)gender$/i, type: COLUMN_TYPES.GENDER },
  { match: /gender/i, type: COLUMN_TYPES.GENDER },
  { match: /(date|dob|joinDate|startDate|endDate)/i, type: COLUMN_TYPES.DATE },
  { match: /(phone|mobile|contactNo|contactNumber)/i, type: COLUMN_TYPES.PHONE },
  { match: /(status)/i, type: COLUMN_TYPES.STATUS },
  {
    match: /(stock|price|amount|qty|quantity|count|salary)/i,
    type: COLUMN_TYPES.NUMBER,
  },
]

/**
 * Resolves which validator to use for a column.
 * Priority: explicit column.type → inferred from key → text
 */
export function resolveColumnType(column: ColumnLike | null | undefined): ColumnTypeValue {
  const explicit = String(column?.type ?? '')
    .trim()
    .toLowerCase()

  if (
    explicit &&
    (SUPPORTED_COLUMN_TYPES as string[]).includes(explicit)
  ) {
    return explicit as ColumnTypeValue
  }

  const key = String(column?.key ?? '')
  for (const hint of KEY_TYPE_HINTS) {
    if (hint.match.test(key)) {
      return hint.type
    }
  }

  return COLUMN_TYPES.TEXT
}

export function isSupportedColumnType(type: unknown): type is ColumnTypeValue {
  return (SUPPORTED_COLUMN_TYPES as string[]).includes(
    String(type ?? '').toLowerCase(),
  )
}
