import { useRef, useState, type DragEvent, type KeyboardEvent } from 'react'
import { Box, Typography } from '@mui/material'
import NorthIcon from '@mui/icons-material/North'
import { EXCEL_ACCEPT } from '../utils/excel'
import { tokens } from '../theme/theme'

interface ExcelDropzoneProps {
  templateName: string
  hasData: boolean
  onUpload: (file: File) => void
}

export default function ExcelDropzone({
  templateName,
  hasData,
  onUpload,
}: ExcelDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onUpload(file)
    e.target.value = ''
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onUpload(file)
  }

  const active = isDragging

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
      sx={{
        border: `2px dashed ${active ? '#0f766e' : tokens.border}`,
        borderRadius: '12px',
        p: hasData ? '16px 20px' : '48px 24px',
        mb: hasData ? 2 : 0,
        bgcolor: active ? tokens.accentSoft : tokens.surface,
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s',
        '&:hover': {
          borderColor: '#0f766e',
          bgcolor: tokens.accentSoft,
        },
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={EXCEL_ACCEPT}
        onChange={onFileChange}
        hidden
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: hasData ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: hasData ? 'center' : 'flex-start',
          gap: hasData ? 1.25 : 0.75,
          color: 'text.secondary',
          pointerEvents: 'none',
        }}
      >
        <Box
          aria-hidden
          sx={{
            display: 'grid',
            placeItems: 'center',
            width: hasData ? 28 : 40,
            height: hasData ? 28 : 40,
            borderRadius: '50%',
            bgcolor: tokens.accentSoft,
            color: 'primary.main',
          }}
        >
          <NorthIcon sx={{ fontSize: hasData ? 16 : 20 }} />
        </Box>
        <Typography component="strong" sx={{ color: 'text.primary', fontWeight: 700 }}>
          {hasData ? 'Replace file' : `Upload ${templateName} Excel`}
        </Typography>
        <Typography variant="body2">
          Headers must match the selected template exactly
        </Typography>
      </Box>
    </Box>
  )
}
