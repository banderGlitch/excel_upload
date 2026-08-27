import { memo, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Checkbox,
  Chip,
  InputBase,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import type { PoolColumn, UiPoolRecord } from '../api/contracts'
import { RECORD_STATUS } from '../data/recordStatus'
import { tokens } from '../theme/theme'
import {
  cellInputSx,
  invalidCellSx,
  rowNumSx,
  sheetScrollSx,
  sheetStatusSx,
  sheetSx,
  sheetTableSx,
  thInnerSx,
} from '../theme/sheetStyles'

interface DetailCellProps {
  value: string
  recordId: string
  fieldKey: string
  label: string
  isError: boolean
  editable: boolean
  remark: string
  onCommit: (recordId: string, fieldKey: string, value: string) => void
  onFocusError: (message: string | null) => void
}

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
}: DetailCellProps) {
  const [localValue, setLocalValue] = useState(value)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!isFocused) setLocalValue(value)
  }, [value, isFocused])

  if (!editable) {
    return (
      <TableCell sx={isError ? invalidCellSx : undefined}>
        <Box sx={{ position: 'relative', height: 36, width: '100%' }}>
          <Typography
            component="span"
            sx={{
              display: 'block',
              height: 36,
              lineHeight: '36px',
              pl: 1.25,
              pr: 3.5,
              fontSize: '0.84rem',
              color: isError ? tokens.errorText : 'text.primary',
              fontWeight: isError ? 550 : 400,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {value}
          </Typography>
          {isError && <ErrorBadge />}
        </Box>
      </TableCell>
    )
  }

  return (
    <TableCell sx={isError ? invalidCellSx : undefined}>
      <Box sx={{ position: 'relative', height: 36, width: '100%' }}>
        <InputBase
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
          inputProps={{
            'aria-invalid': isError,
            'aria-label': label,
            title: isError ? remark || 'Needs correction' : undefined,
          }}
          sx={cellInputSx(isError)}
        />
        {isError && <ErrorBadge />}
      </Box>
    </TableCell>
  )
}

function ErrorBadge() {
  return (
    <Box
      component="span"
      aria-hidden
      sx={{
        position: 'absolute',
        top: '50%',
        right: 8,
        transform: 'translateY(-50%)',
        width: 15,
        height: 15,
        borderRadius: '50%',
        bgcolor: 'error.main',
        color: '#fff',
        fontSize: '0.65rem',
        fontWeight: 700,
        lineHeight: '15px',
        textAlign: 'center',
        pointerEvents: 'none',
      }}
    >
      !
    </Box>
  )
}

function StatusPill({ status }: { status: string | undefined }) {
  const value = status || '—'
  let colors: { color: string; bgcolor: string; borderColor: string } = {
    color: '#15202b',
    bgcolor: tokens.surface,
    borderColor: tokens.border,
  }

  if (status === RECORD_STATUS.FAILED) {
    colors = {
      color: tokens.errorText,
      bgcolor: tokens.errorSoft,
      borderColor: tokens.errorBorder,
    }
  } else if (status === RECORD_STATUS.VALIDATED) {
    colors = {
      color: '#166534',
      bgcolor: '#f0fdf4',
      borderColor: '#bbf7d0',
    }
  } else if (status === RECORD_STATUS.RECEIVED) {
    colors = {
      color: '#1d4ed8',
      bgcolor: '#eff6ff',
      borderColor: '#bfdbfe',
    }
  }

  return (
    <Chip
      size="small"
      label={value}
      variant="outlined"
      sx={{
        ml: 1,
        height: 22,
        fontSize: '0.72rem',
        fontWeight: 650,
        textTransform: 'capitalize',
        ...colors,
      }}
    />
  )
}

interface PoolDataTableProps {
  columns: PoolColumn[]
  records: UiPoolRecord[]
  selectedIds: Set<string>
  onToggleRow: (id: string) => void
  onToggleAll: (checked: boolean, ids: string[]) => void
  onFieldChange: (recordId: string, fieldKey: string, value: string) => void
  showSelection?: boolean
  showRemark?: boolean
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
}: PoolDataTableProps) {
  const [activeError, setActiveError] = useState<string | null>(null)

  const allSelectableIds = useMemo(
    () => records.map((row) => row.id),
    [records],
  )
  const selectedInView = allSelectableIds.filter((id) => selectedIds.has(id))
  const allSelected =
    showSelection &&
    allSelectableIds.length > 0 &&
    selectedInView.length === allSelectableIds.length

  const colSpan =
    columns.length + 2 + (showSelection ? 1 : 0) + (showRemark ? 1 : 0)

  const checkColSx = {
    width: 40,
    minWidth: 40,
    textAlign: 'center' as const,
    bgcolor: `${tokens.surface} !important`,
  }

  return (
    <Box sx={sheetSx}>
      <TableContainer sx={{ ...sheetScrollSx, '& .MuiTable-root': { minWidth: 980 } }}>
        <Table sx={sheetTableSx}>
          <TableHead>
            <TableRow>
              {showSelection && (
                <TableCell className="check-col" sx={checkColSx}>
                  <Checkbox
                    size="small"
                    checked={allSelected}
                    onChange={(e) =>
                      onToggleAll(e.target.checked, allSelectableIds)
                    }
                    slotProps={{
                      input: { 'aria-label': 'Select all failed rows' },
                    }}
                    sx={{ p: 0.5 }}
                  />
                </TableCell>
              )}
              <TableCell className="row-num" sx={rowNumSx}>
                #
              </TableCell>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  <Box sx={thInnerSx}>
                    <span>{column.label}</span>
                  </Box>
                </TableCell>
              ))}
              <TableCell sx={{ width: 110, minWidth: 100 }}>
                <Box sx={thInnerSx}>
                  <span>Status</span>
                </Box>
              </TableCell>
              {showRemark && (
                <TableCell sx={{ width: '20%', minWidth: 160 }}>
                  <Box sx={thInnerSx}>
                    <span>Remark</span>
                  </Box>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={colSpan}
                  sx={{ height: 'auto !important', py: 3.5, px: 2, textAlign: 'center' }}
                >
                  <Typography color="text.secondary">
                    No records for this filter.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              records.map((record, index) => {
                const errorKeys = new Set(record.errorKeys ?? [])
                const checked = selectedIds.has(record.id)
                const isFailed = record.recordStatus === RECORD_STATUS.FAILED

                return (
                  <TableRow
                    key={record.id}
                    className={checked ? 'is-selected' : undefined}
                  >
                    {showSelection && (
                      <TableCell className="check-col" sx={checkColSx}>
                        <Checkbox
                          size="small"
                          checked={checked}
                          onChange={() => onToggleRow(record.id)}
                          slotProps={{
                            input: {
                              'aria-label': `Select row ${index + 1}`,
                            },
                          }}
                          sx={{ p: 0.5 }}
                        />
                      </TableCell>
                    )}
                    <TableCell className="row-num" sx={rowNumSx}>
                      {index + 1}
                    </TableCell>
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
                    <TableCell>
                      <StatusPill status={String(record.recordStatus ?? '')} />
                    </TableCell>
                    {showRemark && (
                      <TableCell>
                        <Box
                          sx={{
                            px: 1.25,
                            py: 0.75,
                            fontSize: '0.78rem',
                            lineHeight: 1.35,
                            color: record.remark
                              ? tokens.errorText
                              : 'text.secondary',
                            fontWeight: record.remark ? 550 : 400,
                            maxHeight: 48,
                            overflow: 'auto',
                          }}
                        >
                          {record.remark || '—'}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={sheetStatusSx(Boolean(activeError))} role="status" aria-live="polite">
        {activeError ? (
          <>
            <Box
              component="span"
              sx={{
                flexShrink: 0,
                width: 16,
                height: 16,
                borderRadius: '50%',
                bgcolor: 'error.main',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 700,
                lineHeight: '16px',
                textAlign: 'center',
              }}
            >
              !
            </Box>
            <span>{activeError}</span>
          </>
        ) : showSelection ? (
          <Typography component="span" sx={{ opacity: 0.8, fontSize: 'inherit' }}>
            Select failed rows, fix highlighted cells, then Retry upload.
            Upload page will not include Status or Remark.
          </Typography>
        ) : (
          <Typography component="span" sx={{ opacity: 0.8, fontSize: 'inherit' }}>
            Switch to Failed to select rows, edit highlighted cells, and retry
            upload.
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default memo(PoolDataTable)
