import { Link } from 'react-router-dom'
import { POOL_TEMPLATES } from '../data/poolTemplates'
import { usePoolData } from '../context/PoolDataContext'
import './PoolListPage.css'

export default function PoolListPage() {
  const { getRecords, loading, loadError } = usePoolData()

  return (
    <div className="app">
      <header className="app-header">
        <h1>Pool Manager</h1>
        <p>
          Open a pool to review backend records, fix highlighted errors, or
          upload Excel.
        </p>
      </header>

      {loading && <p className="sheet-status-hint">Loading pools…</p>}
      {loadError && <p className="error">{loadError}</p>}

      <div className="pool-list">
        {POOL_TEMPLATES.map((pool) => {
          const records = getRecords(pool.id)
          const issueCount = records.filter(
            (r) =>
              (r.recordStatus ?? '') === 'failed' ||
              (r.errorKeys ?? []).length > 0,
          ).length

          return (
            <Link
              key={pool.id}
              to={`/pools/${pool.id}`}
              className="pool-list-card"
            >
              <strong>{pool.name}</strong>
              <span>{pool.description}</span>
              <span className="pool-list-meta">
                {loading ? '…' : `${records.length} records`}
                {!loading &&
                  (issueCount > 0
                    ? ` · ${issueCount} with errors`
                    : ' · all clear')}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
