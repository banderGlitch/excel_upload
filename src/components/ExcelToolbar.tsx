import { Alert, Box, Button, Chip, Typography } from '@mui/material'
import { tokens } from '../theme/theme'

interface ExcelToolbarProps {
  fileName: string
  templateName: string
  rowCount: number
  columnCount: number
  invalidCount?: number
  onAddRow?: () => void
  onDownload: () => void
  onClear?: () => void
}

export default function ExcelToolbar({
  fileName,
  templateName,
  rowCount,
  columnCount,
  invalidCount = 0,
  onAddRow,
  onDownload,
  onClear,
}: ExcelToolbarProps) {
  return (
    <Box sx={{ my: 1, mb: 2 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1.5,
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.25,
            alignItems: 'center',
          }}
        >
          <Typography sx={{ fontWeight: 600, color: 'text.primary', wordBreak: 'break-all' }}>
            {fileName}
          </Typography>
          <Chip size="small" label={templateName} variant="outlined" />
          <Chip
            size="small"
            variant="outlined"
            label={`${rowCount} row${rowCount !== 1 ? 's' : ''} · ${columnCount} columns`}
          />
          {invalidCount > 0 && (
            <Chip
              size="small"
              label={`${invalidCount} invalid`}
              sx={{
                fontWeight: 600,
                color: tokens.errorText,
                bgcolor: tokens.errorSoft,
                borderColor: tokens.errorBorder,
              }}
              variant="outlined"
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {onAddRow && (
            <Button variant="outlined" color="inherit" onClick={onAddRow}>
              Add row
            </Button>
          )}
          <Button
            variant="contained"
            onClick={onDownload}
            disabled={invalidCount > 0}
            title={
              invalidCount > 0
                ? 'Fix invalid cells before downloading'
                : undefined
            }
          >
            Download Excel
          </Button>
          {onClear && (
            <Button variant="text" color="inherit" onClick={onClear}>
              Clear
            </Button>
          )}
        </Box>
      </Box>

      {invalidCount > 0 && (
        <Alert severity="error" sx={{ mt: 1.5 }} role="status">
          <Typography component="span" sx={{ fontWeight: 650, mr: 0.5 }}>
            {invalidCount} cell{invalidCount === 1 ? '' : 's'} need
            {invalidCount === 1 ? 's' : ''} attention.
          </Typography>
          Invalid cells are marked in red — focus a cell to see the fix in the
          status bar. Submit stays locked until values are valid.
        </Alert>
      )}
    </Box>
  )
}
