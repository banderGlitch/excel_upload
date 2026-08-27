import './PoolTemplatePicker.css'

export default function PoolTemplatePicker({
  templates,
  selectedTemplate,
  onSelect,
  onDownloadSample,
}) {
  return (
    <section className="template-section" aria-label="Pool templates">
      <div className="section-label">Pool template</div>
      <div className="template-grid">
        {templates.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`template-card ${
              item.id === selectedTemplate.id ? 'selected' : ''
            }`}
            onClick={() => onSelect(item.id)}
          >
            <strong>{item.name}</strong>
            <span>{item.description}</span>
            <span className="template-headers">
              {item.columns.map((column) => column.label).join(' · ')}
            </span>
          </button>
        ))}
      </div>

      <div className="template-actions">
        <button type="button" className="primary" onClick={onDownloadSample}>
          Download sample Excel
        </button>
        <span className="hint">
          Sample includes fixed headers for{' '}
          <strong>{selectedTemplate.name}</strong>
        </span>
      </div>
    </section>
  )
}
