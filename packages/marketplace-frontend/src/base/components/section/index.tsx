import * as React from 'react';

import { Typography, Row, Spin } from 'antd';
const { Title } = Typography;

export interface ISectionProps {
  title: string;
  children: React.ReactNode;
  loading: Boolean;
}

export default class Section extends React.Component<ISectionProps> {
  public render() {
    const { title, children, loading } = this.props;
    return (
      <section>
        <Title level={2}>{title}</Title>
        {loading ? (
          <Row justify="center">
            <Spin size="large" />
          </Row>
        ) : (
          children
        )}
      </section>
    );
  }
}
