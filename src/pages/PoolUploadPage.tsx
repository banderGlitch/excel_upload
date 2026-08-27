import { useEffect, useMemo, useState } from 'react'
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import type { UiPoolRecord } from '../api/contracts'
import { getPoolTemplateById } from '../data/poolTemplates'
import { usePoolData } from '../context/PoolDataContext'
import { useExcelEditor } from '../hooks/useExcelEditor'
import ExcelDropzone from '../components/ExcelDropzone'
import ExcelToolbar from '../components/ExcelToolbar'
import EditableExcelTable from '../components/EditableExcelTable'
import './PoolDetailPage.css'
import './PoolUploadPage.css'

interface RetryLocationState {
  mode?: 'retry'
  poolId?: string
  records?: UiPoolRecord[]
}

export default function PoolUploadPage() {
  const { poolId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const templateDef = getPoolTemplateById(poolId)
  const {
    appendUploadedRecords,
    applyRetryRecords,
    retryDraft,
    startRetryUpload,
    clearRetryDraft,
  } = usePoolData()
  const [successMessage, setSuccessMessage] = useState('')

  /**
   * Failed → lands on same upload URL with selected rows prefilled.
   * e.g. http://localhost:5173/pools/vendor-pool/upload
   */
  const bootstrap = useMemo(() => {
    if (
      retryDraft &&
      retryDraft.poolId === poolId &&
      retryDraft.records?.length
    ) {
      return { mode: 'retry' as const, records: retryDraft.records }
    }

    const fromState = location.state as RetryLocationState | null
    if (
      fromState?.mode === 'retry' &&
      (!fromState.poolId || fromState.poolId === poolId) &&
      fromState.records?.length
    ) {
      return { mode: 'retry' as const, records: fromState.records }
    }

    return null
  }, [retryDraft, poolId, location.state])

  useEffect(() => {
    const fromState = location.state as RetryLocationState | null
    if (
      fromState?.mode === 'retry' &&
      fromState.records?.length &&
      poolId &&
      (!retryDraft || retryDraft.poolId !== poolId)
    ) {
      startRetryUpload(poolId, fromState.records)
    }
  }, [location.state, retryDraft, poolId, startRetryUpload])

  const {
    columns,
    rows,
    fileName,
    error,
    hasData,
    invalidCount,
    isRetry,
    downloadSample,
    uploadFile,
    updateCell,
    addRow,
    deleteRow,
    downloadExcel,
    clearAll,
    buildRecordsFromGrid,
    setError,
  } = useExcelEditor(poolId, bootstrap)

  if (!templateDef) {
    return <Navigate to="/" replace />
  }

  const saveAndReturn = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    window.setTimeout(async () => {
      const result = buildRecordsFromGrid()
      if (!result.ok) {
        setError(result.message)
        setSuccessMessage('')
        return
      }

      const count = result.records.length

      try {
        if (isRetry) {
          await applyRetryRecords(templateDef.id, result.records)
          setSuccessMessage(
            `Successfully submitted ${count} corrected row${count === 1 ? '' : 's'}. Returning to ${templateDef.name}…`,
          )
        } else {
          await appendUploadedRecords(templateDef.id, result.records)
          setSuccessMessage(
            `Successfully uploaded ${count} row${count === 1 ? '' : 's'} to ${templateDef.name}. Returning…`,
          )
        }

        clearRetryDraft()
        window.setTimeout(() => {
          navigate(`/pools/${templateDef.id}`, { replace: true })
        }, 1200)
      } catch (err) {
        setSuccessMessage('')
        setError(
          err instanceof Error ? err.message : 'Save failed. Please try again.',
        )
      }
    }, 0)
  }

  return (
    <div className="app">
      <header className="app-header detail-header">
        <div>
          <Link
            to={`/pools/${templateDef.id}`}
            className="back-link"
            onClick={() => clearRetryDraft()}
          >
            ← Back to {templateDef.name}
          </Link>
          <h1>Upload Excel</h1>
          <p>
            Download the sample for <strong>{templateDef.name}</strong>, fill
            rows, then upload. Headers must match exactly.
          </p>
        </div>
        <button
          type="button"
          className="upload-btn secondary"
          onClick={downloadSample}
        >
          Download sample
        </button>
      </header>

      {!isRetry && (
        <ExcelDropzone
          templateName={templateDef.name}
          hasData={hasData}
          onUpload={uploadFile}
        />
      )}

      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      {hasData && (
        <>
          <ExcelToolbar
            fileName={fileName || `${templateDef.id}-upload.xlsx`}
            templateName={templateDef.name}
            rowCount={rows.length}
            columnCount={columns.length}
            invalidCount={invalidCount}
            onAddRow={isRetry ? undefined : addRow}
            onDownload={downloadExcel}
            onClear={isRetry ? undefined : clearAll}
          />

          <div className="upload-actions">
            <button
              type="button"
              className="save-btn"
              onClick={saveAndReturn}
              disabled={invalidCount > 0 || Boolean(successMessage)}
            >
              Save to pool & return
            </button>
          </div>

          <EditableExcelTable
            columns={columns}
            rows={rows}
            onCellChange={updateCell}
            onDeleteRow={deleteRow}
            allowDelete={!isRetry}
          />
        </>
      )}
    </div>
  )
}
