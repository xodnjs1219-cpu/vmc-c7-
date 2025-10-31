import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useCurrentUser } from '@/hooks/queries/useAuth';
import { LoginForm } from '@/components/features/Auth/LoginForm';
import { USER_ROLES } from '@/config/constants';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUser();

  useEffect(() => {
    // 이미 로그인되어 있으면 대시보드로 리디렉션
    if (currentUser) {
      if (currentUser.role === USER_ROLES.ADMIN) {
        navigate('/admin/data-management', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [currentUser, navigate]);

  if (currentUser) {
    return null; // 리디렉션 중
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <LoginForm />
    </Box>
  );
};
