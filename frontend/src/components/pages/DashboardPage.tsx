import {
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Article as ArticleIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  EventNote as EventNoteIcon,
} from '@mui/icons-material';
import { useCurrentUser } from '@/hooks/queries/useAuth';
import { 
  useDashboardSummary, 
  usePublicationsData, 
  useStudentsData 
} from '@/hooks/queries/useDashboard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 16px ${color}15`,
        },
        height: '100%',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 1.5,
              bgcolor: `${color}15`,
              color: color,
            }}
          >
            {icon}
          </Box>
          {trend !== undefined && (
            <Chip
              size="small"
              label={`+${trend}%`}
              variant="outlined"
              sx={{
                height: 24,
                fontSize: '0.75rem',
                color: 'success.main',
                borderColor: 'success.main',
              }}
            />
          )}
        </Box>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1, fontSize: '0.875rem' }}>
          {title}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export const DashboardPage = () => {
  const theme = useTheme();
  const { data: currentUser } = useCurrentUser();
  
  // React Query hooks
  const { data: summaryData, isLoading: isLoadingSummary, error: summaryError } = useDashboardSummary({});
  const { data: publicationsData, isLoading: isLoadingPublications } = usePublicationsData({});
  const { data: studentsData, isLoading: isLoadingStudents } = useStudentsData({});

  const metrics = [
    {
      title: '총 학생',
      value: isLoadingSummary ? '-' : (summaryData?.summary?.total_students || 0).toLocaleString(),
      icon: <PeopleIcon sx={{ fontSize: 28 }} />,
      color: theme.palette.primary.main,
      trend: undefined,
    },
    {
      title: '총 교직원',
      value: isLoadingSummary ? '-' : (summaryData?.summary?.total_faculty || 0).toLocaleString(),
      icon: <TrendingUpIcon sx={{ fontSize: 28 }} />,
      color: theme.palette.secondary.main,
      trend: undefined,
    },
    {
      title: '게재된 논문',
      value: isLoadingSummary ? '-' : (summaryData?.summary?.total_publications || 0).toString(),
      icon: <ArticleIcon sx={{ fontSize: 28 }} />,
      color: theme.palette.success.main,
      trend: undefined,
    },
    {
      title: '총 예산',
      value: isLoadingSummary ? '-' : `$${(summaryData?.summary?.total_budget || 0).toLocaleString()}`,
      icon: <AttachMoneyIcon sx={{ fontSize: 28 }} />,
      color: theme.palette.warning.main,
      trend: undefined,
    },
  ];

  return (
    <Box>
      {summaryError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          데이터를 불러오는 중 오류가 발생했습니다: {summaryError.message}
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          대시보드
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
          <Chip
            icon={<EventNoteIcon />}
            label={`${summaryData?.year || new Date().getFullYear()}년 ${summaryData?.semester || ''}`}
            variant="outlined"
            size="medium"
          />
          <Typography variant="body1" color="textSecondary">
            {currentUser?.username && (
              <span>
                환영합니다, <strong>{currentUser.username}</strong>님
              </span>
            )}
          </Typography>
        </Box>
      </Box>

      {/* Metric Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 2,
          mb: 3,
        }}
      >
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </Box>

      {/* Charts Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Publications Trend */}
        <Box>
          <Card
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                논문 발표 추이
              </Typography>
              {isLoadingPublications ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                  <CircularProgress />
                </Box>
              ) : publicationsData && publicationsData.data.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={publicationsData.data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis dataKey="year" style={{ fontSize: '0.875rem' }} />
                    <YAxis style={{ fontSize: '0.875rem' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                        fontSize: '0.875rem',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '0.875rem' }} />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke={theme.palette.primary.main}
                      strokeWidth={3}
                      dot={{ fill: theme.palette.primary.main, r: 5 }}
                      activeDot={{ r: 7 }}
                      name="논문 수"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Typography color="textSecondary" sx={{ textAlign: 'center', py: 10 }}>
                  데이터가 없습니다
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Students by Department */}
        <Box>
          <Card
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                학과별 학생 통계
              </Typography>
              {isLoadingStudents ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                  <CircularProgress />
                </Box>
              ) : studentsData && studentsData.data.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={studentsData.data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis dataKey="department" style={{ fontSize: '0.875rem' }} />
                    <YAxis style={{ fontSize: '0.875rem' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                        fontSize: '0.875rem',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '0.875rem' }} />
                    <Bar dataKey="count" fill={theme.palette.primary.main} name="학생 수" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography color="textSecondary" sx={{ textAlign: 'center', py: 10 }}>
                  데이터가 없습니다
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Activity Feed */}
        <Box>
          <Card
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                최근 활동
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {[
                  { title: '새로운 논문 게재', time: '2시간 전' },
                  { title: '학생 등록 완료', time: '4시간 전' },
                  { title: '예산 보고서 제출', time: '1일 전' },
                  { title: '시스템 업데이트', time: '3일 전' },
                ].map((activity, index) => (
                  <Box
                    key={index}
                    sx={{
                      pb: 1.5,
                      borderBottom:
                        index !== 3 ? `1px solid ${theme.palette.divider}` : 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body1">{activity.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {activity.time}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};
