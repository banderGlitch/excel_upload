/**
 * API contracts — keep UI + mock data aligned with future backend responses.
 */

export const API_RECORD_STATUS = {
  RECEIVED: 'received',
  VALIDATED: 'validated',
  FAILED: 'failed',
} as const

export type ApiRecordStatus =
  (typeof API_RECORD_STATUS)[keyof typeof API_RECORD_STATUS]

export type ColumnType =
  | 'text'
  | 'email'
  | 'date'
  | 'gender'
  | 'number'
  | 'phone'
  | 'status'

export interface PoolColumn {
  key: string
  label: string
  type: ColumnType
  /** true = not in Excel upload / not in detail data columns */
  backendOnly?: boolean
}

export interface PoolTemplate {
  id: string
  name: string
  description: string
  columns: PoolColumn[]
}

/** Business fields only — no status/remark here */
export type PoolRecordValues = Record<string, string>

export interface PoolRecord {
  id: string
  values: PoolRecordValues
  status: ApiRecordStatus
  remark: string
  errorKeys: string[]
}

/**
 * Flat row used by UI tables/editors.
 * Pipeline status is `recordStatus` so it never clashes with a business `status` column.
 */
export interface UiPoolRecord {
  id: string
  recordStatus: ApiRecordStatus
  remark: string
  errorKeys: string[]
  [fieldKey: string]: string | string[] | ApiRecordStatus
}

export interface ApiListResponse<T> {
  data: T
}

export interface UploadRowsResponse {
  createdCount: number
  records: PoolRecord[]
}

export interface RetryRowsResponse {
  updatedCount: number
  records: PoolRecord[]
}

export interface RetryRowPayload {
  id: string
  values: PoolRecordValues
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}
