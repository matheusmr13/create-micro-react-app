import React, { useEffect, FC, useState } from 'react';
import { useLoggedApiRequest } from 'base/hooks/request';

import { Redirect, Link } from 'react-router-dom';
import { Form, Input, Button, Space, Select, AutoComplete } from 'antd';

import useApiAction from 'base/hooks/api-action';
import MicrofrontendList from './microfrontend-list';
import NamespaceList from './namespace-list';
import FetchApplication from '../fetch';


interface IIntegrationList {
  integrationType: string;
  destinationId: string;
}

const IntegrationList: FC<IIntegrationList> = ({ integrationType, destinationId }) => {
  const [{ data: integrationList, loading: loadingIntegrations }] = useLoggedApiRequest(`/integrations/${integrationType}/destination`);

  if (loadingIntegrations) return null;
  return (
    <Form.Item label="Destination" name="destinationId">
      <AutoComplete
        options={integrationList.map((integration: string) => ({ value: integration }))}
        defaultValue={destinationId}
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

const ApplicationDetails: React.FunctionComponent<IApplicationDetailsProps> = ({ application }) => {
  const [selectedIntegration, setSelectedIntegration] = useState(application.integrationType);
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
  const [{ data: namespaces, loading: gettingNamespaces }, refetchNamespaces] = useLoggedApiRequest(`/namespaces?applicationId=${application.id}`);
  const [{ data: integrations, loading: loadingIntegrations }] = useLoggedApiRequest('/integrations');

  const handleFormChange = (values: any) => {
    const { integrationType } = values;
    if (integrationType) setSelectedIntegration(integrationType);
  }
  useEffect(() => {
    refetchNamespaces();
  }, [refetchNamespaces]);

  const onFinish = async (data: any) => {
    await saveApplication({ data });
  };

  if (gettingNamespaces || !namespaces) return null;

  if (!savingProfile && data && !error) return <Redirect to="../application" />;

  return (
    <>
      <Form onFinish={onFinish} initialValues={application} onValuesChange={handleFormChange}>
        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>

        <Form.Item label="Slack Channel Id" name="slackChannelId">
          <Input />
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
            <IntegrationList integrationType={selectedIntegration} destinationId={application.destinationId} />
          )
        }
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            <Link to={`../microfrontend/new?applicationId=${application.id}`}>
              <Button type="ghost">New Microfrontend</Button>
            </Link>
            <Link to={`../namespace/new?applicationId=${application.id}`}>
              <Button type="ghost">New Namespace</Button>
            </Link>
            {namespaces.length === 1 ? (
              <Link to={`../namespace/${namespaces[0].id}/deploy/next`}>
                <Button type="ghost">Prepare next deploy</Button>
              </Link>
            ) : null
            }
            <Button type="ghost" loading={deployingApplication} onClick={() => deployApplication()}>Deploy</Button>
          </Space>
        </Form.Item>
      </Form>

      {namespaces.length > 1 && <NamespaceList namespaces={namespaces} />}
      <MicrofrontendList applicationId={application.id} />
    </>
  );
};

export default () => (
  <FetchApplication title="Application details">
    {(application: any) => <ApplicationDetails application={application} />}
  </FetchApplication>
);
