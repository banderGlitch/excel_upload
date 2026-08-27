import { useEffect, useMemo, useState } from 'react'
import { Alert, Box, Button, Link, Typography } from '@mui/material'
import {
  Link as RouterLink,
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
import AppShell from '../components/AppShell'
import { tokens } from '../theme/theme'

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
    <AppShell>
      <Box
        component="header"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          alignItems: { xs: 'stretch', sm: 'flex-start' },
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Box>
          <Link
            component={RouterLink}
            to={`/pools/${templateDef.id}`}
            underline="hover"
            color="primary"
            onClick={() => clearRetryDraft()}
            sx={{ display: 'inline-block', mb: 1, fontSize: '0.9rem' }}
          >
            ← Back to {templateDef.name}
          </Link>
          <Typography variant="h1" sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            Upload Excel
          </Typography>
          <Typography>
            Download the sample for{' '}
            <Box component="strong" sx={{ color: 'text.primary' }}>
              {templateDef.name}
            </Box>
            , fill rows, then upload. Headers must match exactly.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="inherit"
          onClick={downloadSample}
          sx={{
            flexShrink: 0,
            borderColor: tokens.border,
            color: 'text.primary',
            bgcolor: 'background.paper',
            '&:hover': { bgcolor: tokens.surface, borderColor: tokens.border },
          }}
        >
          Download sample
        </Button>
      </Box>

      {!isRetry && (
        <ExcelDropzone
          templateName={templateDef.name}
          hasData={hasData}
          onUpload={uploadFile}
        />
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 1.5 }}>
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mt: 1.5 }}>
          {successMessage}
        </Alert>
      )}

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

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
            <Button
              variant="contained"
              onClick={saveAndReturn}
              disabled={invalidCount > 0 || Boolean(successMessage)}
            >
              Save to pool & return
            </Button>
          </Box>

          <EditableExcelTable
            columns={columns}
            rows={rows}
            onCellChange={updateCell}
            onDeleteRow={deleteRow}
            allowDelete={!isRetry}
          />
        </>
      )}
    </AppShell>
  )
}
