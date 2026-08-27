import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  Link,
  Typography,
} from '@mui/material'
import { Link as RouterLink, Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  getPoolTemplateById,
  getVisibleTableColumns,
} from '../data/poolTemplates'
import {
  RECORD_STATUS,
  STATUS_FILTERS,
  isFailedStatus,
  normalizeStatus,
  type StatusFilterId,
} from '../data/recordStatus'
import { usePoolData } from '../context/PoolDataContext'
import PoolDataTable from '../components/PoolDataTable'
import AppShell from '../components/AppShell'
import { tokens } from '../theme/theme'

export default function PoolDetailPage() {
  const { poolId } = useParams()
  const navigate = useNavigate()
  const template = getPoolTemplateById(poolId)
  const { getRecords, updateRecordField, startRetryUpload, loading, loadError } =
    usePoolData()
  const [statusFilter, setStatusFilter] = useState<StatusFilterId>('all')
  const [selectedIds, setSelectedIds] = useState(() => new Set<string>())

  const records = getRecords(template?.id ?? '')
  const isFailedView = statusFilter === RECORD_STATUS.FAILED

  const counts = useMemo(() => {
    const result: Record<string, number> = {
      all: records.length,
      [RECORD_STATUS.RECEIVED]: 0,
      [RECORD_STATUS.VALIDATED]: 0,
      [RECORD_STATUS.FAILED]: 0,
    }
    for (const row of records) {
      const key = normalizeStatus(row.recordStatus)
      if (key in result) result[key] += 1
    }
    return result
  }, [records])

  const filteredRecords = useMemo(() => {
    if (statusFilter === 'all') return records
    return records.filter(
      (row) => normalizeStatus(row.recordStatus) === statusFilter,
    )
  }, [records, statusFilter])

  const selectedFailed = useMemo(() => {
    return records.filter(
      (row) => selectedIds.has(row.id) && isFailedStatus(row.recordStatus),
    )
  }, [records, selectedIds])

  if (!template) {
    return <Navigate to="/" replace />
  }

  const onFieldChange = (recordId: string, fieldKey: string, value: string) => {
    updateRecordField(template.id, recordId, fieldKey, value)
  }

  const onToggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const onToggleAll = (checked: boolean, ids: string[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) ids.forEach((id) => next.add(id))
      else ids.forEach((id) => next.delete(id))
      return next
    })
  }

  const onFilterChange = (id: StatusFilterId) => {
    setStatusFilter(id)
    setSelectedIds(new Set())
  }

  const retryUpload = () => {
    if (!selectedFailed.length) return
    const payload = selectedFailed.map((row) => ({ ...row }))
    startRetryUpload(template.id, payload)
    navigate(`/pools/${template.id}/upload`, {
      state: { mode: 'retry', poolId: template.id, records: payload },
    })
  }

  return (
    <AppShell>
      <Box
        component="header"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          alignItems: { xs: 'stretch', sm: 'flex-start' },
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Box>
          <Link
            component={RouterLink}
            to="/"
            underline="hover"
            color="primary"
            sx={{ display: 'inline-block', mb: 1, fontSize: '0.9rem' }}
          >
            ← All pools
          </Link>
          <Typography variant="h1" sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            {template.name}
          </Typography>
          <Typography>{template.description}</Typography>
        </Box>
        <Button
          component={RouterLink}
          to={`/pools/${template.id}/upload`}
          variant="contained"
          sx={{ flexShrink: 0, alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
        >
          Upload Excel
        </Button>
      </Box>

      {loading && (
        <Typography sx={{ opacity: 0.8, mb: 1.5 }}>Loading records…</Typography>
      )}
      {loadError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1.5,
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          mb: 1.75,
        }}
      >
        <Box
          role="tablist"
          aria-label="Status filter"
          sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}
        >
          {STATUS_FILTERS.map((filter) => {
            const active = statusFilter === filter.id
            return (
              <Chip
                key={filter.id}
                role="tab"
                aria-selected={active}
                clickable
                onClick={() => onFilterChange(filter.id)}
                label={
                  <Box
                    component="span"
                    sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}
                  >
                    <span>{filter.label}</span>
                    <Box
                      component="span"
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: active ? '#fff' : 'text.secondary',
                        bgcolor: active ? 'primary.main' : tokens.surface,
                        borderRadius: 999,
                        px: 0.875,
                        py: '1px',
                      }}
                    >
                      {counts[filter.id] ?? 0}
                    </Box>
                  </Box>
                }
                variant="outlined"
                sx={{
                  height: 34,
                  borderColor: active ? 'primary.main' : tokens.border,
                  bgcolor: active ? tokens.accentSoft : 'background.paper',
                  color: 'text.primary',
                  '& .MuiChip-label': { px: 1.5 },
                }}
              />
            )
          })}
        </Box>

        {isFailedView && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, alignItems: 'center' }}>
            <Typography variant="body2">{selectedIds.size} selected</Typography>
            <Button
              variant="contained"
              disabled={!selectedFailed.length}
              title={
                selectedFailed.length
                  ? 'Open upload page with selected failed rows (without status/remark)'
                  : 'Select one or more failed rows first'
              }
              onClick={retryUpload}
            >
              Retry upload
            </Button>
          </Box>
        )}
      </Box>

      <PoolDataTable
        columns={getVisibleTableColumns(template)}
        records={filteredRecords}
        selectedIds={selectedIds}
        onToggleRow={onToggleRow}
        onToggleAll={onToggleAll}
        onFieldChange={onFieldChange}
        showSelection={isFailedView}
        showRemark={isFailedView}
      />
    </AppShell>
  )
}
