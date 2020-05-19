import * as React from 'react';

import { Typography, Row, Col, Divider, Spin, PageHeader } from 'antd';
import {
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

import './page.css';

const { Title } = Typography;

export interface IPageProps {
  title: string;
  subTitle?: string;
  children: React.ReactNode;
  actions?: Array<React.ReactNode>;
  loading?: boolean;
  rootPage?: boolean;
}

export default function Page(props: IPageProps) {
  const history = useHistory();
  const { title, children, actions, loading, subTitle, rootPage } = props;

  return (
    <PageHeader
      className="page"
      title={title}
      subTitle={subTitle}
      extra={actions}
      {...(rootPage ? {} : { onBack: () => history.goBack() })}
    >
      <Divider style={{ marginTop: '0px' }} />
      {loading ? (
        <Row justify="center">
          <Spin size="large" />
        </Row>
      ) : (
          children
        )}
    </PageHeader>
  )
}