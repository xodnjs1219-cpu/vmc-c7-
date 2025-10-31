import type { RouteObject } from 'react-router-dom';
import { LoginPage } from '@/components/pages/LoginPage';
import { DashboardPage } from '@/components/pages/DashboardPage';
import { DataManagementPage } from '@/components/pages/DataManagementPage';
import { DetailedReportPage } from '@/components/pages/DetailedReportPage';
import { ProtectedRoute } from '@/router/ProtectedRoute';
import { USER_ROLES } from '@/config/constants';

const UnauthorizedPage = () => <div>Unauthorized Access</div>;
const NotFoundPage = () => <div>Page Not Found</div>;

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute requiredRole={USER_ROLES.USER}>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/data-management',
    element: (
      <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
        <DataManagementPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports/:reportType',
    element: (
      <ProtectedRoute>
        <DetailedReportPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
