import React, { useEffect } from 'react';
import { Card, Col, Row, Tag, Space } from 'antd';
import { useLoggedApiRequest } from 'base/hooks/request';
import { Link } from 'react-router-dom';
import Section from 'base/components/section';

interface IMicrofrontendListProps {
  applicationId: string;
}

const MicrofrontendList: React.FunctionComponent<IMicrofrontendListProps> = ({ applicationId }) => {
  const [{ data: microfrontends, loading }, refetch] = useLoggedApiRequest(`/microfrontends?applicationId=${applicationId}`);

  useEffect(() => {
    refetch();
  }, [refetch]);
  return (
    <Section title="Microfrontends" loading={loading}>
      <Row gutter={[16, 24]}>
        {microfrontends &&
          microfrontends.map((microfrontend: any) => (
            <Col span={6} key={microfrontend.id}>
              <Card title={microfrontend.name} extra={<Link to={`../microfrontend/${microfrontend.id}`}>Edit</Link>}>
                <Space direction="vertical">
                  <Tag color="blue">package: {microfrontend.packageName}</Tag>
                  <Tag color={microfrontend.type === 'CONTAINER' ? 'red' : 'orange'}>type: {microfrontend.type}</Tag>
                </Space>
              </Card>
            </Col>
          ))}
      </Row>
    </Section>
  );
};

export default MicrofrontendList;
