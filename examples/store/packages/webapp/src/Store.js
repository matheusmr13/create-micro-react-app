import { withMicrofrontend, TYPE } from 'react-microfrontend';

import React, { useState } from 'react';
import './Store.css';

const Container = ({ microfrontends, overrideContent }) => {
  const [selected, setSelected] = useState('showcase');
  const ComponentToRender = microfrontends[selected].view;

  return (
    <div className="Store__content">
      <nav className="Store__nav">
        <button className="Store__nav-item" onClick={() => setSelected('showcase')}>
          Showcase
        </button>
        <button className="Store__nav-item" onClick={() => setSelected('promotion')}>
          Promotion
        </button>
      </nav>
      <main>{overrideContent || <ComponentToRender />}</main>
    </div>
  );
};

const ConnectedContainer = withMicrofrontend(Container);

const Store = ({ microfrontend: cart }) => {
  const [showCart, setShouldShowCart] = useState(false);
  const { CartWidget, CartScreen } = cart.view;

  return (
    <div className="Store">
      <div className="Store__container">
        <header className="Store__header">
          <div className="Store__top">
            <h1 className="Store__title">Microfrontend Store</h1>
            <div className="Store__cart">
              <CartWidget onClick={() => setShouldShowCart(!showCart)} />
            </div>
          </div>
        </header>
        <ConnectedContainer overrideContent={showCart && <CartScreen onBack={() => setShouldShowCart(false)} />} />
      </div>
    </div>
  );
};
export default withMicrofrontend(Store, { microfrontendKey: 'cart' });
