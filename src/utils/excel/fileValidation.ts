export function isExcelFile(file: File | null | undefined): boolean {
  if (!file) return false

  const hasValidExtension = /\.(xlsx|xls|csv)$/i.test(file.name)
  const hasValidMime =
    file.type.includes('sheet') ||
    file.type.includes('csv') ||
    file.type.includes('excel')

  return hasValidExtension || hasValidMime
}

export const EXCEL_ACCEPT =
  '.xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv'
