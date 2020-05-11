import * as React from 'react';
import { Card, Col, Row, Typography } from 'antd';
import { useLoggedApiRequest } from 'base/hooks/request';
import { Link } from 'react-router-dom';
import Section from 'base/components/section';

interface IMicrofrontendListProps {
  applicationId: string;
}

const MicrofrontendList: React.FunctionComponent<IMicrofrontendListProps> = ({ applicationId }) => {
  const [{ data: microfrontends, loading }] = useLoggedApiRequest(`/microfrontends?applicationId=${applicationId}`);
  return (
    <Section title="Microfrontends" loading={loading}>
      <Row gutter={[16, 24]}>
        {microfrontends &&
          microfrontends.map((microfrontend: any) => (
            <Col span={6} key={microfrontend.id}>
              <Card title={microfrontend.name} extra={<Link to={`../microfrontend/${microfrontend.id}`}>Edit</Link>}>
                {microfrontend.name}
              </Card>
            </Col>
          ))}
      </Row>
    </Section>
  );
};

export default MicrofrontendList;
