import * as React from 'react';
import { Card, Col, Row, Typography } from 'antd';
import { useLoggedApiRequest } from 'base/hooks/request';
import { Link } from 'react-router-dom';
import Section from 'base/components/section';

interface INamespaceListProps {
  applicationId: string;
}

const NamespaceList: React.FunctionComponent<INamespaceListProps> = ({ applicationId }) => {
  const [{ data: namespaces, loading }] = useLoggedApiRequest(`/namespaces?applicationId=${applicationId}`);
  return (
    <Section title="Namespaces" loading={loading}>
      <Row gutter={[16, 24]}>
        {namespaces &&
          namespaces.map((microfrontend: any) => (
            <Col span={6} key={microfrontend.id}>
              <Card title={microfrontend.name} extra={<Link to={`../namespace/${microfrontend.id}`}>Edit</Link>}>
                {microfrontend.name}
              </Card>
            </Col>
          ))}
      </Row>
    </Section>
  );
};

export default NamespaceList;
