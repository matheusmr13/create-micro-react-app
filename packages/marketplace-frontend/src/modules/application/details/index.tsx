import React from 'react';
import { useLoggedApiRequest } from 'base/hooks/request';

import { Redirect, Link, useParams } from 'react-router-dom';
import { Form, Input, Button, Card, Space } from 'antd';

import Page from 'base/components/page';
import useApiAction from 'base/hooks/api-action';
import MicrofrontendList from './microfrontend-list';
import NamespaceList from './namespace-list';
import FetchApplication from '../fetch';

interface IApplicationDetailsProps {
  application: any;
}

const ApplicationDetails: React.FunctionComponent<IApplicationDetailsProps> = ({ application }) => {
  const [{ data, error, loading: savingProfile }, saveApplication] = useApiAction(`/applications/${application.id}`, {
    method: 'PUT',
    message: {
      success: 'Application saved',
    },
  });
  const [{ loading: deployingApplication }, deployApplication] = useApiAction(`/applications/${application.id}/deploy`, {
    method: 'POST',
    message: {
      success: 'Deploy done',
    },
  });

  const onFinish = async (data: any) => {
    await saveApplication({ data });
  };

  if (!savingProfile && data && !error) return <Redirect to="../application" />;

  return (
    <>
      <Form onFinish={onFinish} initialValues={application}>
        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            <Link to={`../github?applicationId=${application.id}`}>
              <Button type="ghost">New Microfrontend</Button>
            </Link>
            <Link to={`../namespace/new?applicationId=${application.id}`}>
              <Button type="ghost">New Namespace</Button>
            </Link>
            <Button type="ghost" loading={deployingApplication} onClick={() => deployApplication()}>New Deploy</Button>
          </Space>
        </Form.Item>
      </Form>

      <NamespaceList applicationId={application.id} />
      <MicrofrontendList applicationId={application.id} />
    </>
  );
};

export default () => (
  <FetchApplication title="Application details">
    {(application: any) => <ApplicationDetails application={application} />}
  </FetchApplication>
);
