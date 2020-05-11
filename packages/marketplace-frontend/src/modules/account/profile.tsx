import React from 'react';
import { useLoggedApiRequest } from 'base/hooks/request';
import useApiAction from 'base/hooks/api-action';
import { Link } from 'react-router-dom';
import Page from 'base/components/page';

import { Form, Input, Button, Space, Spin } from 'antd';

function Profiile() {
  const [{ data: profile, loading, error }, refetch] = useLoggedApiRequest('/users/me');

  const [{ loading: savingProfile }, saveProfile] = useApiAction('/users/me', {
    method: 'put',
    message: {
      success: 'User saved',
    },
  });

  const onFinish = async (fields: any) => {
    await saveProfile({
      data: {
        githubToken: fields.githubToken,
      },
    });
  };

  return (
    <Page title="Profile">
      {loading ? (
        <Spin size="large" />
      ) : (
        <Form name="basic" initialValues={profile} onFinish={onFinish}>
          <Form.Item label="Github Token" name="githubToken">
            <Input />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={savingProfile}>
                Save
              </Button>
              <Link to="/logout">
                <Button type="danger">Logout</Button>
              </Link>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Page>
  );
}

export default Profiile;
