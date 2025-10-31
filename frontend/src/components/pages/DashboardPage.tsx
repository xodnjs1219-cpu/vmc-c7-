import { Box, Container, Typography, Paper } from '@mui/material';
import { useCurrentUser } from '@/hooks/queries/useAuth';

export const DashboardPage = () => {
  const { data: currentUser } = useCurrentUser();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          메인 대시보드
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">실적</Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>-</Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">논문</Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>-</Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">학생</Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>-</Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">예산</Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>-</Typography>
          </Paper>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            로그인 사용자: {currentUser?.username}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};
