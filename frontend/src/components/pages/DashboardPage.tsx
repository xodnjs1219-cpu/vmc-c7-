import {
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Article as ArticleIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  EventNote as EventNoteIcon,
} from '@mui/icons-material';
import { useCurrentUser } from '@/hooks/queries/useAuth';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for charts
const performanceData = [
  { month: '1월', value: 65 },
  { month: '2월', value: 78 },
  { month: '3월', value: 72 },
  { month: '4월', value: 85 },
  { month: '5월', value: 90 },
  { month: '6월', value: 88 },
];

const departmentData = [
  { name: '공학대학', students: 450, papers: 28 },
  { name: '자연과학대학', students: 380, papers: 24 },
  { name: '인문대학', students: 320, papers: 18 },
  { name: '상경대학', students: 400, papers: 22 },
];

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

  const metrics = [
    {
      title: '총 실적',
      value: '245',
      icon: <TrendingUpIcon sx={{ fontSize: 28 }} />,
      color: theme.palette.primary.main,
      trend: 12,
    },
    {
      title: '게재된 논문',
      value: '92',
      icon: <ArticleIcon sx={{ fontSize: 28 }} />,
      color: theme.palette.secondary.main,
      trend: 8,
    },
    {
      title: '등록 학생',
      value: '1,540',
      icon: <PeopleIcon sx={{ fontSize: 28 }} />,
      color: theme.palette.success.main,
      trend: 5,
    },
    {
      title: '예산 집행',
      value: '$485K',
      icon: <AttachMoneyIcon sx={{ fontSize: 28 }} />,
      color: theme.palette.warning.main,
      trend: 15,
    },
  ];

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
          대시보드
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
          <Chip
            icon={<EventNoteIcon />}
            label="2024년"
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
        {/* Performance Trend */}
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
                실적 추이
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={performanceData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="month" style={{ fontSize: '0.875rem' }} />
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
                    dataKey="value"
                    stroke={theme.palette.primary.main}
                    strokeWidth={3}
                    dot={{ fill: theme.palette.primary.main, r: 5 }}
                    activeDot={{ r: 7 }}
                    name="실적"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Department Stats */}
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
                학과별 통계
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={departmentData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="name" style={{ fontSize: '0.875rem' }} />
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
                  <Bar dataKey="students" fill={theme.palette.primary.main} name="학생" />
                  <Bar dataKey="papers" fill={theme.palette.secondary.main} name="논문" />
                </BarChart>
              </ResponsiveContainer>
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
