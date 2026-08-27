/**
 * Pool templates define fixed Excel columns users must match.
 * Later these can be loaded from an API as form objects.
 *
 * column.shape:
 *   key   – stable id (API / form field name)
 *   label – Excel header text (upload matching)
 *   type  – validation type (see COLUMN_TYPES). Optional if key hints the type
 *           (e.g. key "email" → email validator automatically).
 *
 * Adding a NEW template:
 *   1. Push another object into POOL_TEMPLATES with columns[].
 *   2. Set type: 'email' | 'date' | 'gender' | 'number' | 'phone' | 'status' | 'text'
 *   3. No other code changes — header check + cell validation + highlight apply automatically.
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
      { key: 'status', label: 'Status', type: COLUMN_TYPES.STATUS },
    ],
  },
]

export function getPoolTemplateById(id) {
  return POOL_TEMPLATES.find((template) => template.id === id) ?? null
}

/** Excel header labels derived from column definitions */
export function getTemplateLabels(template) {
  return template.columns.map((column) => column.label)
}
