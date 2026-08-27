/**
 * API contracts — keep UI + mock data aligned with future backend responses.
 *
 * ---------------------------------------------------------------------------
 * GET /api/pools
 * ---------------------------------------------------------------------------
 * {
 *   data: PoolTemplate[]
 * }
 *
 * PoolTemplate:
 * {
 *   id: string,                 // e.g. "employee-pool"
 *   name: string,
 *   description: string,
 *   columns: PoolColumn[]
 * }
 *
 * PoolColumn:
 * {
 *   key: string,                // field id in record.values
 *   label: string,              // Excel header text
 *   type: 'text'|'email'|'date'|'gender'|'number'|'phone'|'status',
 *   backendOnly?: boolean       // true = not in Excel upload / not in grid
 * }
 *
 * ---------------------------------------------------------------------------
 * GET /api/pools/:poolId/records
 * ---------------------------------------------------------------------------
 * {
 *   data: PoolRecord[]
 * }
 *
 * PoolRecord:
 * {
 *   id: string,
 *   values: { [columnKey: string]: string },  // business fields only
 *   status: 'received' | 'validated' | 'failed',
 *   remark: string,             // backend message (Failed rows)
 *   errorKeys: string[]         // column keys to highlight (can be multiple)
 * }
 *
 * ---------------------------------------------------------------------------
 * POST /api/pools/:poolId/upload
 * ---------------------------------------------------------------------------
 * body: { rows: Array<{ [columnKey: string]: string }> }
 * // no status / remark in payload — backend assigns status
 *
 * ---------------------------------------------------------------------------
 * POST /api/pools/:poolId/retry
 * ---------------------------------------------------------------------------
 * body: {
 *   rows: Array<{ id: string, values: { [columnKey: string]: string } }>
 * }
 * // no status / remark — backend re-validates and updates remark/errorKeys/status
 */

export const API_RECORD_STATUS = {
  RECEIVED: 'received',
  VALIDATED: 'validated',
  FAILED: 'failed',
}
