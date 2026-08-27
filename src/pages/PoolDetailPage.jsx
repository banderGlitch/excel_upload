import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { getPoolTemplateById, getVisibleTableColumns } from '../data/poolTemplates'
import {
  RECORD_STATUS,
  STATUS_FILTERS,
  isFailedStatus,
  normalizeStatus,
} from '../data/recordStatus'
import { usePoolData } from '../context/PoolDataContext'
import PoolDataTable from '../components/PoolDataTable'
import './PoolDetailPage.css'

export default function PoolDetailPage() {
  const { poolId } = useParams()
  const navigate = useNavigate()
  const template = getPoolTemplateById(poolId)
  const { getRecords, updateRecordField, startRetryUpload, loading, loadError } =
    usePoolData()
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedIds, setSelectedIds] = useState(() => new Set())

  const records = getRecords(template?.id ?? '')
  const isFailedView = statusFilter === RECORD_STATUS.FAILED

  const counts = useMemo(() => {
    const result = {
      all: records.length,
      [RECORD_STATUS.RECEIVED]: 0,
      [RECORD_STATUS.VALIDATED]: 0,
      [RECORD_STATUS.FAILED]: 0,
    }
    for (const row of records) {
      const key = normalizeStatus(row.recordStatus)
      if (key in result) result[key] += 1
    }
    return result
  }, [records])

  const filteredRecords = useMemo(() => {
    if (statusFilter === 'all') return records
    return records.filter(
      (row) => normalizeStatus(row.recordStatus) === statusFilter,
    )
  }, [records, statusFilter])

  const selectedFailed = useMemo(() => {
    return records.filter(
      (row) => selectedIds.has(row.id) && isFailedStatus(row.recordStatus),
    )
  }, [records, selectedIds])

  if (!template) {
    return <Navigate to="/" replace />
  }

  const onFieldChange = (recordId, fieldKey, value) => {
    updateRecordField(template.id, recordId, fieldKey, value)
  }

  const onToggleRow = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const onToggleAll = (checked, ids) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) ids.forEach((id) => next.add(id))
      else ids.forEach((id) => next.delete(id))
      return next
    })
  }

  const onFilterChange = (id) => {
    setStatusFilter(id)
    setSelectedIds(new Set())
  }

  const retryUpload = () => {
    if (!selectedFailed.length) return
    const payload = selectedFailed.map((row) => ({ ...row }))
    // Prefill this pool's upload page: /pools/vendor-pool/upload
    startRetryUpload(template.id, payload)
    navigate(`/pools/${template.id}/upload`, {
      state: { mode: 'retry', poolId: template.id, records: payload },
    })
  }

  return (
    <div className="app">
      <header className="app-header detail-header">
        <div>
          <Link to="/" className="back-link">
            ← All pools
          </Link>
          <h1>{template.name}</h1>
          <p>{template.description}</p>
        </div>
        <Link to={`/pools/${template.id}/upload`} className="upload-btn">
          Upload Excel
        </Link>
      </header>

      {loading && <p className="sheet-status-hint">Loading records…</p>}
      {loadError && <p className="error">{loadError}</p>}

      <div className="detail-toolbar">
        <div className="status-filters" role="tablist" aria-label="Status filter">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={statusFilter === filter.id}
              className={`filter-btn ${statusFilter === filter.id ? 'active' : ''}`}
              onClick={() => onFilterChange(filter.id)}
            >
              {filter.label}
              <span>{counts[filter.id] ?? 0}</span>
            </button>
          ))}
        </div>

        {isFailedView && (
          <div className="detail-actions">
            <span className="selection-hint">
              {selectedIds.size} selected
            </span>
            <button
              type="button"
              className="retry-btn"
              disabled={!selectedFailed.length}
              title={
                selectedFailed.length
                  ? 'Open upload page with selected failed rows (without status/remark)'
                  : 'Select one or more failed rows first'
              }
              onClick={retryUpload}
            >
              Retry upload
            </button>
          </div>
        )}
      </div>

      <PoolDataTable
        columns={getVisibleTableColumns(template)}
        records={filteredRecords}
        selectedIds={selectedIds}
        onToggleRow={onToggleRow}
        onToggleAll={onToggleAll}
        onFieldChange={onFieldChange}
        showSelection={isFailedView}
        showRemark={isFailedView}
      />
    </div>
  )
}
