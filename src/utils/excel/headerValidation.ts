import { getTemplateLabels } from '../../data/poolTemplates'
import type { PoolTemplate } from '../../api/contracts'

export function normalizeHeader(value: unknown): string {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

export type HeaderValidationResult =
  | { ok: true }
  | { ok: false; message: string }

/**
 * Validates uploaded headers against a pool template's column labels.
 */
export function validateHeadersAgainstTemplate(
  uploadedHeaders: unknown[],
  template: PoolTemplate,
): HeaderValidationResult {
  const expected = getTemplateLabels(template)
  const uploaded = uploadedHeaders.map((header) => String(header ?? '').trim())

  const expectedNorm = expected.map(normalizeHeader)
  const uploadedNorm = uploaded.map(normalizeHeader).filter(Boolean)

  if (uploadedNorm.length === 0) {
    return {
      ok: false,
      message:
        'The file has no header row. Download the sample template and try again.',
    }
  }

  if (uploadedNorm.length !== expectedNorm.length) {
    return {
      ok: false,
      message: `Header count mismatch. Expected ${expected.length} columns (${expected.join(', ')}), but found ${uploadedNorm.length}.`,
    }
  }

  const mismatches: string[] = []
  for (let i = 0; i < expectedNorm.length; i++) {
    if (uploadedNorm[i] !== expectedNorm[i]) {
      mismatches.push(
        `Column ${i + 1}: expected "${expected[i]}", got "${uploaded[i] || '(empty)'}"`,
      )
    }
  }

  if (mismatches.length) {
    return {
      ok: false,
      message: `Headers do not match the "${template.name}" template. ${mismatches.join(' · ')}`,
    }
  }

  return { ok: true }
}
