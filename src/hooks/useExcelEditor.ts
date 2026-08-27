import { useCallback, useEffect, useRef, useState } from 'react'
import type { PoolColumn, UiPoolRecord } from '../api/contracts'
import { getPoolTemplateById, getUploadColumns } from '../data/poolTemplates'
import { RECORD_STATUS } from '../data/recordStatus'
import {
  downloadEditedWorkbook,
  downloadSampleTemplate,
  getInvalidCells,
  isExcelFile,
  parseExcelAgainstTemplate,
} from '../utils/excel'

export interface ExcelEditorBootstrap {
  mode?: 'retry'
  records?: UiPoolRecord[]
}

export type BuildRecordsResult =
  | { ok: true; message: string; records: UiPoolRecord[] }
  | { ok: false; message: string; records: UiPoolRecord[] }

function recordsToGrid(
  template: NonNullable<ReturnType<typeof getPoolTemplateById>>,
  records: UiPoolRecord[],
): string[][] {
  const columns = getUploadColumns(template)
  return records.map((record) =>
    columns.map((column) => String(record[column.key] ?? '')),
  )
}

/**
 * Upload editor for a single pool (template fixed by route).
 */
export function useExcelEditor(
  templateId: string | undefined,
  bootstrap: ExcelEditorBootstrap | null = null,
) {
  const template = getPoolTemplateById(templateId)
  const isRetry = bootstrap?.mode === 'retry'
  const retryRecords = bootstrap?.records ?? []

  const [columns, setColumns] = useState<PoolColumn[]>(() =>
    template && isRetry ? getUploadColumns(template) : [],
  )
  const [rows, setRows] = useState<string[][]>(() =>
    template && isRetry ? recordsToGrid(template, retryRecords) : [],
  )
  const [fileName, setFileName] = useState(() =>
    isRetry ? `${templateId}-retry.xlsx` : '',
  )
  const [error, setError] = useState('')
  const [invalidCount, setInvalidCount] = useState(0)
  const [retrySourceIds, setRetrySourceIds] = useState<string[]>(() =>
    isRetry ? retryRecords.map((row) => row.id) : [],
  )

  const rowsRef = useRef(rows)
  rowsRef.current = rows

  useEffect(() => {
    if (!template || bootstrap?.mode !== 'retry' || !bootstrap.records?.length) {
      return
    }
    const uploadColumns = getUploadColumns(template)
    setColumns(uploadColumns)
    setRows(recordsToGrid(template, bootstrap.records))
    setFileName(`${templateId}-retry.xlsx`)
    setRetrySourceIds(bootstrap.records.map((row) => row.id))
    setError('')
  }, [template, templateId, bootstrap])

  useEffect(() => {
    if (!columns.length) {
      setInvalidCount(0)
      return undefined
    }

    const timer = setTimeout(() => {
      setInvalidCount(Object.keys(getInvalidCells(rows, columns)).length)
    }, 350)

    return () => clearTimeout(timer)
  }, [rows, columns])

  const resetTable = useCallback(() => {
    setColumns([])
    setRows([])
    setFileName('')
    setInvalidCount(0)
  }, [])

  const clearAll = useCallback(() => {
    resetTable()
    setError('')
  }, [resetTable])

  const downloadSample = useCallback(() => {
    if (template) downloadSampleTemplate(template)
  }, [template])

  const uploadFile = useCallback(
    async (file: File) => {
      if (!template) return
      setError('')

      if (!isExcelFile(file)) {
        setError('Please upload an Excel (.xlsx, .xls) or CSV file.')
        return
      }

      try {
        const parsed = await parseExcelAgainstTemplate(file, template)
        setColumns(parsed.columns)
        setRows(parsed.rows)
        setFileName(parsed.fileName)
        setError('')
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Could not read this file. Try another Excel or CSV file.'
        setError(message)
        resetTable()
      }
    },
    [template, resetTable],
  )

  const updateCell = useCallback(
    (rowIndex: number, colIndex: number, value: string) => {
      setRows((prev) => {
        if (prev[rowIndex]?.[colIndex] === value) return prev
        const next = prev.slice()
        const row = next[rowIndex].slice()
        row[colIndex] = value
        next[rowIndex] = row
        return next
      })
    },
    [],
  )

  const addRow = useCallback(() => {
    setRows((prev) => [...prev, columns.map(() => '')])
  }, [columns])

  const deleteRow = useCallback((rowIndex: number) => {
    setRows((prev) => prev.filter((_, i) => i !== rowIndex))
  }, [])

  const downloadExcel = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    window.setTimeout(() => {
      const currentRows = rowsRef.current
      const issues = getInvalidCells(currentRows, columns)
      const count = Object.keys(issues).length

      if (count > 0) {
        setInvalidCount(count)
        setError(
          `Fix ${count} invalid cell${count === 1 ? '' : 's'} before downloading.`,
        )
        return
      }

      setError('')
      downloadEditedWorkbook({
        columns,
        rows: currentRows,
        fileName,
        templateId: template?.id,
      })
    }, 0)
  }, [columns, fileName, template?.id])

  const buildRecordsFromGrid = useCallback((): BuildRecordsResult => {
    if (!template) {
      return { ok: false, message: 'Unknown pool template.', records: [] }
    }

    const currentRows = rowsRef.current
    if (!currentRows.length) {
      return {
        ok: false,
        message: 'Upload and review a file before saving to the pool.',
        records: [],
      }
    }

    const issues = getInvalidCells(currentRows, getUploadColumns(template))
    const count = Object.keys(issues).length
    if (count > 0) {
      setInvalidCount(count)
      return {
        ok: false,
        message: `Fix ${count} invalid cell${count === 1 ? '' : 's'} before saving.`,
        records: [],
      }
    }

    const records = currentRows.map((row, index) => {
      const existingId = isRetry ? retrySourceIds[index] : null
      const record: UiPoolRecord = {
        id: existingId || `upload-${Date.now()}-${index}`,
        remark: '',
        errorKeys: [],
        recordStatus: isRetry
          ? RECORD_STATUS.VALIDATED
          : RECORD_STATUS.RECEIVED,
      }

      getUploadColumns(template).forEach((column, colIndex) => {
        record[column.key] = row[colIndex] ?? ''
      })

      return record
    })

    return { ok: true, message: '', records }
  }, [template, isRetry, retrySourceIds])

  return {
    template,
    columns,
    rows,
    fileName,
    error,
    hasData: columns.length > 0,
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
  }
}
