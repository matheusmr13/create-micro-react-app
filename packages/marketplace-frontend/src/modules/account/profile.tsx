import React from 'react';
import { useLoggedApiRequest } from 'base/hooks/request';
import useApiAction from 'base/hooks/api-action';
import { Link } from 'react-router-dom';
import Page from 'base/components/page';

import { Form, Input, Button, Space, Spin } from 'antd';

function Profiile() {
  const [{ data: profile, loading }] = useLoggedApiRequest('/users/me');

  const [{ loading: savingProfile }, saveProfile] = useApiAction('/users/me', {
    method: 'put',
    message: {
      success: 'User saved',
    },
  });

  const onFinish = async (data: any) => {
    await saveProfile({
      data,
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

            <Form.Item label="Slack Token" name="slackToken">
              <Input />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={savingProfile}>
                  Save
                </Button>
                <Link to="/logout">
                  <Button type="ghost">Logout</Button>
                </Link>
              </Space>
            </Form.Item>
          </Form>
        )}
    </Page>
  );
}

export default Profiile;
