import { Box, Container, Typography, Button, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export const DataManagementPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          데이터 관리
        </Typography>

        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            엑셀 파일 업로드
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            .xlsx 또는 .xls 파일을 업로드하세요
          </Typography>
          <Button
            variant="contained"
            component="label"
            size="large"
          >
            파일 선택
            <input
              hidden
              accept=".xlsx,.xls"
              type="file"
            />
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};
