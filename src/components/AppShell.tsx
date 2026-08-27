import { Box, type BoxProps } from '@mui/material'

/** Page container matching prior .app layout */
export default function AppShell({ children, ...props }: BoxProps) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1280,
        mx: 'auto',
        px: { xs: 1.75, sm: 3 },
        pt: { xs: 2.5, sm: 4 },
        pb: { xs: 4.5, sm: 6 },
        textAlign: 'left',
        boxSizing: 'border-box',
      }}
      {...props}
    >
      {children}
    </Box>
  )
}
