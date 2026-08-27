import { memo, useEffect, useMemo, useState } from 'react'
import { RECORD_STATUS } from '../data/recordStatus'
import './PoolDataTable.css'

function DetailCell({
  value,
  recordId,
  fieldKey,
  label,
  isError,
  editable,
  remark,
  onCommit,
  onFocusError,
}) {
  const [localValue, setLocalValue] = useState(value)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!isFocused) setLocalValue(value)
  }, [value, isFocused])

  if (!editable) {
    return (
      <td className={isError ? 'is-invalid' : undefined}>
        <div className="cell">
          <span className="cell-text">{value}</span>
          {isError && <span className="cell-badge">!</span>}
        </div>
      </td>
    )
  }

  return (
    <td className={isError ? 'is-invalid' : undefined}>
      <div className="cell">
        <input
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onFocus={() => {
            setIsFocused(true)
            onFocusError(
              isError ? `${label}: ${remark || 'Needs correction'}` : null,
            )
          }}
          onBlur={() => {
            setIsFocused(false)
            onFocusError(null)
            if (localValue !== value) {
              onCommit(recordId, fieldKey, localValue)
            }
          }}
          aria-invalid={isError}
          aria-label={label}
          title={isError ? remark || 'Needs correction' : undefined}
        />
        {isError && <span className="cell-badge">!</span>}
      </div>
    </td>
  )
}

function statusClass(status) {
  if (status === RECORD_STATUS.FAILED) return 'status-failed'
  if (status === RECORD_STATUS.RECEIVED) return 'status-received'
  if (status === RECORD_STATUS.VALIDATED) return 'status-validated'
  return ''
}

function PoolDataTable({
  columns,
  records,
  selectedIds,
  onToggleRow,
  onToggleAll,
  onFieldChange,
  showSelection = false,
  showRemark = false,
}) {
  const [activeError, setActiveError] = useState(null)

  const allSelectableIds = useMemo(
    () => records.map((row) => row.id),
    [records],
  )
  const selectedInView = allSelectableIds.filter((id) => selectedIds.has(id))
  const allSelected =
    showSelection &&
    allSelectableIds.length > 0 &&
    selectedInView.length === allSelectableIds.length

  // data columns + # + Status + optional checkbox + optional Remark
  const colSpan =
    columns.length + 2 + (showSelection ? 1 : 0) + (showRemark ? 1 : 0)

  return (
    <div className="sheet">
      <div className="sheet-scroll">
        <table>
          <thead>
            <tr>
              {showSelection && (
                <th className="check-col">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) =>
                      onToggleAll(e.target.checked, allSelectableIds)
                    }
                    aria-label="Select all failed rows"
                  />
                </th>
              )}
              <th className="row-num">#</th>
              {columns.map((column) => (
                <th key={column.key}>
                  <div className="th-inner">
                    <span>{column.label}</span>
                  </div>
                </th>
              ))}
              <th className="status-col">
                <div className="th-inner">
                  <span>Status</span>
                </div>
              </th>
              {showRemark && (
                <th className="remark-col">
                  <div className="th-inner">
                    <span>Remark</span>
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="empty-body">
                  No records for this filter.
                </td>
              </tr>
            ) : (
              records.map((record, index) => {
                const errorKeys = new Set(record.errorKeys ?? [])
                const checked = selectedIds.has(record.id)
                const isFailed = record.recordStatus === RECORD_STATUS.FAILED

                return (
                  <tr
                    key={record.id}
                    className={checked ? 'is-selected' : undefined}
                  >
                    {showSelection && (
                      <td className="check-col">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggleRow(record.id)}
                          aria-label={`Select row ${index + 1}`}
                        />
                      </td>
                    )}
                    <td className="row-num">{index + 1}</td>
                    {columns.map((column) => {
                      const isError = isFailed && errorKeys.has(column.key)
                      return (
                        <DetailCell
                          key={column.key}
                          value={String(record[column.key] ?? '')}
                          recordId={record.id}
                          fieldKey={column.key}
                          label={column.label}
                          isError={isError}
                          editable={isFailed}
                          remark={record.remark}
                          onCommit={onFieldChange}
                          onFocusError={setActiveError}
                        />
                      )
                    })}
                    <td className="status-col">
                      <span
                        className={`status-pill ${statusClass(record.recordStatus)}`}
                      >
                        {record.recordStatus || '—'}
                      </span>
                    </td>
                    {showRemark && (
                      <td
                        className={`remark-col ${record.remark ? 'has-remark' : ''}`}
                      >
                        <div className="remark-text">
                          {record.remark || '—'}
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div
        className={`sheet-status ${activeError ? 'has-error' : ''}`}
        role="status"
        aria-live="polite"
      >
        {activeError ? (
          <>
            <span className="sheet-status-mark">!</span>
            <span>{activeError}</span>
          </>
        ) : showSelection ? (
          <span className="sheet-status-hint">
            Select failed rows, fix highlighted cells, then Retry upload.
            Upload page will not include Status or Remark.
          </span>
        ) : (
          <span className="sheet-status-hint">
            Switch to Failed to select rows, edit highlighted cells, and retry
            upload.
          </span>
        )}
      </div>
    </div>
  )
}

export default memo(PoolDataTable)
