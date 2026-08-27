import { getTemplateLabels } from '../../data/poolTemplates'

export function normalizeHeader(value) {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

/**
 * Validates uploaded headers against a pool template's column labels.
 * @returns {{ ok: true } | { ok: false, message: string }}
 */
export function validateHeadersAgainstTemplate(uploadedHeaders, template) {
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

  const mismatches = []
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
