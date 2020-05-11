import React from 'react';
import { useLoggedApiRequest } from 'base/hooks/request';

import { useHistory } from 'react-router-dom';
import { Form, Input, Button, Select, Card, Typography, Timeline, Table } from 'antd';
import useQuery from 'base/hooks/query-param';
const { Title } = Typography;

const NewMicrofrontend: React.FC<{
  microfrontend: any;
}> = ({ microfrontend }) => {
  const isNew = !microfrontend.id;
  const history = useHistory();

  const [a, syncMicrofrontend] = useLoggedApiRequest(
    {
      url: `/microfrontends/${microfrontend.id}/sync`,
      method: 'POST',
    },
    { manual: true }
  );

  const [{ data: versions = [] }] = useLoggedApiRequest(`/versions?microfrontendId=${microfrontend.id}`);

  const [{ data: result, loading, error }, createmicrofrontend] = useLoggedApiRequest(
    {
      url: `/microfrontends${isNew ? '' : `/${microfrontend.id}`}`,
      method: isNew ? 'POST' : 'PUT',
    },
    { manual: true }
  );

  const applicationId = useQuery().get('applicationId');
  const onFinish = async (values: any) => {
    await createmicrofrontend({
      data: {
        ...values,
        applicationId,
      },
    });
    history.goBack();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const columns = [
    {
      title: 'Created at',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      render: (asd: any) => {
        return (
          <span>
            <Button>Aprove</Button>
          </span>
        );
      },
      //   render: (text, record) => (
      // 	<span>
      // 	  <a style={{ marginRight: 16 }}>Invite {record.name}</a>
      // 	  <a>Delete</a>
      // 	</span>
      //   ),
    },
  ];

  const handleSyncClick = async () => {
    await syncMicrofrontend();
    window.location.reload();
  };

  if (result) return null;

  return (
    <Card title={isNew ? 'Creating' : `Editing ${microfrontend.name}`} style={{ margin: '32px' }}>
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
          <Title>Versions</Title>
          <Table
            columns={columns}
            dataSource={versions.map((v: any) => ({
              ...v,
              key: v.id,
            }))}
          />

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
    </Card>
  );
};

export default NewMicrofrontend;
