import React from 'react';

import { Redirect } from 'react-router-dom';
import { Form, Input, Button } from 'antd';

import useApiAction from 'base/hooks/api-action';
import Page from 'base/components/page';

const ApplicationDetails: React.FunctionComponent = () => {
  const [{ data, error, loading: creatingApplication }, createApplication] = useApiAction('/applications', {
    method: 'POST',
    message: {
      success: 'Application created!',
    },
  });

  const onFinish = async (data: any) => {
    await createApplication({ data });
  };

  if (creatingApplication) return null;

  if (!creatingApplication && data && !error) return <Redirect to={`../application/${data.id}`} />;

  return (
    <Page title="Create application">
      <Form onFinish={onFinish}>
        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>

        <Form.Item label="Container's package name" name="packageName">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
    </Page>
  );
};

export default ApplicationDetails;
