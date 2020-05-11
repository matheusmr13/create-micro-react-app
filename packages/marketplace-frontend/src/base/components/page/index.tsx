import * as React from 'react';

import { Typography, Row, Col, Divider, Spin } from 'antd';
const { Title } = Typography;

export interface IPageProps {
  title: string;
  children: React.ReactNode;
  actions?: Array<React.ReactNode>;
  loading?: boolean;
}

export default class Page extends React.Component<IPageProps> {
  public render() {
    const { title, children, actions, loading } = this.props;
    return (
      <article style={{ padding: '36px' }}>
        <section>
          <Row align="middle">
            <Col flex={1}>
              <Title>{title}</Title>
            </Col>
            <Col style={{ textAlign: 'center' }}>{actions}</Col>
          </Row>
        </section>
        <Divider style={{ marginTop: '0px' }} />
        <section className="page__content">
          {loading ? (
            <Row justify="center">
              <Spin size="large" />
            </Row>
          ) : (
            children
          )}
        </section>
      </article>
    );
  }
}
