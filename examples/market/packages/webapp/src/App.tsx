import React from 'react';
import logo from './logo.svg';
import './App.css';
import { withMicrofrontend } from 'react-microfrontend';
import Home from './home';
import CartApi from '@market/cart';
import QuickCartApi from '@market/quick-cart';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

const App: React.FC<{
  microfrontends: any
}> = (props) => {
  const CartView: any = props.microfrontends[CartApi.getPackageName()].view;
  const QuickCartView: any = props.microfrontends[QuickCartApi.getPackageName()].view;

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

        <div>
          {QuickCartView.QuickCart && <QuickCartView.QuickCart />}
        </div>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/cart">
          { CartView.Cart && <CartView.Cart /> }
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default withMicrofrontend(App);
