import * as React from 'react';
import { Timeline } from 'antd';
import { useLoggedApiRequest } from 'base/hooks/request';
import Section from 'base/components/section';

interface IDeployListProps {
  namespaceId: string;
}

const DeployList: React.FunctionComponent<IDeployListProps> = ({ namespaceId }) => {
  const [{ data: history, loading }] = useLoggedApiRequest(`/namespaces/${namespaceId}/history`);

  return (
    <Section title="Deploys" loading={loading}>
      <Timeline>
        {history &&
          history.deploys.map((deploy: any) => (
            <Timeline.Item color="green">
              Deploy {deploy.id} created at {deploy.createdAt}
            </Timeline.Item>
          ))}
      </Timeline>
    </Section>
  );
};

export default DeployList;
