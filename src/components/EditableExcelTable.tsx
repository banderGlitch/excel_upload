import { memo, useEffect, useState } from 'react'
import {
  Box,
  IconButton,
  InputBase,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import type { PoolColumn } from '../api/contracts'
import { validateCellValue } from '../utils/excel'
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

const PLACEHOLDERS: Record<string, string> = {
  gender: 'Male / Female / Other',
  date: 'YYYY-MM-DD',
  email: 'name@company.com',
  phone: '+91 9xxxxxxxxx',
  status: 'Active / Inactive / Pending',
  number: '0',
}

interface EditableCellProps {
  value: string
  column: PoolColumn
  rowIndex: number
  colIndex: number
  onCommit: (rowIndex: number, colIndex: number, value: string) => void
  onFocusError: (message: string | null) => void
}

function EditableCell({
  value,
  column,
  rowIndex,
  colIndex,
  onCommit,
  onFocusError,
}: EditableCellProps) {
  const [localValue, setLocalValue] = useState(value)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!isFocused) setLocalValue(value)
  }, [value, isFocused])

  const errorMessage = validateCellValue(localValue, column)
  const isInvalid = Boolean(errorMessage)

  const commit = (next: string) => {
    if (next !== value) onCommit(rowIndex, colIndex, next)
  }

  return (
    <TableCell sx={isInvalid ? invalidCellSx : undefined}>
      <Box sx={{ position: 'relative', height: 36, width: '100%' }}>
        <InputBase
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
          inputProps={{
            'aria-invalid': isInvalid,
            'aria-label': `Row ${rowIndex + 1}, ${column.label}`,
            title: errorMessage || undefined,
            placeholder: isFocused ? PLACEHOLDERS[column.type] : undefined,
          }}
          sx={cellInputSx(isInvalid)}
        />
        {isInvalid && (
          <Box
            component="span"
            aria-hidden
            title={errorMessage ?? undefined}
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
        )}
      </Box>
    </TableCell>
  )
}

interface ExcelRowProps {
  row: string[]
  rowIndex: number
  columns: PoolColumn[]
  onCommit: (rowIndex: number, colIndex: number, value: string) => void
  onDeleteRow: (rowIndex: number) => void
  onFocusError: (message: string | null) => void
  allowDelete: boolean
}

const ExcelRow = memo(function ExcelRow({
  row,
  rowIndex,
  columns,
  onCommit,
  onDeleteRow,
  onFocusError,
  allowDelete,
}: ExcelRowProps) {
  return (
    <TableRow>
      <TableCell className="row-num" sx={rowNumSx}>
        {rowIndex + 1}
      </TableCell>
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
      {allowDelete && (
        <TableCell
          className="row-actions"
          sx={{
            width: 40,
            minWidth: 40,
            textAlign: 'center',
            bgcolor: `${tokens.surface} !important`,
          }}
        >
          <IconButton
            size="small"
            title="Delete row"
            aria-label={`Delete row ${rowIndex + 1}`}
            onClick={() => onDeleteRow(rowIndex)}
            sx={{
              width: 24,
              height: 24,
              borderRadius: '5px',
              color: 'text.secondary',
              '&:hover': { bgcolor: tokens.errorSoft, color: 'error.main' },
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </TableCell>
      )}
    </TableRow>
  )
}, areRowsEqual)

function areRowsEqual(prev: ExcelRowProps, next: ExcelRowProps) {
  if (prev.rowIndex !== next.rowIndex) return false
  if (prev.columns !== next.columns) return false
  if (prev.onCommit !== next.onCommit) return false
  if (prev.onDeleteRow !== next.onDeleteRow) return false
  if (prev.onFocusError !== next.onFocusError) return false
  if (prev.allowDelete !== next.allowDelete) return false
  if (prev.row === next.row) return true
  if (prev.row.length !== next.row.length) return false
  for (let i = 0; i < prev.row.length; i++) {
    if (prev.row[i] !== next.row[i]) return false
  }
  return true
}

interface EditableExcelTableProps {
  columns: PoolColumn[]
  rows: string[][]
  onCellChange: (rowIndex: number, colIndex: number, value: string) => void
  onDeleteRow: (rowIndex: number) => void
  allowDelete?: boolean
}

export default memo(function EditableExcelTable({
  columns,
  rows,
  onCellChange,
  onDeleteRow,
  allowDelete = true,
}: EditableExcelTableProps) {
  const [activeError, setActiveError] = useState<string | null>(null)

  return (
    <Box sx={sheetSx}>
      <TableContainer sx={sheetScrollSx}>
        <Table sx={sheetTableSx}>
          <TableHead>
            <TableRow>
              <TableCell className="row-num" sx={rowNumSx}>
                #
              </TableCell>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  <Box sx={thInnerSx}>
                    <span>{column.label}</span>
                    {column.type && column.type !== 'text' && (
                      <Box
                        component="em"
                        sx={{
                          fontStyle: 'normal',
                          fontSize: '0.62rem',
                          fontWeight: 650,
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em',
                          color: 'primary.main',
                          bgcolor: tokens.accentSoft,
                          borderRadius: 999,
                          px: 0.75,
                          py: '1px',
                        }}
                      >
                        {column.type}
                      </Box>
                    )}
                  </Box>
                </TableCell>
              ))}
              {allowDelete && (
                <TableCell
                  className="row-actions"
                  sx={{ width: 40, minWidth: 40, bgcolor: tokens.headerBg }}
                />
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (allowDelete ? 2 : 1)}
                  sx={{ height: 'auto !important', py: 3.5, px: 2, textAlign: 'center' }}
                >
                  <Typography color="text.secondary">
                    No data rows. Click &quot;Add row&quot; to start editing.
                  </Typography>
                </TableCell>
              </TableRow>
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
                  allowDelete={allowDelete}
                />
              ))
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
        ) : (
          <Typography component="span" sx={{ opacity: 0.8, fontSize: 'inherit' }}>
            Click a cell to edit. Invalid cells show a red mark — focus one to
            see the fix here.
          </Typography>
        )}
      </Box>
    </Box>
  )
})
