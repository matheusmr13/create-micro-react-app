import React, { useState } from 'react';
import './App.css';
import Application from 'modules/application';
import Microfrontend from 'modules/microfrontend';
import { Layout, Menu, Avatar, Dropdown, Space } from 'antd';
import { GithubFilled, SolutionOutlined, HomeOutlined, UnorderedListOutlined, MenuUnfoldOutlined, MenuFoldOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import { Switch, Route, Link, useRouteMatch, useHistory } from 'react-router-dom';

import Github from 'modules/github';
import Profile from 'modules/account/profile';
import Namespace from 'modules/namespace';
import Dashboards from './dashboards';

import firebase from 'modules/account/firebase';

import Logo from 'assets/logo.svg';

const { Sider, Header, Content, Footer } = Layout;

function hashCode(str: string) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToRGB(i: number) {
  var c = (i & 0x00FFFFFF)
    .toString(16)
    .toUpperCase();

  return `#${"00000".substring(0, 6 - c.length) + c}`;
}


const items = [
  { label: 'Home', icon: HomeOutlined, rootComponent: Dashboards, url: '' },
  { rootComponent: Github, url: 'github' },
  { label: 'Applications', icon: SolutionOutlined, rootComponent: Application, url: 'application' },
  { label: 'Microfrontends', icon: UnorderedListOutlined, rootComponent: Microfrontend, url: 'microfrontend' },
  { rootComponent: Profile, url: 'profile' },
  { rootComponent: Namespace, url: 'namespace' },
];

const reverseItems: Array<any> = Object.assign([], items);
reverseItems.reverse();
const menuItems = reverseItems.filter((item) => item.label && item.icon)


function FullApp() {
  const match = useRouteMatch();
  const history = useHistory();
  const { displayName: name = '' } = firebase.auth().currentUser!;
  const [collapsed, setCollapsed] = useState(false);

  const selectedMenuIndex =
    menuItems.length -
    menuItems
      .findIndex((item) => history.location.pathname.replace(match.path, '').startsWith(item.url)) -
    1;

  const iconProps = {
    className: 'App__menu-collapser',
    onClick: () => setCollapsed(!collapsed),
  }

  return (
    <Layout>
      <Sider
        collapsible
        trigger={null}
        collapsed={collapsed}
      >
        <Link to={`${match.path}/`}>
          <div className="App__logo-name">
            <img src={Logo} className="App__logo" alt="logo" />
            <span className="App__label">CMRA</span>
          </div>
        </Link>
        <Menu selectedKeys={[selectedMenuIndex.toString()]} theme="dark" mode="inline">
          {items
            .filter((item) => item.label && item.icon)
            .map((item, i) => (
              <Menu.Item key={i} icon={item.icon && <item.icon />}>
                <Link to={`${match.path}${item.url}`}>
                  {item.label}
                </Link>
              </Menu.Item>
            ))
          }
        </Menu>
      </Sider>
      <Layout>
        <Header className="App__header">
          {collapsed ? <MenuUnfoldOutlined {...iconProps} /> : <MenuFoldOutlined {...iconProps} />}
          <div className="App__header-actions">
            <Space>
              <a href="https://matheusmr13.github.io/create-micro-react-app/docs/" style={{ display: 'flex', alignItems: 'center' }}><QuestionCircleOutlined style={{ fontSize: '24px' }} /></a>
              <Dropdown overlay={(
                <Menu style={{ marginTop: '8px' }}>
                  <Menu.Item key="0">
                    <Link to={`${match.path}profile`}>Profile</Link>
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item onClick={() => firebase.auth().signOut()}>Logout</Menu.Item>
                </Menu>
              )} trigger={['click']}>
                <Avatar className="App__header-avatar" style={{ backgroundColor: intToRGB(hashCode(name!)) }} alt="avatar">{name!.split(' ').map((name: string) => name.charAt(0)).join('')}</Avatar>
              </Dropdown>
            </Space>
          </div>
        </Header>
        <Content style={{ padding: '18px' }}>
          <Switch>
            {reverseItems.map(({ url, rootComponent: RootComponent }, i) => (
              <Route key={i} path={`${match.path}${url}`}>
                <RootComponent />
              </Route>
            ))}
          </Switch>
        </Content>
        <Footer style={{ textAlign: 'center' }}><a href="https://matheusmr13.github.io/create-micro-react-app/docs/">Create Micro React App</a></Footer>
      </Layout>
    </Layout>
  );
}

function App() {
  return (
    <div className="App">
      <FullApp />
    </div>
  );
}

export default App;
