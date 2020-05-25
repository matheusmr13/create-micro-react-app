import React from 'react';
import { useLoggedApiRequest, useApiAction } from 'base/hooks/request';
import Page from 'base/components/page';
import { Form, Select, Space, Button } from 'antd';
import FetchNamespace from './fetch';

function MicrofrontendVersion(props: { microfrontend: any }) {
  const { microfrontend } = props;
  const [{ data: versions, loading }] = useLoggedApiRequest(
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

function NamespaceDeploy(props: { namespace: any }) {
  const { namespace } = props;

  const [{ data: nextDeploy, loading: loadingNamespace }] = useLoggedApiRequest(`/namespaces/${namespace.id}/deploy/next`);
  const [{ data: microfrontends }] = useLoggedApiRequest(`/microfrontends?applicationId=${namespace.applicationId}`);
  const [{ loading: savingNextDeploy }, saveNextDeploy] = useApiAction(`/namespaces/${namespace.id}/deploy/next`, {
    method: 'PUT',
    message: {
      success: 'Next deploy saved',
    },
  });


  const onFinish = async (versions: any) => {
    await saveNextDeploy({ data: { versions } });
  };

  if (loadingNamespace) return null;

  return (
    <Page title={`Configure next deploy in namespace ${namespace.name}`}>
      <Form name="basic" onFinish={onFinish} initialValues={nextDeploy.versions}>
        {microfrontends && microfrontends.map((micro: any) => <MicrofrontendVersion key={micro.id} microfrontend={micro} />)}
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={savingNextDeploy}>
              Save
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Page>
  );
}

export default () => (
  <FetchNamespace>
    {(namespace: any) => <NamespaceDeploy namespace={namespace} />}
  </FetchNamespace>
);
