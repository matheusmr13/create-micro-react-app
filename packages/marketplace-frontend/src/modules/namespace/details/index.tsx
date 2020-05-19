import React from 'react';
import { useLoggedApiRequest } from 'base/hooks/request';

import { Redirect, Link, useParams } from 'react-router-dom';
import { Form, Input, Button, Card, Space, Modal, Tooltip } from 'antd';
import {
  ExclamationCircleOutlined
} from '@ant-design/icons';

import useQuery from 'base/hooks/query-param';
import Page from 'base/components/page';
import useApiAction from 'base/hooks/api-action';
import DeployList from './deploy-list';
import FetchNamespace from '../fetch';

const { confirm } = Modal;

interface INamespaceDetailsProps {
  namespace: any;
}

const createDeleteConfirm = (deleteNamespace: Function) => () => {
  confirm({
    title: 'Are you sure delete this namespace?',
    icon: <ExclamationCircleOutlined />,
    content: 'This action cannot be undone',
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    onOk() {
      deleteNamespace();
    }
  });
}

const NamespaceDetails: React.FunctionComponent<INamespaceDetailsProps> = ({ namespace }) => {
  const isNew = !namespace.id;

  const [{ data, error, loading: savingNamespace }, saveNamespace] = useApiAction(`/namespaces${isNew ? '' : `/${namespace.id}`}`, {
    method: isNew ? 'POST' : 'PUT',
    message: {
      success: 'Namespace saved',
    },
  });

  const [{ data: deletedNamespace, error: errorDeleting, loading: deletingNamespace }, deleteNamespace] = useApiAction(`/namespaces/${namespace.id}`, {
    method: 'DELETE',
    message: {
      success: 'Namespace deleted',
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

  const savedSuccessfully = !savingNamespace && data && !error;
  const deletedSuccessfully = !deletingNamespace && deletedNamespace && !errorDeleting;
  if (savedSuccessfully || deletedSuccessfully) return <Redirect to={`../application/${namespace.applicationId}`} />;


  const deleteButton = (
    <Button
      type="dashed"
      onClick={createDeleteConfirm(deleteNamespace)}
      loading={deletingNamespace}
      disabled={namespace.isMain}
    >
      Delete
    </Button>
  );
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
            {
              !isNew && (
                namespace.isMain ? (
                  <Tooltip placement="topLeft" title="Cannot delete main namespace">
                    {deleteButton}
                  </Tooltip>
                ) : deleteButton
              )
            }
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