import React from 'react';
import './App.css';
import Application from 'modules/application';
import Microfrontend from 'modules/microfrontend';
import { Menu } from 'antd';
import { GithubFilled, SolutionOutlined, UserOutlined, HomeOutlined, UnorderedListOutlined } from '@ant-design/icons';

import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch, useHistory } from 'react-router-dom';

import Version from 'modules/version';
import Github from 'modules/github';
import Profile from 'modules/account/profile';

function FullApp() {
  const match = useRouteMatch();
  const history = useHistory();

  const items = [
    { label: 'Home', icon: HomeOutlined, url: '/' },
    { label: 'Repositories', icon: GithubFilled, url: '/github' },
    { label: 'Applications', icon: SolutionOutlined, url: '/application' },
    { label: 'Microfrontends', icon: UnorderedListOutlined, url: '/microfrontend' },
    { label: 'Profile', icon: UserOutlined, url: '/profile' },
  ];

  const reverseItems: Array<any> = Object.assign([], items);
  reverseItems.reverse();
  const selectedMenuIndex =
    reverseItems.length -
    reverseItems.findIndex((item) => history.location.pathname.replace(match.path, '').startsWith(item.url)) -
    1;

  return (
    <>
      <Menu style={{ minWidth: 256 }} selectedKeys={[selectedMenuIndex.toString()]} mode={'vertical'} theme={'dark'}>
        {items.map((item, i) => (
          <Menu.Item key={i}>
            <Link to={`${match.path}${item.url}`}>
              <item.icon />
              {item.label}
            </Link>
          </Menu.Item>
        ))}
      </Menu>
      <main className="App__container">
        <Switch>
          <Route exact path={`${match.path}/`}>
            HOME
          </Route>
          <Route path={`${match.path}/application`}>
            <Application />
          </Route>
          <Route path={`${match.path}/microfrontend`}>
            <Microfrontend />
          </Route>
          <Route path={`${match.path}/version`}>
            <Version />
          </Route>
          <Route path={`${match.path}/github`}>
            <Github />
          </Route>
          <Route path={`${match.path}/profile`}>
            <Profile />
          </Route>
        </Switch>
      </main>
    </>
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
