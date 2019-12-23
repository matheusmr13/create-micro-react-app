import React from 'react';
import logo from './logo.svg';
import './App.css';
import { withMicrofrontend } from 'react-microfrontend';
import Home from './home';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

const App: React.FC<{
  microfrontend: any
}> = (props) => {
  console.info(props.microfrontend);
  const CartView: any = props.microfrontend;

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/cart">Carrinho</Link>
            </li>
          </ul>
        </nav>
        <div>
          {CartView.Widget && <CartView.Widget />}
        </div>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/cart">
            {/* <CartView /> */}
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default withMicrofrontend(App, { microfrontendKey: '@market/cart' });
