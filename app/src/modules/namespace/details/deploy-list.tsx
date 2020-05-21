import * as React from 'react';
import { Card, Col, Row, Typography, Timeline } from 'antd';
import { useLoggedApiRequest, useApiAction } from 'base/hooks/request';
import { Link } from 'react-router-dom';
import Section from 'base/components/section';

interface IDeployListProps {
  namespaceId: string;
}

const STATUS_COLOR = {

};
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
