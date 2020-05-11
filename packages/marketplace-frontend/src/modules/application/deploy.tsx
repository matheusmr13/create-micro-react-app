import React from 'react';
import { useLoggedApiRequest } from 'base/hooks/request';
import { useParams } from 'react-router-dom';
import Page from 'base/components/page';
import Details from './details';
import { Form, Select, Space, Button } from 'antd';
import FetchApplication from './fetch';

function MicrofrontendVersion(props: { microfrontend: any }) {
  const { microfrontend } = props;
  const [{ data: versions, loading, error }, refetch] = useLoggedApiRequest(
    `/versions?microfrontendId=${microfrontend.id}`
  );

  if (loading) return <span>loading</span>;

  return (
    <Form.Item label={microfrontend.name} name={microfrontend.id} required>
      <Select>
        {versions.map((version: any) => (
          <Select.Option key={version.id} value={version.id}>
            {version.name}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
}

function ApplicationDeploy(props: { application: any }) {
  const { application } = props;

  const [_, deployApplication] = useLoggedApiRequest(
    {
      url: `/applications/${application.id}/deploy`,
      method: 'POST',
    },
    { manual: true }
  );

  const [{ data: microfrontends }] = useLoggedApiRequest(`/microfrontends?applicationId=${application.id}`);

  const onFinish = async (values: any) => {
    console.info(values);
    await deployApplication({
      data: values,
    });
  };

  return (
    <Page title="Deploy">
      <Form labelCol={{ span: 2 }} name="basic" onFinish={onFinish} initialValues={application}>
        {microfrontends &&
          microfrontends.map((micro: any) => <MicrofrontendVersion key={micro.id} microfrontend={micro} />)}
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Deploy
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Page>
  );
}

export default () => (
  <FetchApplication title="Application details">
    {(application: any) => <ApplicationDeploy application={application} />}
  </FetchApplication>
);
