import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PoolDataProvider } from './context/PoolDataContext'
import PoolListPage from './pages/PoolListPage'
import PoolDetailPage from './pages/PoolDetailPage'
import PoolUploadPage from './pages/PoolUploadPage'
import './styles/App.css'

function App() {
  return (
    <PoolDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PoolListPage />} />
          <Route path="/pools/:poolId" element={<PoolDetailPage />} />
          <Route path="/pools/:poolId/upload" element={<PoolUploadPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PoolDataProvider>
  )
}

export default App
