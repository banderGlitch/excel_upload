/**
 * Pool templates define fixed Excel columns users must match.
 * Same shape as GET /api/pools → data[] (see src/api/contracts.js).
 *
 * column.shape:
 *   key   – field id inside PoolRecord.values
 *   label – Excel header text (upload matching)
 *   type  – validation type
 *   backendOnly – if true, excluded from Excel upload + detail data columns
 */
import { COLUMN_TYPES } from '../utils/excel/columnTypes'

export { COLUMN_TYPES }

export const POOL_TEMPLATES = [
  {
    id: 'employee-pool',
    name: 'Employee Pool',
    description: 'Employee master data for HR onboarding and payroll.',
    columns: [
      { key: 'employeeId', label: 'Employee ID', type: COLUMN_TYPES.TEXT },
      { key: 'fullName', label: 'Full Name', type: COLUMN_TYPES.TEXT },
      { key: 'email', label: 'Email', type: COLUMN_TYPES.EMAIL },
      { key: 'gender', label: 'Gender', type: COLUMN_TYPES.GENDER },
      { key: 'department', label: 'Department', type: COLUMN_TYPES.TEXT },
      { key: 'role', label: 'Role', type: COLUMN_TYPES.TEXT },
      { key: 'joinDate', label: 'Join Date', type: COLUMN_TYPES.DATE },
    ],
  },
  {
    id: 'product-pool',
    name: 'Product Pool',
    description: 'Product catalog with stock and pricing fields.',
    columns: [
      { key: 'sku', label: 'SKU', type: COLUMN_TYPES.TEXT },
      { key: 'productName', label: 'Product Name', type: COLUMN_TYPES.TEXT },
      { key: 'category', label: 'Category', type: COLUMN_TYPES.TEXT },
      { key: 'stock', label: 'Stock', type: COLUMN_TYPES.NUMBER },
      { key: 'unitPrice', label: 'Unit Price', type: COLUMN_TYPES.NUMBER },
      { key: 'supplier', label: 'Supplier', type: COLUMN_TYPES.TEXT },
    ],
  },
  {
    id: 'vendor-pool',
    name: 'Vendor Pool',
    description: 'Vendor / supplier directory for procurement.',
    columns: [
      { key: 'vendorCode', label: 'Vendor Code', type: COLUMN_TYPES.TEXT },
      { key: 'vendorName', label: 'Vendor Name', type: COLUMN_TYPES.TEXT },
      { key: 'contactPerson', label: 'Contact Person', type: COLUMN_TYPES.TEXT },
      { key: 'phone', label: 'Phone', type: COLUMN_TYPES.PHONE },
      { key: 'email', label: 'Email', type: COLUMN_TYPES.EMAIL },
      { key: 'city', label: 'City', type: COLUMN_TYPES.TEXT },
      // Backend-only — not shown in tables or Excel upload
      { key: 'status', label: 'Status', type: COLUMN_TYPES.STATUS, backendOnly: true },
    ],
  },
]

export function getPoolTemplateById(id) {
  return POOL_TEMPLATES.find((template) => template.id === id) ?? null
}

/** Columns that belong in Excel upload / sample / retry grid */
export function getUploadColumns(template) {
  return template.columns.filter((column) => !column.backendOnly)
}

/** Columns shown on pool detail tables (exclude backend-only status fields) */
export function getVisibleTableColumns(template) {
  return template.columns.filter((column) => !column.backendOnly)
}

/** Excel header labels derived from uploadable column definitions */
export function getTemplateLabels(template) {
  return getUploadColumns(template).map((column) => column.label)
}
