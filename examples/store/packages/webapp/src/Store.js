import { withMicrofrontend, TYPE } from 'react-microfrontend';

import React, { useState } from 'react';
import DesignSystem from 'design-system';
import './Store.css';

const Highlight = ({ children, name, enabled, backgroundColor }) => {
  if (!enabled) return children;

  return (
    <div className="Hightlight">
      <div style={{ backgroundColor }} className="Hightlight__overlay" />
      <div className="Hightlight__text">{name}</div>
      {children}
    </div>
  );
};

const Container = ({ microfrontends, overrideContent, showMicrofrontends }) => {
  const [selected, setSelected] = useState('showcase');
  const ComponentToRender = microfrontends[selected].view;

  const props = {
    promotion: {
      onPromotionSelected: () => setSelected('showcase'),
      backgroundColor: 'purple',
    },
    showcase: {
      backgroundColor: 'blue',
    },
  }[selected];

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
      <main>
        {overrideContent || (
          <Highlight
            enabled={showMicrofrontends}
            name={selected}
            backgroundColor={props.backgroundColor}
            enabled={showMicrofrontends}
          >
            <ComponentToRender {...props} />
          </Highlight>
        )}
      </main>
    </div>
  );
};

const ConnectedContainer = withMicrofrontend(Container);

const Store = ({ microfrontend: cart }) => {
  const [showCart, setShouldShowCart] = useState(false);
  const [showMicrofrontends, setShowMicrofrontends] = useState(false);
  console.info(DesignSystem.getComponents());
  const { Button } = DesignSystem.getComponents();
  const { CartWidget, CartScreen } = cart.view;

  return (
    <div className="Store">
      <div className="Store__container">
        <header className="Store__header">
          <div className="Store__top">
            <h1 className="Store__title">
              Microfrontend Store{' '}
              <Button onClick={() => setShowMicrofrontends(!showMicrofrontends)}>Show microfrontends</Button>
            </h1>
            <div className="Store__cart">
              <Highlight enabled={showMicrofrontends} name="Cart" backgroundColor="yellow">
                <CartWidget onClick={() => setShouldShowCart(!showCart)} />
              </Highlight>
            </div>
          </div>
        </header>
        <ConnectedContainer
          showMicrofrontends={showMicrofrontends}
          overrideContent={
            showCart && (
              <Highlight enabled={showMicrofrontends} name="Cart" backgroundColor="yellow">
                <CartScreen onBack={() => setShouldShowCart(false)} />
              </Highlight>
            )
          }
        />
      </div>
    </div>
  );
};
export default withMicrofrontend(Store, { microfrontendKey: 'cart' });
