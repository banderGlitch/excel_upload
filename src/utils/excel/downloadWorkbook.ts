import * as XLSX from 'xlsx'
import type { PoolColumn, PoolTemplate } from '../../api/contracts'
import { getTemplateLabels } from '../../data/poolTemplates'

function writeSheet(headers: string[], rows: string[][], fileName: string) {
  const sheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'Data')
  XLSX.writeFile(workbook, fileName)
}

export function downloadSampleTemplate(template: PoolTemplate) {
  const headers = getTemplateLabels(template)
  const emptyRow = [headers.map(() => '')]
  writeSheet(headers, emptyRow, `${template.id}-sample.xlsx`)
}

export function downloadEditedWorkbook({
  columns,
  rows,
  fileName,
  templateId,
}: {
  columns: PoolColumn[]
  rows: string[][]
  fileName?: string
  templateId?: string
}) {
  const headers = columns.map((column) => column.label)
  const outName = fileName
    ? fileName.replace(/\.(xlsx|xls|csv)$/i, '') + '-edited.xlsx'
    : `${templateId ?? 'pool'}-edited.xlsx`

  writeSheet(headers, rows, outName)
}
