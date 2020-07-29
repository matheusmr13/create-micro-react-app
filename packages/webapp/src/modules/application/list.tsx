import React, { useEffect } from 'react';
import { useLoggedApiRequest } from 'base/hooks/request';

import { Link } from 'react-router-dom';

import Page from 'base/components/page';
import { List, Button } from 'antd';

function ApplicationList() {
  const [{ data: applications }, refetch] = useLoggedApiRequest('/applications', { manual: true });

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (!applications) return null;
  return (
    <Page
      title="Applications"
      rootPage
      actions={[<Link to="./application/new" key={1}><Button type="primary">New</Button></Link>]}
    >
      <List
        itemLayout="vertical"
        size="large"
        dataSource={applications}
        renderItem={(application: any) => (
          <List.Item
            key={application.id}
            extra={<Link to={`./application/${application.id}`}>Edit</Link>}
          >
            <List.Item.Meta
              title={application.name}
              description={application.description}
            />
          </List.Item>
        )}
      />
    </Page >
  );
}

export default ApplicationList;
