import { Card, CardContent } from '../components/ui/card';
import { useGetProjectCountsQuery } from '../queries/projects/projects';
import { useIssuesCountQuery } from '../queries/issues/issues';
import { useGetAuditCountsQuery } from '../queries/audit-trail/audit-trail';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const {
    data: projectCount,
    isLoading: isProjectLoading,
    isError: isProjectError,
    refetch: refetchProjects
  } = useGetProjectCountsQuery();

  const {
    data: issuesCount,
    isLoading: issuesLoading,
    isError: issuesError,
    refetch: refetchIssues,
  } = useIssuesCountQuery();
  const {
    data: auditCount,
    isLoading: auditLoading,
    isError: auditError,
    refetch: refetchAudit,
   } = useGetAuditCountsQuery();

  const stats = [
    {
      label: 'Projects',
      count: projectCount?.count || 0,
      isLoading: isProjectLoading,
      isError: isProjectError,
      refetch: refetchProjects,
      link: '/projects',
    },
    {
      label: 'Issues',
      count: issuesCount?.count || 0,
      isLoading: issuesLoading,
      isError: issuesError,
      refetch: refetchIssues,
      link: '/issues',
    },
    {
      label: 'Audit Trails',
      count: auditCount?.count || 0,
      isLoading: auditLoading,
      isError: auditError,
      refetch: refetchAudit,
      link: '/audit',
    },
  ];

  return (
    <div className='p-4 display-flex'>
      <h2 className='text-2xl font-bold mb-6 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-100 to-blue-300 text-blue-900 shadow'>
        Dashboard
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {stats.map((stat) => (
          <Link to={stat.link} key={stat.label} className='no-underline'>
            <Card
              key={stat.label}
              className={`rounded-2xl shadow-xl p-0 bg-gradient-to-br from-blue-200 to-blue-500 transition-transform transform hover:scale-105`}
              style={{ minHeight: 180 }}
            >
              <CardContent className='flex flex-col items-center justify-center h-full p-6'>
                {stat.isLoading ? (
                  <p className='text-lg text-white'>Loading...</p>
                ) : stat.isError ? (
                  <div className='flex flex-col items-center'>
                    <p className='text-xl font-extrabold text-white drop-shadow-lg mt-2'>
                      Error Fetching Count
                    </p>
                  </div>
                ) : (
                  <div className='flex flex-col items-center'>
                    <h2 className='text-xl font-semibold text-white drop-shadow mb-2'>
                      {stat.label}
                    </h2>
                    <p className='text-5xl font-extrabold text-white drop-shadow-lg mt-2'>
                      {stat.count}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
