import { useCallback, useEffect, useRef, useState } from 'react'
import {
  POOL_TEMPLATES,
  getPoolTemplateById,
} from '../data/poolTemplates'
import {
  downloadEditedWorkbook,
  downloadSampleTemplate,
  getInvalidCells,
  isExcelFile,
  parseExcelAgainstTemplate,
} from '../utils/excel'

export function useExcelEditor() {
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    POOL_TEMPLATES[0].id,
  )
  const [columns, setColumns] = useState([])
  const [rows, setRows] = useState([])
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const [invalidCount, setInvalidCount] = useState(0)

  const rowsRef = useRef(rows)
  rowsRef.current = rows

  const template =
    getPoolTemplateById(selectedTemplateId) ?? POOL_TEMPLATES[0]

  // Debounced validation scan for toolbar only — never blocks typing
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

  const selectTemplate = useCallback(
    (id) => {
      if (id === selectedTemplateId) return
      setSelectedTemplateId(id)
      setError('')
      resetTable()
    },
    [selectedTemplateId, resetTable],
  )

  const downloadSample = useCallback(() => {
    downloadSampleTemplate(template)
  }, [template])

  const uploadFile = useCallback(
    async (file) => {
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
        setError(
          err?.message ||
            'Could not read this file. Try another Excel or CSV file.',
        )
        resetTable()
      }
    },
    [template, resetTable],
  )

  const updateCell = useCallback((rowIndex, colIndex, value) => {
    setRows((prev) => {
      if (prev[rowIndex]?.[colIndex] === value) return prev
      const next = prev.slice()
      const row = next[rowIndex].slice()
      row[colIndex] = value
      next[rowIndex] = row
      return next
    })
  }, [])

  const addRow = useCallback(() => {
    setRows((prev) => [...prev, columns.map(() => '')])
  }, [columns])

  const deleteRow = useCallback((rowIndex) => {
    setRows((prev) => prev.filter((_, i) => i !== rowIndex))
  }, [])

  const downloadExcel = useCallback(() => {
    // Commit the currently focused cell before export
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
        templateId: template.id,
      })
    }, 0)
  }, [columns, fileName, template.id])

  return {
    templates: POOL_TEMPLATES,
    template,
    columns,
    rows,
    fileName,
    error,
    hasData: columns.length > 0,
    invalidCount,
    selectTemplate,
    downloadSample,
    uploadFile,
    updateCell,
    addRow,
    deleteRow,
    downloadExcel,
    clearAll,
  }
}
