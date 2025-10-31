import { Box, Container, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export const DetailedReportPage = () => {
  const { reportType } = useParams<{ reportType: string }>();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          상세 리포트 - {reportType}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          상세 리포트 페이지는 구현 예정입니다.
        </Typography>
      </Box>
    </Container>
  );
};
