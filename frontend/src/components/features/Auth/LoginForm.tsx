import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from '@mui/material';
import { useLogin } from '@/hooks/queries/useAuth';
import { USER_ROLES } from '@/config/constants';

const loginSchema = z.object({
  username: z.string().min(1, '아이디를 입력해주세요').max(150),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const navigate = useNavigate();
  const { mutate, isPending, isError, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    mutate(data, {
      onSuccess: (response) => {
        // 역할에 따라 리디렉션
        if (response.user.role === USER_ROLES.ADMIN) {
          navigate('/admin/data-management');
        } else {
          navigate('/dashboard');
        }
      },
    });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ pt: 8, pb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" sx={{ mb: 3, fontWeight: 'bold' }}>
            대학교 데이터 대시보드
          </Typography>
          <Typography variant="body2" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
            로그인
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('username')}
              label="아이디"
              fullWidth
              margin="normal"
              error={!!errors.username}
              helperText={errors.username?.message}
              disabled={isPending}
              autoFocus
              data-testid="login-username-input"
            />
            <TextField
              {...register('password')}
              label="비밀번호"
              type="password"
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isPending}
              data-testid="login-password-input"
            />

            {isError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error?.message || '아이디 또는 비밀번호가 일치하지 않습니다'}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={isPending}
              data-testid="login-submit-button"
            >
              {isPending ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  로그인 중...
                </>
              ) : (
                '로그인'
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
