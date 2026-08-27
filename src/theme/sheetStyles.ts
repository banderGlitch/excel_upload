import type { SxProps, Theme } from '@mui/material/styles'
import { tokens } from './theme'

/** Spreadsheet shell shared by EditableExcelTable + PoolDataTable */
export const sheetSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  border: `1px solid ${tokens.border}`,
  borderRadius: '10px',
  bgcolor: 'background.paper',
  overflow: 'hidden',
  boxShadow: '0 1px 2px rgba(16, 24, 40, 0.04)',
}

export const sheetScrollSx: SxProps<Theme> = {
  overflow: 'auto',
  maxHeight: tokens.sheetMaxHeight,
}

export const sheetTableSx: SxProps<Theme> = {
  width: '100%',
  minWidth: 960,
  tableLayout: 'fixed',
  borderCollapse: 'collapse',
  '& .MuiTableCell-root': {
    borderRight: `1px solid ${tokens.gridLine}`,
    borderBottom: `1px solid ${tokens.gridLine}`,
    padding: 0,
    verticalAlign: 'middle',
    height: 36,
    lineHeight: '36px',
  },
  '& .MuiTableCell-root:last-of-type': {
    borderRight: 'none',
  },
  '& .MuiTableHead-root .MuiTableCell-root': {
    position: 'sticky',
    top: 0,
    zIndex: 3,
    bgcolor: tokens.headerBg,
    borderBottom: `1px solid ${tokens.border}`,
  },
  '& .MuiTableBody-root .MuiTableRow-root:nth-of-type(even) .MuiTableCell-root:not(.row-num):not(.row-actions):not(.check-col)':
    {
      bgcolor: 'rgba(15, 23, 42, 0.015)',
    },
  '& .MuiTableBody-root .MuiTableRow-root:hover .MuiTableCell-root:not(.row-num):not(.row-actions):not(.check-col)':
    {
      bgcolor: tokens.rowHover,
    },
  '& .MuiTableBody-root .MuiTableRow-root.is-selected .MuiTableCell-root:not(.check-col):not(.row-num)':
    {
      bgcolor: `${tokens.accentSoft} !important`,
    },
}

export const thInnerSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  height: 36,
  px: 1.25,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  '& span': {
    fontSize: '0.8rem',
    fontWeight: 650,
    color: 'text.primary',
  },
}

export const cellInputSx = (invalid: boolean): SxProps<Theme> => ({
  display: 'block',
  width: '100%',
  height: 36,
  m: 0,
  border: 0,
  borderRadius: 0,
  bgcolor: 'transparent',
  color: invalid ? tokens.errorText : 'text.primary',
  font: 'inherit',
  fontSize: '0.84rem',
  fontWeight: invalid ? 550 : 400,
  lineHeight: '36px',
  pl: 1.25,
  pr: 3.5,
  outline: 'none',
  boxShadow: 'none',
  appearance: 'none',
  '&:focus': {
    bgcolor: '#fff',
    boxShadow: invalid
      ? `inset 0 0 0 2px ${themeError}`
      : 'inset 0 0 0 2px #0f766e',
    position: 'relative',
    zIndex: 1,
  },
})

const themeError = '#dc2626'

export const invalidCellSx: SxProps<Theme> = {
  bgcolor: `${tokens.errorSoft} !important`,
  boxShadow: `inset 3px 0 0 ${themeError}`,
}

export const rowNumSx: SxProps<Theme> = {
  width: 44,
  minWidth: 44,
  textAlign: 'center',
  color: 'text.secondary',
  fontSize: '0.75rem',
  fontVariantNumeric: 'tabular-nums',
  bgcolor: `${tokens.surface} !important`,
  userSelect: 'none',
}

export const sheetStatusSx = (hasError: boolean): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  minHeight: 38,
  px: 1.5,
  py: 1,
  borderTop: `1px solid ${hasError ? tokens.errorBorder : tokens.border}`,
  bgcolor: hasError ? tokens.errorSoft : tokens.surface,
  color: hasError ? tokens.errorText : 'text.secondary',
  fontSize: '0.84rem',
})
