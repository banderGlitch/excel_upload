import * as XLSX from 'xlsx'
import { validateHeadersAgainstTemplate } from './headerValidation'

function padRow(row, colCount) {
  const filled = row.map((cell) => (cell == null ? '' : String(cell)))
  while (filled.length < colCount) filled.push('')
  return filled.slice(0, colCount)
}

function isEmptyRow(row) {
  return !row.some((cell) => String(cell ?? '').trim() !== '')
}

/**
 * Reads an Excel/CSV file and validates it against the selected pool template.
 * @returns {Promise<{ columns: object[], rows: string[][], fileName: string }>}
 */
export async function parseExcelAgainstTemplate(file, template) {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const firstSheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[firstSheetName]
  const data = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
    raw: false,
  })

  if (!data.length) {
    throw new Error(
      'The file is empty. Download the sample template and fill it in.',
    )
  }

  const uploadedHeaders = data[0].map((cell) =>
    cell == null ? '' : String(cell),
  )
  const check = validateHeadersAgainstTemplate(uploadedHeaders, template)

  if (!check.ok) {
    throw new Error(check.message)
  }

  const colCount = template.columns.length
  const rows = data
    .slice(1)
    .filter((row) => !isEmptyRow(row))
    .map((row) => padRow(row, colCount))

  return {
    columns: template.columns.map((column) => ({ ...column })),
    rows,
    fileName: file.name,
  }
}
