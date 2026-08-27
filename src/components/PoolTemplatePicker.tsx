import { Box, Button, Typography } from '@mui/material'
import type { PoolTemplate } from '../api/contracts'
import { tokens } from '../theme/theme'

interface PoolTemplatePickerProps {
  templates: PoolTemplate[]
  selectedTemplate: PoolTemplate
  onSelect: (id: string) => void
  onDownloadSample: () => void
}

export default function PoolTemplatePicker({
  templates,
  selectedTemplate,
  onSelect,
  onDownloadSample,
}: PoolTemplatePickerProps) {
  return (
    <Box component="section" aria-label="Pool templates" sx={{ mb: 2.5 }}>
      <Typography
        sx={{
          fontSize: '0.8rem',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: 'text.secondary',
          mb: 1.25,
        }}
      >
        Pool template
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 1.5,
        }}
      >
        {templates.map((item) => {
          const selected = item.id === selectedTemplate.id
          return (
            <Box
              key={item.id}
              component="button"
              type="button"
              onClick={() => onSelect(item.id)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 0.75,
                textAlign: 'left',
                p: '14px 16px',
                borderRadius: '12px',
                border: `1px solid ${selected ? '#0f766e' : tokens.border}`,
                bgcolor: selected ? tokens.accentSoft : 'background.paper',
                boxShadow: selected ? 'inset 0 0 0 1px #0f766e' : 'none',
                color: 'inherit',
                font: 'inherit',
                cursor: 'pointer',
                transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
                '&:hover': { borderColor: '#0f766e' },
              }}
            >
              <Typography component="strong" sx={{ color: 'text.primary', fontSize: '1rem' }}>
                {item.name}
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.35 }}>
                {item.description}
              </Typography>
              <Typography
                variant="caption"
                sx={{ mt: 0.5, color: 'text.primary', opacity: 0.75, wordBreak: 'break-word' }}
              >
                {item.columns.map((column) => column.label).join(' · ')}
              </Typography>
            </Box>
          )
        })}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 1.5,
          mt: 1.75,
        }}
      >
        <Button variant="contained" onClick={onDownloadSample}>
          Download sample Excel
        </Button>
        <Typography variant="body2">
          Sample includes fixed headers for{' '}
          <Box component="strong" sx={{ color: 'text.primary' }}>
            {selectedTemplate.name}
          </Box>
        </Typography>
      </Box>
    </Box>
  )
}
