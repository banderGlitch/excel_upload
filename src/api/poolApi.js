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
import { API_RECORD_STATUS } from './contracts'
import { apiRecordToUi, gridRowToApiRecord, uiRecordToApi } from './normalize'

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

/** In-memory store so uploads/retries persist during the session */
const recordStore = structuredClone(MOCK_API_RECORDS)

function ensurePool(poolId) {
  if (!recordStore[poolId]) recordStore[poolId] = []
  return recordStore[poolId]
}

/** GET /api/pools */
export async function fetchPoolTemplates() {
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
export async function fetchPoolTemplate(poolId) {
  await delay()
  const template = getPoolTemplateById(poolId)
  if (!template) {
    const error = new Error(`Pool not found: ${poolId}`)
    error.status = 404
    throw error
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
export async function fetchPoolRecords(poolId) {
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
export async function uploadPoolRows(poolId, rows) {
  await delay()
  const template = getPoolTemplateById(poolId)
  if (!template) {
    const error = new Error(`Pool not found: ${poolId}`)
    error.status = 404
    throw error
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
export async function retryPoolRows(poolId, rows) {
  await delay()
  const list = ensurePool(poolId)
  const byId = new Map(rows.map((row) => [row.id, row]))

  const updated = []
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
export async function fetchPoolRecordsForUi(poolId) {
  const response = await fetchPoolRecords(poolId)
  return response.data.map(apiRecordToUi)
}

export async function uploadPoolRowsFromUi(poolId, uiRecords) {
  const template = getPoolTemplateById(poolId)
  const rows = uiRecords.map((row) => {
    const api = uiRecordToApi(row, template)
    return api.values
  })
  return uploadPoolRows(poolId, rows)
}

export async function retryPoolRowsFromUi(poolId, uiRecords) {
  const template = getPoolTemplateById(poolId)
  const rows = uiRecords.map((row) => {
    const api = uiRecordToApi(row, template)
    return { id: api.id, values: api.values }
  })
  return retryPoolRows(poolId, rows)
}
