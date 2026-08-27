import { useRef, useState, type DragEvent, type KeyboardEvent } from 'react'
import { EXCEL_ACCEPT } from '../utils/excel'
import './ExcelDropzone.css'

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

  return (
    <div
      className={`dropzone ${isDragging ? 'dragging' : ''} ${hasData ? 'compact' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={EXCEL_ACCEPT}
        onChange={onFileChange}
        hidden
      />
      <div className="dropzone-content">
        <span className="dropzone-icon" aria-hidden="true">
          ↑
        </span>
        <strong>
          {hasData ? 'Replace file' : `Upload ${templateName} Excel`}
        </strong>
        <span>Headers must match the selected template exactly</span>
      </div>
    </div>
  )
}
