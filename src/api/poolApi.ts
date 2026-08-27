/**
 * Pool API client (mock).
 * Swap implementations here later to call real HTTP endpoints.
 *
 * Endpoints (planned):
 *   GET  /api/pools
 *   GET  /api/pools/:poolId/records
 *   POST /api/pools/:poolId/upload
 *   POST /api/pools/:poolId/retry
 */
import { POOL_TEMPLATES, getPoolTemplateById } from '../data/poolTemplates'
import { MOCK_API_RECORDS } from './mockDb'
import {
  API_RECORD_STATUS,
  ApiError,
  type ApiListResponse,
  type PoolRecord,
  type PoolRecordValues,
  type PoolTemplate,
  type RetryRowPayload,
  type RetryRowsResponse,
  type UiPoolRecord,
  type UploadRowsResponse,
} from './contracts'
import { apiRecordToUi, gridRowToApiRecord, uiRecordToApi } from './normalize'

const delay = (ms = 120) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/** In-memory store so uploads/retries persist during the session */
const recordStore: Record<string, PoolRecord[]> = structuredClone(MOCK_API_RECORDS)

function ensurePool(poolId: string): PoolRecord[] {
  if (!recordStore[poolId]) recordStore[poolId] = []
  return recordStore[poolId]
}

/** GET /api/pools */
export async function fetchPoolTemplates(): Promise<ApiListResponse<PoolTemplate[]>> {
  await delay()
  return {
    data: POOL_TEMPLATES.map((template) => ({
      id: template.id,
      name: template.name,
      description: template.description,
      columns: template.columns.map((column) => ({ ...column })),
    })),
  }
}

/** GET /api/pools/:poolId */
export async function fetchPoolTemplate(
  poolId: string,
): Promise<ApiListResponse<PoolTemplate>> {
  await delay()
  const template = getPoolTemplateById(poolId)
  if (!template) {
    throw new ApiError(`Pool not found: ${poolId}`, 404)
  }
  return {
    data: {
      id: template.id,
      name: template.name,
      description: template.description,
      columns: template.columns.map((column) => ({ ...column })),
    },
  }
}

/** GET /api/pools/:poolId/records */
export async function fetchPoolRecords(
  poolId: string,
): Promise<ApiListResponse<PoolRecord[]>> {
  await delay()
  const list = ensurePool(poolId)
  return {
    data: list.map((row) => ({
      id: row.id,
      values: { ...(row.values ?? {}) },
      status: row.status,
      remark: row.remark ?? '',
      errorKeys: [...(row.errorKeys ?? [])],
    })),
  }
}

/**
 * POST /api/pools/:poolId/upload
 * body: { rows: Array<Record<string, string>> }  // Excel values only
 */
export async function uploadPoolRows(
  poolId: string,
  rows: PoolRecordValues[],
): Promise<ApiListResponse<UploadRowsResponse>> {
  await delay()
  const template = getPoolTemplateById(poolId)
  if (!template) {
    throw new ApiError(`Pool not found: ${poolId}`, 404)
  }

  const created = rows.map((values, index) =>
    gridRowToApiRecord(`upload-${Date.now()}-${index}`, values),
  )

  ensurePool(poolId).push(...created)

  return {
    data: {
      createdCount: created.length,
      records: created,
    },
  }
}

/**
 * POST /api/pools/:poolId/retry
 * body: { rows: Array<{ id: string, values: Record<string, string> }> }
 * Backend would re-validate; mock marks them validated and clears remark/errors.
 */
export async function retryPoolRows(
  poolId: string,
  rows: RetryRowPayload[],
): Promise<ApiListResponse<RetryRowsResponse>> {
  await delay()
  const list = ensurePool(poolId)
  const byId = new Map(rows.map((row) => [row.id, row]))

  const updated: PoolRecord[] = []
  for (let i = 0; i < list.length; i++) {
    const incoming = byId.get(list[i].id)
    if (!incoming) continue
    list[i] = {
      id: list[i].id,
      values: { ...(incoming.values ?? {}) },
      status: API_RECORD_STATUS.VALIDATED,
      remark: '',
      errorKeys: [],
    }
    updated.push(list[i])
  }

  return {
    data: {
      updatedCount: updated.length,
      records: updated,
    },
  }
}

/** Helpers used by the React layer (already UI-normalized) */
export async function fetchPoolRecordsForUi(poolId: string): Promise<UiPoolRecord[]> {
  const response = await fetchPoolRecords(poolId)
  return response.data.map(apiRecordToUi)
}

export async function uploadPoolRowsFromUi(
  poolId: string,
  uiRecords: UiPoolRecord[],
) {
  const template = getPoolTemplateById(poolId)
  const rows = uiRecords.map((row) => {
    const api = uiRecordToApi(row, template)
    return api.values
  })
  return uploadPoolRows(poolId, rows)
}

export async function retryPoolRowsFromUi(
  poolId: string,
  uiRecords: UiPoolRecord[],
) {
  const template = getPoolTemplateById(poolId)
  const rows = uiRecords.map((row) => {
    const api = uiRecordToApi(row, template)
    return { id: api.id, values: api.values }
  })
  return retryPoolRows(poolId, rows)
}
