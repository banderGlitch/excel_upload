import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { POOL_TEMPLATES } from '../data/poolTemplates'
import {
  fetchPoolRecordsForUi,
  retryPoolRowsFromUi,
  uploadPoolRowsFromUi,
} from '../api'
import type { UiPoolRecord } from '../api/contracts'
import { RECORD_STATUS } from '../data/recordStatus'

export interface RetryDraft {
  poolId: string
  records: UiPoolRecord[]
}

export interface PoolDataContextValue {
  loading: boolean
  loadError: string
  getRecords: (poolId: string) => UiPoolRecord[]
  updateRecordField: (
    poolId: string,
    recordId: string,
    fieldKey: string,
    value: string,
  ) => void
  appendUploadedRecords: (
    poolId: string,
    uiRecords: UiPoolRecord[],
  ) => Promise<void>
  applyRetryRecords: (
    poolId: string,
    uiRecords: UiPoolRecord[],
  ) => Promise<void>
  retryDraft: RetryDraft | null
  startRetryUpload: (poolId: string, records: UiPoolRecord[]) => void
  clearRetryDraft: () => void
  refreshPool: (poolId: string) => Promise<UiPoolRecord[]>
  RECORD_STATUS: typeof RECORD_STATUS
}

const PoolDataContext = createContext<PoolDataContextValue | null>(null)

export function PoolDataProvider({ children }: { children: ReactNode }) {
  const [recordsByPool, setRecordsByPool] = useState<
    Record<string, UiPoolRecord[]>
  >({})
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [retryDraft, setRetryDraft] = useState<RetryDraft | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadAll() {
      setLoading(true)
      setLoadError('')
      try {
        const entries = await Promise.all(
          POOL_TEMPLATES.map(async (template) => {
            const rows = await fetchPoolRecordsForUi(template.id)
            return [template.id, rows] as const
          }),
        )
        if (!cancelled) {
          setRecordsByPool(Object.fromEntries(entries))
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err instanceof Error ? err.message : 'Failed to load pool records',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadAll()
    return () => {
      cancelled = true
    }
  }, [])

  const getRecords = useCallback(
    (poolId: string) => recordsByPool[poolId] ?? [],
    [recordsByPool],
  )

  const refreshPool = useCallback(async (poolId: string) => {
    const rows = await fetchPoolRecordsForUi(poolId)
    setRecordsByPool((prev) => ({ ...prev, [poolId]: rows }))
    return rows
  }, [])

  /**
   * Local edits only change field values.
   * remark + errorKeys stay as backend sent them until retry is submitted.
   */
  const updateRecordField = useCallback(
    (poolId: string, recordId: string, fieldKey: string, value: string) => {
      setRecordsByPool((prev) => {
        const list = prev[poolId] ?? []
        return {
          ...prev,
          [poolId]: list.map((row) =>
            row.id === recordId ? { ...row, [fieldKey]: value } : row,
          ),
        }
      })
    },
    [],
  )

  const appendUploadedRecords = useCallback(
    async (poolId: string, uiRecords: UiPoolRecord[]) => {
      await uploadPoolRowsFromUi(poolId, uiRecords)
      await refreshPool(poolId)
    },
    [refreshPool],
  )

  const applyRetryRecords = useCallback(
    async (poolId: string, uiRecords: UiPoolRecord[]) => {
      await retryPoolRowsFromUi(poolId, uiRecords)
      await refreshPool(poolId)
      setRetryDraft(null)
    },
    [refreshPool],
  )

  const startRetryUpload = useCallback(
    (poolId: string, records: UiPoolRecord[]) => {
      setRetryDraft({
        poolId,
        records: records.map((row) => ({ ...row })),
      })
    },
    [],
  )

  const clearRetryDraft = useCallback(() => {
    setRetryDraft(null)
  }, [])

  const value = useMemo<PoolDataContextValue>(
    () => ({
      loading,
      loadError,
      getRecords,
      updateRecordField,
      appendUploadedRecords,
      applyRetryRecords,
      retryDraft,
      startRetryUpload,
      clearRetryDraft,
      refreshPool,
      RECORD_STATUS,
    }),
    [
      loading,
      loadError,
      getRecords,
      updateRecordField,
      appendUploadedRecords,
      applyRetryRecords,
      retryDraft,
      startRetryUpload,
      clearRetryDraft,
      refreshPool,
    ],
  )

  return (
    <PoolDataContext.Provider value={value}>{children}</PoolDataContext.Provider>
  )
}

export function usePoolData(): PoolDataContextValue {
  const ctx = useContext(PoolDataContext)
  if (!ctx) {
    throw new Error('usePoolData must be used within PoolDataProvider')
  }
  return ctx
}
