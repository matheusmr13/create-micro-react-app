import React from 'react';
import { useLoggedApiRequest } from 'base/hooks/request';

import { useLocation, useHistory } from 'react-router-dom';
import { Form, Input, Button, Card } from 'antd';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const NewVersion: React.FC<{
  version: any;
}> = ({ version }) => {
  const isNew = !version.id;
  const history = useHistory();
  const [{ data: result, loading, error }, createVersion] = useLoggedApiRequest(
    {
      url: `/versions${isNew ? '' : `/${version.id}`}`,
      method: isNew ? 'POST' : 'PUT',
    },
    { manual: true }
  );

  const [_, approveVersion] = useLoggedApiRequest(
    {
      url: `/versions/${version.id}/approve`,
      method: 'PUT',
    },
    { manual: true }
  );

  const microfrontendId = useQuery().get('microfrontendId');

  const onFinish = async (values: any) => {
    const { files, ...rest } = values;
    const { jsFiles, cssFiles } = files.reduce(
      (agg: any, file: string) => {
        if (file.endsWith('.css')) agg.cssFiles.push(file);
        if (file.endsWith('.js')) agg.jsFiles.push(file);
        return agg;
      },
      { jsFiles: [], cssFiles: [] }
    );
    await createVersion({
      data: {
        ...rest,
        files: {
          js: jsFiles,
          css: cssFiles,
        },
        microfrontendId,
      },
    });
    history.goBack();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const handleApprove = async () => {
    await approveVersion();
  };

  if (result) return null;

  return (
    <Card title={isNew ? 'Creating' : `Editing ${version.name}`} style={{ margin: '32px' }}>
      <Form labelCol={{ span: 2 }} name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Your version name.' }]}>
          <Input />
        </Form.Item>

        {version.status}

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          {version.status === 'NEEDS_APROVAL' && (
            <Button type="default" onClick={handleApprove}>
              Approve
            </Button>
          )}
        </Form.Item>
      </Form>
    </Card>
  );
};

export default NewVersion;
