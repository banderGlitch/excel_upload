import { memo, useEffect, useState } from 'react'
import { validateCellValue } from '../utils/excel'
import './EditableExcelTable.css'

const PLACEHOLDERS = {
  gender: 'Male / Female / Other',
  date: 'YYYY-MM-DD',
  email: 'name@company.com',
  phone: '+91 9xxxxxxxxx',
  status: 'Active / Inactive / Pending',
  number: '0',
}

function EditableCell({
  value,
  column,
  rowIndex,
  colIndex,
  onCommit,
  onFocusError,
}) {
  const [localValue, setLocalValue] = useState(value)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!isFocused) setLocalValue(value)
  }, [value, isFocused])

  const errorMessage = validateCellValue(localValue, column)
  const isInvalid = Boolean(errorMessage)

  const commit = (next) => {
    if (next !== value) onCommit(rowIndex, colIndex, next)
  }

  return (
    <td className={isInvalid ? 'is-invalid' : undefined}>
      <div className="cell">
        <input
          value={localValue}
          onChange={(e) => {
            const next = e.target.value
            setLocalValue(next)
            if (isFocused) {
              const msg = validateCellValue(next, column)
              onFocusError(msg ? `${column.label}: ${msg}` : null)
            }
          }}
          onFocus={() => {
            setIsFocused(true)
            onFocusError(
              errorMessage ? `${column.label}: ${errorMessage}` : null,
            )
          }}
          onBlur={() => {
            setIsFocused(false)
            commit(localValue)
            onFocusError(null)
          }}
          aria-invalid={isInvalid}
          aria-label={`Row ${rowIndex + 1}, ${column.label}`}
          title={errorMessage || undefined}
          placeholder={isFocused ? PLACEHOLDERS[column.type] : undefined}
        />
        {isInvalid && (
          <span className="cell-badge" title={errorMessage} aria-hidden="true">
            !
          </span>
        )}
      </div>
    </td>
  )
}

const ExcelRow = memo(function ExcelRow({
  row,
  rowIndex,
  columns,
  onCommit,
  onDeleteRow,
  onFocusError,
}) {
  return (
    <tr>
      <td className="row-num">{rowIndex + 1}</td>
      {row.map((cell, colIndex) => (
        <EditableCell
          key={columns[colIndex].key}
          value={cell}
          column={columns[colIndex]}
          rowIndex={rowIndex}
          colIndex={colIndex}
          onCommit={onCommit}
          onFocusError={onFocusError}
        />
      ))}
      <td className="row-actions">
        <button
          type="button"
          className="icon-btn"
          title="Delete row"
          aria-label={`Delete row ${rowIndex + 1}`}
          onClick={() => onDeleteRow(rowIndex)}
        >
          ×
        </button>
      </td>
    </tr>
  )
}, areRowsEqual)

function areRowsEqual(prev, next) {
  if (prev.rowIndex !== next.rowIndex) return false
  if (prev.columns !== next.columns) return false
  if (prev.onCommit !== next.onCommit) return false
  if (prev.onDeleteRow !== next.onDeleteRow) return false
  if (prev.onFocusError !== next.onFocusError) return false
  if (prev.row === next.row) return true
  if (prev.row.length !== next.row.length) return false
  for (let i = 0; i < prev.row.length; i++) {
    if (prev.row[i] !== next.row[i]) return false
  }
  return true
}

export default memo(function EditableExcelTable({
  columns,
  rows,
  onCellChange,
  onDeleteRow,
}) {
  const [activeError, setActiveError] = useState(null)

  return (
    <div className="sheet">
      <div className="sheet-scroll">
        <table>
          <thead>
            <tr>
              <th className="row-num">#</th>
              {columns.map((column) => (
                <th key={column.key} className={`col-${column.type || 'text'}`}>
                  <div className="th-inner">
                    <span>{column.label}</span>
                    {column.type && column.type !== 'text' && (
                      <em>{column.type}</em>
                    )}
                  </div>
                </th>
              ))}
              <th className="row-actions" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="empty-body">
                  No data rows. Click &quot;Add row&quot; to start editing.
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <ExcelRow
                  key={rowIndex}
                  row={row}
                  rowIndex={rowIndex}
                  columns={columns}
                  onCommit={onCellChange}
                  onDeleteRow={onDeleteRow}
                  onFocusError={setActiveError}
                />
              ))
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
        ) : (
          <span className="sheet-status-hint">
            Click a cell to edit. Invalid cells show a red mark — focus one to
            see the fix here.
          </span>
        )}
      </div>
    </div>
  )
})
