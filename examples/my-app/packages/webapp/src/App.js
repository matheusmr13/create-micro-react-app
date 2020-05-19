import { withMicrofrontend, TYPE } from 'react-microfrontend';

import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import './App.css';

const App = ({ microfrontendsList }) => {
  console.info(microfrontendsList);
  return (
    <Router>
      <div className="App">
        <section className="App__side-bar">
          <div className="App__restaurant-profile">My Restaurant</div>
          <nav className="App__nav-bar">
            {microfrontendsList.map((microfrontend) => (
              <Link
                to={microfrontend.definition.url}
                key={microfrontend.packageName}
                className={`App__menu-item`} //${microfrontend === selectedMicrofrontendKey ? ' App__menu-item--selected' : ''}`}
              >
                {microfrontend.definition.label}
              </Link>
            ))}
          </nav>
        </section>
        <section className="App__content">
          <Switch>
            {microfrontendsList.map((micro) => (
              <Route path={micro.definition.url} component={micro.view} key={micro.packageName} />
            ))}
          </Switch>
        </section>
      </div>
    </Router>
  );
};
export default withMicrofrontend(App, { filterByType: TYPE.ROUTING });
