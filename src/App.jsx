import { useExcelEditor } from './hooks/useExcelEditor'
import PoolTemplatePicker from './components/PoolTemplatePicker'
import ExcelDropzone from './components/ExcelDropzone'
import ExcelToolbar from './components/ExcelToolbar'
import EditableExcelTable from './components/EditableExcelTable'
import './styles/App.css'

function App() {
  const {
    templates,
    template,
    columns,
    rows,
    fileName,
    error,
    hasData,
    invalidCount,
    selectTemplate,
    downloadSample,
    uploadFile,
    updateCell,
    addRow,
    deleteRow,
    downloadExcel,
    clearAll,
  } = useExcelEditor()

  return (
    <div className="app">
      <header className="app-header">
        <h1>Excel Upload</h1>
        <p>
          Choose a pool template, download the sample, then upload a file with
          the exact same headers.
        </p>
      </header>

      <PoolTemplatePicker
        templates={templates}
        selectedTemplate={template}
        onSelect={selectTemplate}
        onDownloadSample={downloadSample}
      />

      <ExcelDropzone
        templateName={template.name}
        hasData={hasData}
        onUpload={uploadFile}
      />

      {error && <p className="error">{error}</p>}

      {hasData && (
        <>
          <ExcelToolbar
            fileName={fileName}
            templateName={template.name}
            rowCount={rows.length}
            columnCount={columns.length}
            invalidCount={invalidCount}
            onAddRow={addRow}
            onDownload={downloadExcel}
            onClear={clearAll}
          />
          <EditableExcelTable
            columns={columns}
            rows={rows}
            onCellChange={updateCell}
            onDeleteRow={deleteRow}
          />
        </>
      )}
    </div>
  )
}

export default App
