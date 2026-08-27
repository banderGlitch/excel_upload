import { Alert, Box, CardActionArea, Grid, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { POOL_TEMPLATES } from '../data/poolTemplates'
import { usePoolData } from '../context/PoolDataContext'
import AppShell from '../components/AppShell'
import { tokens } from '../theme/theme'

export default function PoolListPage() {
  const { getRecords, loading, loadError } = usePoolData()

  return (
    <AppShell>
      <Box component="header" sx={{ mb: 3 }}>
        <Typography variant="h1" sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Pool Manager
        </Typography>
        <Typography>
          Open a pool to review backend records, fix highlighted errors, or
          upload Excel.
        </Typography>
      </Box>

      {loading && (
        <Typography sx={{ opacity: 0.8, mb: 1.5 }}>Loading pools…</Typography>
      )}
      {loadError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
      )}

      <Grid container spacing={1.75}>
        {POOL_TEMPLATES.map((pool) => {
          const records = getRecords(pool.id)
          const issueCount = records.filter(
            (r) =>
              (r.recordStatus ?? '') === 'failed' ||
              (r.errorKeys ?? []).length > 0,
          ).length

          return (
            <Grid key={pool.id} size={{ xs: 12, md: 4 }}>
              <CardActionArea
                component={RouterLink}
                to={`/pools/${pool.id}`}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 1,
                  p: '18px 16px',
                  border: `1px solid ${tokens.border}`,
                  borderRadius: '12px',
                  bgcolor: 'background.paper',
                  color: 'inherit',
                  textDecoration: 'none',
                  height: '100%',
                  transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: tokens.accentSoft,
                    boxShadow: 'inset 0 0 0 1px #0f766e',
                  },
                }}
              >
                <Typography component="strong" sx={{ color: 'text.primary', fontSize: '1.05rem' }}>
                  {pool.name}
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                  {pool.description}
                </Typography>
                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'text.primary',
                  }}
                >
                  {loading ? '…' : `${records.length} records`}
                  {!loading &&
                    (issueCount > 0
                      ? ` · ${issueCount} with errors`
                      : ' · all clear')}
                </Typography>
              </CardActionArea>
            </Grid>
          )
        })}
      </Grid>
    </AppShell>
  )
}
