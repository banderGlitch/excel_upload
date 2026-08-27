import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { POOL_TEMPLATES } from '../data/poolTemplates'
import {
  fetchPoolRecordsForUi,
  retryPoolRowsFromUi,
  uploadPoolRowsFromUi,
} from '../api'
import { RECORD_STATUS } from '../data/recordStatus'

const PoolDataContext = createContext(null)

export function PoolDataProvider({ children }) {
  const [recordsByPool, setRecordsByPool] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  /** { poolId, records } set when Retry upload is clicked from Failed */
  const [retryDraft, setRetryDraft] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadAll() {
      setLoading(true)
      setLoadError('')
      try {
        const entries = await Promise.all(
          POOL_TEMPLATES.map(async (template) => {
            const rows = await fetchPoolRecordsForUi(template.id)
            return [template.id, rows]
          }),
        )
        if (!cancelled) {
          setRecordsByPool(Object.fromEntries(entries))
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err?.message || 'Failed to load pool records')
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
    (poolId) => recordsByPool[poolId] ?? [],
    [recordsByPool],
  )

  const refreshPool = useCallback(async (poolId) => {
    const rows = await fetchPoolRecordsForUi(poolId)
    setRecordsByPool((prev) => ({ ...prev, [poolId]: rows }))
    return rows
  }, [])

  /**
   * Local edits only change field values.
   * remark + errorKeys stay as backend sent them until retry is submitted.
   */
  const updateRecordField = useCallback((poolId, recordId, fieldKey, value) => {
    setRecordsByPool((prev) => {
      const list = prev[poolId] ?? []
      return {
        ...prev,
        [poolId]: list.map((row) =>
          row.id === recordId ? { ...row, [fieldKey]: value } : row,
        ),
      }
    })
  }, [])

  const appendUploadedRecords = useCallback(
    async (poolId, uiRecords) => {
      await uploadPoolRowsFromUi(poolId, uiRecords)
      await refreshPool(poolId)
    },
    [refreshPool],
  )

  const applyRetryRecords = useCallback(
    async (poolId, uiRecords) => {
      await retryPoolRowsFromUi(poolId, uiRecords)
      await refreshPool(poolId)
      setRetryDraft(null)
    },
    [refreshPool],
  )

  const startRetryUpload = useCallback((poolId, records) => {
    setRetryDraft({
      poolId,
      records: records.map((row) => ({ ...row })),
    })
  }, [])

  const clearRetryDraft = useCallback(() => {
    setRetryDraft(null)
  }, [])

  const value = useMemo(
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

export function usePoolData() {
  const ctx = useContext(PoolDataContext)
  if (!ctx) {
    throw new Error('usePoolData must be used within PoolDataProvider')
  }
  return ctx
}
