import React, { useState } from 'react';
import { useLoggedApiRequest, useGithubApiRequest } from 'base/hooks/request';
import Page from 'base/components/page';
import { Redirect, useParams } from 'react-router-dom';

import { Descriptions, Button, Form, Input, Radio } from 'antd';
import useApiAction from 'base/hooks/api-action';
import useQuery from 'base/hooks/query-param';
import FetchApplication from 'modules/application/fetch';

function ImportRepository(props: { application?: any }) {
  const { application } = props;
  const { owner, repositoryName } = useParams();
  const repositoryFullName = `${owner}/${repositoryName}`;
  const [form] = Form.useForm();
  const [importType, setImportType] = useState('application');

  const onFormChanged = (values: any) => {
    if (values.importType) setImportType(values.importType);
  };

  const shouldShowImportType = !application;
  const shouldShowApplicationIdField = !application && importType === 'application';

  const [{ data: repository, loading: loadingRepository }] = useGithubApiRequest(`/repos/${repositoryFullName}`);

  const [{ data: importedApplication, loading: importingApplication }, importApplication] = useApiAction(
    `/applications/import`,
    {
      message: { success: 'Application imported' },
    }
  );
  const [{ data: importedMicrofrontend, loading: importingMicrofrotend }, importMicrofrontend] = useApiAction(
    `/microfrontends/import`,
    {
      message: { success: 'Mifrofrontend imported' },
    }
  );

  const onFinish = async (values: any) => {
    if (values.importType === 'application') {
      await importApplication({
        data: {
          repositoryName: repositoryFullName,
          packageName: values.packageName,
          name: values.name,
        },
      });
      return;
    }

    await importMicrofrontend({
      data: {
        repositoryName: repositoryFullName,
        applicationId: application?.id || values.applicationId,
        packageName: values.packageName,
        name: values.name,
      },
    });
  };

  if (!importingApplication && importedApplication) {
    return <Redirect to={`../../../application/${importedApplication.id}`} />;
  }
  if (!importingMicrofrotend && importedMicrofrontend) {
    return <Redirect to={`../../../microfrontend/${importedMicrofrontend.id}`} />;
  }
  if (loadingRepository) return <span>loading</span>;

  return (
    <Form
      form={form}
      initialValues={{
        importType,
        name: repository.name,
      }}
      onValuesChange={onFormChanged}
      onFinish={onFinish}
    >
      {application && (
        <Descriptions title="Repository infos">
          <Descriptions.Item label="Application destiny">{application.name}</Descriptions.Item>
        </Descriptions>
      )}

      <Form.Item label="Name" name="name">
        <Input />
      </Form.Item>
      <Form.Item label="Package name" name="packageName">
        <Input />
      </Form.Item>
      {shouldShowImportType && (
        <Form.Item label="Import type" name="importType">
          <Radio.Group value={importType}>
            <Radio.Button value="application">Application</Radio.Button>
            <Radio.Button value="microfrontend">Microfrontend</Radio.Button>
          </Radio.Group>
        </Form.Item>
      )}

      {shouldShowApplicationIdField && (
        <Form.Item label="Application Id" name="applicationId">
          <Input />
        </Form.Item>
      )}

      <div>
        <Button htmlType="submit" type="primary" disabled={importingApplication || importingMicrofrotend}>
          Import
        </Button>
      </div>
    </Form>
  );
}

export default () => {
  const importApplicationId = useQuery().get('applicationId');

  if (!importApplicationId) return <ImportRepository />;

  return (
    <FetchApplication title="Import repository" applicationId={importApplicationId}>
      {(application: any) => <ImportRepository application={application} />}
    </FetchApplication>
  );
};
