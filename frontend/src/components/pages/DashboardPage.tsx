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
  useStudentsData,
  useResearchData,
  useKPIData
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
  const { data: researchData, isLoading: isLoadingResearch } = useResearchData({});
  const { data: kpiData, isLoading: isLoadingKPI } = useKPIData({});

  const metrics = [
    {
      title: '재학생 수',
      value: isLoadingSummary ? '-' : (summaryData?.summary?.total_students || 0).toLocaleString(),
      icon: <PeopleIcon sx={{ fontSize: 28 }} />,
      color: theme.palette.primary.main,
      trend: undefined,
    },
    {
      title: '게재 논문 수',
      value: isLoadingSummary ? '-' : (summaryData?.summary?.total_publications || 0).toString(),
      icon: <ArticleIcon sx={{ fontSize: 28 }} />,
      color: theme.palette.success.main,
      trend: undefined,
    },
    {
      title: '연구 프로젝트',
      value: isLoadingSummary ? '-' : (summaryData?.summary?.total_research_projects || 0).toString(),
      icon: <TrendingUpIcon sx={{ fontSize: 28 }} />,
      color: theme.palette.secondary.main,
      trend: undefined,
    },
    {
      title: '총 연구비 (억원)',
      value: isLoadingSummary ? '-' : `${((summaryData?.summary?.total_research_budget || 0) / 100000000).toFixed(1)}`,
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
                연도별 논문 게재 추이
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
                학과별 재학생 현황
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

        {/* Research Budget by Department */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
          <Card
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                학과별 연구비 현황
              </Typography>
              {isLoadingResearch ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                  <CircularProgress />
                </Box>
              ) : researchData && researchData.data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={
                      // 학과별 연구비 합계 계산
                      Object.values(
                        researchData.data.reduce((acc: any, item: any) => {
                          const dept = item.소속학과 || item.department || '기타';
                          const budget = item.총연구비 || 0;
                          if (!acc[dept]) {
                            acc[dept] = { department: dept, budget: 0 };
                          }
                          acc[dept].budget += budget / 100000000; // 억원 단위
                          return acc;
                        }, {})
                      ).map((item: any) => ({
                        ...item,
                        budget: Number(item.budget.toFixed(1))
                      }))
                    }
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis dataKey="department" style={{ fontSize: '0.75rem' }} />
                    <YAxis style={{ fontSize: '0.75rem' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                        fontSize: '0.875rem',
                      }}
                      formatter={(value: number) => [`${value}억원`, '연구비']}
                    />
                    <Bar dataKey="budget" fill={theme.palette.warning.main} name="연구비 (억원)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography color="textSecondary" sx={{ textAlign: 'center', py: 10 }}>
                  데이터가 없습니다
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* KPI by College */}
          <Card
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                단과대학별 평균 취업률
              </Typography>
              {isLoadingKPI ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                  <CircularProgress />
                </Box>
              ) : kpiData && kpiData.data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={
                      // 단과대학별 평균 취업률 계산
                      Object.values(
                        kpiData.data.reduce((acc: any, item: any) => {
                          const college = item.college || '기타';
                          const rate = item['졸업생 취업률 (%)'] || 0;
                          if (!acc[college]) {
                            acc[college] = { college, total: 0, count: 0 };
                          }
                          acc[college].total += rate;
                          acc[college].count += 1;
                          return acc;
                        }, {})
                      ).map((item: any) => ({
                        college: item.college,
                        rate: Number((item.total / item.count).toFixed(1))
                      }))
                    }
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis dataKey="college" style={{ fontSize: '0.75rem' }} />
                    <YAxis style={{ fontSize: '0.75rem' }} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                        fontSize: '0.875rem',
                      }}
                      formatter={(value: number) => [`${value}%`, '평균 취업률']}
                    />
                    <Bar dataKey="rate" fill={theme.palette.success.main} name="취업률 (%)" />
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
      </Box>
    </Box>
  );
};
