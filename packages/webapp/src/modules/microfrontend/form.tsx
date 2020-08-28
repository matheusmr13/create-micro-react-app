import React, { useState, FC } from 'react';
import { useLoggedApiRequest } from 'base/hooks/request';

import { useHistory } from 'react-router-dom';
import { Form, Input, Button, Typography, Timeline, Select, AutoComplete, Switch, Space } from 'antd';
import Page from 'base/components/page';
import useQuery from 'base/hooks/query-param';
const { Title } = Typography;


interface IIntegrationList {
  integrationType: string;
  originId?: string;
}

const IntegrationList: FC<IIntegrationList> = ({ integrationType, originId }) => {
  const [{ data: integrationList, loading: loadingIntegrations }] = useLoggedApiRequest(`/integrations/${integrationType}/origin`);

  if (loadingIntegrations) return null;
  return (
    <Form.Item label="Origin" name="originId">
      <AutoComplete
        options={integrationList.map((integration: string) => ({ value: integration }))}
        defaultValue={originId}
        filterOption={(inputValue, option) =>
          option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
      />
    </Form.Item>
  )
}

interface IApplicationDetailsProps {
  application: any;
}

const NewMicrofrontend: React.FC<{
  microfrontend: any;
}> = ({ microfrontend }) => {
  const [{ data: integrations, loading: loadingIntegrations }] = useLoggedApiRequest('/integrations');
  const isNew = !microfrontend.id;
  const applicationId = useQuery().get('applicationId');
  const history = useHistory();
  const [selectedIntegration, setSelectedIntegration] = useState(microfrontend.integrationType);

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

  const handleFormChange = (values: any) => {
    const { integrationType } = values;
    if (integrationType) setSelectedIntegration(integrationType);
  }

  const onFinish = async (values: any) => {
    await createmicrofrontend({
      data: {
        ...(applicationId && isNew ? { applicationId } : {}),
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
        onValuesChange={handleFormChange}
      >
        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>

        <Form.Item label="Package name" name="packageName">
          <Input />
        </Form.Item>

        <Form.Item label="Project link" name="projectLink">
          <Input />
        </Form.Item>

        <Form.Item label="Type" name="type">
          <Select>
            <Select.Option value="MICROFRONTEND">Microfrontend</Select.Option>
            <Select.Option value="CONTAINER">Container</Select.Option>
          </Select>
        </Form.Item>

        {!loadingIntegrations && (
          <Form.Item label="Integration type" name="integrationType">
            <Select>
              {integrations.map((integration: any) => <Select.Option key={integration.id} value={integration.id}>{integration.id}</Select.Option>)}
            </Select>
          </Form.Item>
        )}

        {
          selectedIntegration && (
            <IntegrationList integrationType={selectedIntegration} originId={microfrontend.originId} />
          )
        }

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            <Button type="ghost" onClick={handleSyncClick}>
              Sync Versions
            </Button>
          </Space>
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
