import React from 'react';
import { useLoggedApiRequest } from 'base/hooks/request';

import { useHistory } from 'react-router-dom';
import { Form, Input, Button, Typography, Timeline } from 'antd';
import Page from 'base/components/page';
const { Title } = Typography;

const NewMicrofrontend: React.FC<{
  microfrontend: any;
}> = ({ microfrontend }) => {
  const isNew = !microfrontend.id;
  const history = useHistory();

  const [, syncMicrofrontend] = useLoggedApiRequest(
    {
      url: `/microfrontends/${microfrontend.id}/sync`,
      method: 'POST',
    },
    { manual: true }
  );

  const [{ data: versions = [] }] = useLoggedApiRequest(`/versions?microfrontendId=${microfrontend.id}`);

  const [{ data: result }, createmicrofrontend] = useLoggedApiRequest(
    {
      url: `/microfrontends${isNew ? '' : `/${microfrontend.id}`}`,
      method: isNew ? 'POST' : 'PUT',
    },
    { manual: true }
  );

  const onFinish = async (values: any) => {
    await createmicrofrontend({
      data: {
        ...values
      },
    });
    history.goBack();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const handleSyncClick = async () => {
    await syncMicrofrontend();
    window.location.reload();
  };

  if (result) return null;

  return (
    <Page title={isNew ? 'Creating' : `Editing ${microfrontend.name}`}>
      <Form
        labelCol={{ span: 2 }}
        name="basic"
        initialValues={microfrontend}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>

        <Form.Item label="Package name" name="packageName">
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button type="ghost" onClick={handleSyncClick}>
            Sync Versions
          </Button>
        </Form.Item>
      </Form>

      {isNew ? null : (
        <>
          <Title>History</Title>
          <Timeline>
            {versions.map((version: any) => (
              <Timeline.Item key={version.id} color="green">
                Version {version.name} created at {version.createdAt}
              </Timeline.Item>
            ))}
          </Timeline>
        </>
      )}
    </Page>
  );
};

export default NewMicrofrontend;
