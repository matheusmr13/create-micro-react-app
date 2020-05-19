import React from 'react';
import { useLoggedApiRequest } from 'base/hooks/request';

import { Redirect, Link, useParams } from 'react-router-dom';
import { Form, Input, Button, Card, Space } from 'antd';

import useQuery from 'base/hooks/query-param';
import Page from 'base/components/page';
import useApiAction from 'base/hooks/api-action';
import DeployList from './deploy-list';
import FetchNamespace from '../fetch';

interface INamespaceDetailsProps {
  namespace: any;
}

const NamespaceDetails: React.FunctionComponent<INamespaceDetailsProps> = ({ namespace }) => {
  const isNew = !namespace.id;

  const [{ data, error, loading: savingNamespace }, saveNamespace] = useApiAction(`/namespaces${isNew ? '' : `/${namespace.id}`}`, {
    method: isNew ? 'POST' : 'PUT',
    message: {
      success: 'Namespace saved',
    },
  });

  const onFinish = async (namespaceFields: any) => {
    await saveNamespace({
      ...namespace, data: {
        ...namespace,
        ...namespaceFields
      }
    });
  };

  if (!savingNamespace && data && !error) return <Redirect to={`../application/${namespace.applicationId}`} />;

  return (
    <>
      <Form onFinish={onFinish} initialValues={namespace}>
        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>

        <Form.Item label="Url path" name="path">
          <Input />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            {!isNew && (
              <Link to={`./${namespace.id}/deploy/next`}>
                <Button type="ghost">Update next deploy</Button>
              </Link>
            )}
          </Space>
        </Form.Item>

        {!isNew && <DeployList namespaceId={namespace.id} />}
      </Form>
    </>
  );
};

export const Details = () => (
  <FetchNamespace title="Namespace details">
    {(namespace: any) => <NamespaceDetails namespace={namespace} />}
  </FetchNamespace>
);

export const New = () => {
  const applicationId = useQuery().get('applicationId');

  return (
    <Page title="New namespace">
      <NamespaceDetails namespace={{ applicationId }} />
    </Page>
  );
};