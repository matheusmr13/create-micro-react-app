import * as React from 'react';
import { Card, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import Section from 'base/components/section';

interface INamespaceListProps {
  namespaces: any[];
}

const NamespaceList: React.FunctionComponent<INamespaceListProps> = ({ namespaces }) => {
  return (
    <Section title="Namespaces">
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
