import './ExcelToolbar.css'

export default function ExcelToolbar({
  fileName,
  templateName,
  rowCount,
  columnCount,
  invalidCount = 0,
  onAddRow,
  onDownload,
  onClear,
}) {
  return (
    <div className="toolbar-block">
      <div className="toolbar">
        <div className="file-meta">
          <span className="file-name">{fileName}</span>
          <span className="meta-pill">{templateName}</span>
          <span className="meta-pill">
            {rowCount} row{rowCount !== 1 ? 's' : ''} · {columnCount} columns
          </span>
          {invalidCount > 0 && (
            <span className="meta-pill invalid-pill">
              {invalidCount} invalid
            </span>
          )}
        </div>
        <div className="actions">
          {onAddRow && (
            <button type="button" onClick={onAddRow}>
              Add row
            </button>
          )}
          <button
            type="button"
            className="primary"
            onClick={onDownload}
            disabled={invalidCount > 0}
            title={
              invalidCount > 0
                ? 'Fix invalid cells before downloading'
                : undefined
            }
          >
            Download Excel
          </button>
          {onClear && (
            <button type="button" className="ghost" onClick={onClear}>
              Clear
            </button>
          )}
        </div>
      </div>

      {invalidCount > 0 && (
        <div className="validation-banner" role="status">
          <span className="validation-banner-icon" aria-hidden="true">
            !
          </span>
          <p>
            <strong>
              {invalidCount} cell{invalidCount === 1 ? '' : 's'} need
              {invalidCount === 1 ? 's' : ''} attention.
            </strong>{' '}
            Invalid cells are marked in red — focus a cell to see the fix in the
            status bar. Submit stays locked until values are valid.
          </p>
        </div>
      )}
    </div>
  )
}
