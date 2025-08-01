import { Card, CardContent } from '../components/ui/card';
import { useGetProjectCountsQuery } from '../queries/projects/projects';
import { useIssuesCountQuery } from '../queries/issues/issues';
import { useGetAuditCountsQuery } from '../queries/audit-trail/audit-trail';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { data: projectCount } = useGetProjectCountsQuery();
  const { data: issuesCount } = useIssuesCountQuery();
  const { data: auditCount } = useGetAuditCountsQuery();

  const stats = [
    {
      label: 'Projects',
      count: projectCount?.count || 0,
      link: '/projects',
    },
    {
      label: 'Issues',
      count: issuesCount?.count || 0,
      link: '/issues',
    },
    {
      label: 'Audit Trails',
      count: auditCount?.count || 0,
      link: '/audit',
    },
  ];

  return (
    <div className='h-screen bg-gray-100 p-8 display-flex'>
      <h2 className='text-3xl font-bold mb-8'>Dashboard</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {stats.map((stat) => (
          <Link to={stat.link} key={stat.label} className='no-underline'>
            <Card key={stat.label} className='rounded-2xl shadow-lg p-4'>
              <CardContent>
                <h2 className='text-xl font-semibold text-gray-700'>
                  {stat.label}
                </h2>
                <p className='text-4xl font-bold text-primary mt-4'>
                  {stat.count}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
