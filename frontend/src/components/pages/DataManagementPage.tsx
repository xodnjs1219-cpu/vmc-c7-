import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  useTheme,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  FilePresent as FilePresentIcon,
} from '@mui/icons-material';

interface UploadedFile {
  name: string;
  size: number;
  uploadedAt: string;
  status: 'success' | 'pending' | 'error';
  records: number;
}

export const DataManagementPage = () => {
  const theme = useTheme();
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      name: 'department_data_2024.xlsx',
      size: 256,
      uploadedAt: '2024-11-01',
      status: 'success',
      records: 245,
    },
    {
      name: 'student_enrollment.xlsx',
      size: 512,
      uploadedAt: '2024-10-28',
      status: 'success',
      records: 1540,
    },
  ]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      const newFile: UploadedFile = {
        name: file.name,
        size: Math.round(file.size / 1024),
        uploadedAt: new Date().toISOString().split('T')[0],
        status: 'pending',
        records: 0,
      };
      setUploadedFiles([newFile, ...uploadedFiles]);
      // Simulate upload
      setTimeout(() => {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.name === newFile.name
              ? { ...f, status: 'success', records: 150 }
              : f
          )
        );
      }, 2000);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: 'error.main' }} />;
      default:
        return <FilePresentIcon sx={{ color: 'info.main' }} />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success':
        return '완료';
      case 'error':
        return '오류';
      default:
        return '업로드 중';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          데이터 관리
        </Typography>
        <Typography variant="body1" color="textSecondary">
          엑셀 파일을 업로드하여 데이터를 관리하세요
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 2.5,
        }}
      >
        {/* Upload Card */}
        <Box>
          <Card
            sx={{
              borderRadius: 2,
              border: `2px dashed ${
                isDragActive ? theme.palette.primary.main : theme.palette.divider
              }`,
              bgcolor: isDragActive
                ? `${theme.palette.primary.main}08`
                : 'transparent',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              height: '100%',
            }}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragEnter}
            onDrop={handleDrop}
          >
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 6,
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  bgcolor: `${theme.palette.primary.main}15`,
                  color: theme.palette.primary.main,
                  mb: 2,
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 36 }} />
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: theme.palette.text.primary,
                }}
              >
                파일을 여기에 끌어놓으세요
              </Typography>

              <Typography
                variant="body1"
                color="textSecondary"
                sx={{ mb: 2.5 }}
              >
                또는 아래 버튼을 클릭하여 파일을 선택하세요
              </Typography>

              <Button
                variant="contained"
                component="label"
                size="large"
                sx={{
                  px: 3,
                  py: 1.2,
                }}
              >
                파일 선택
                <input
                  hidden
                  accept=".xlsx,.xls"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleFiles(e.target.files);
                    }
                  }}
                />
              </Button>

              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ mt: 2 }}
              >
                지원 형식: .xlsx, .xls (최대 10MB)
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Info Cards */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Card
                sx={{
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: 1.5,
                        bgcolor: `${theme.palette.primary.main}15`,
                        color: theme.palette.primary.main,
                      }}
                    >
                      <FilePresentIcon />
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ fontSize: '0.85rem' }}
                      >
                        총 업로드 파일
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700 }}
                      >
                        {uploadedFiles.length}개
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

            <Card
                sx={{
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: 1.5,
                        bgcolor: `${theme.palette.success.main}15`,
                        color: theme.palette.success.main,
                      }}
                    >
                      <CheckCircleIcon />
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ fontSize: '0.85rem' }}
                      >
                        총 기록
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700 }}
                      >
                        {uploadedFiles.reduce((sum, f) => sum + f.records, 0).toLocaleString()}개
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
        </Box>

        {/* Upload History */}
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Card
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                }}
              >
                업로드 이력
              </Typography>

              {uploadedFiles.length === 0 ? (
                <Typography color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
                  업로드된 파일이 없습니다
                </Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                        <TableCell sx={{ fontWeight: 700 }}>파일명</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          크기
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          기록
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700 }}>
                          상태
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          날짜
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {uploadedFiles.map((file, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            '&:hover': {
                              bgcolor: theme.palette.action.hover,
                            },
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                              <FilePresentIcon sx={{ color: 'primary.main' }} />
                              {file.name}
                            </Box>
                          </TableCell>
                          <TableCell align="right">{file.size}KB</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={`${file.records}개`}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
                              {getStatusIcon(file.status)}
                              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                {getStatusLabel(file.status)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="caption" color="textSecondary">
                              {file.uploadedAt}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};
