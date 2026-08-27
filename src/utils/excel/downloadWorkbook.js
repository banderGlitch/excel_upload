import * as XLSX from 'xlsx'
import { getTemplateLabels } from '../../data/poolTemplates'

function writeSheet(headers, rows, fileName) {
  const sheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'Data')
  XLSX.writeFile(workbook, fileName)
}

export function downloadSampleTemplate(template) {
  const headers = getTemplateLabels(template)
  const emptyRow = [headers.map(() => '')]
  writeSheet(headers, emptyRow, `${template.id}-sample.xlsx`)
}

export function downloadEditedWorkbook({ columns, rows, fileName, templateId }) {
  const headers = columns.map((column) => column.label)
  const outName = fileName
    ? fileName.replace(/\.(xlsx|xls|csv)$/i, '') + '-edited.xlsx'
    : `${templateId}-edited.xlsx`

  writeSheet(headers, rows, outName)
}
