import * as React from 'react';
import { Card, Col, Row, Typography, Tag } from 'antd';
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
          namespaces.map((namespace: any) => (
            <Col span={6} key={namespace.id}>
              <Card title={namespace.name} extra={<Link to={`../namespace/${namespace.id}`}>Edit</Link>}>
                <Tag color="orange">url: {namespace.path}</Tag>
                {namespace.isMain && <Tag color="purple">main</Tag>}
              </Card>
            </Col>
          ))}
      </Row>
    </Section>
  );
};

export default NamespaceList;
