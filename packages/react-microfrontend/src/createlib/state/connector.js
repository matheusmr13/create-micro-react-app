import React from 'react';
import Shared from './../shared';

const sharedState = new Shared('__state__');

const connector = (Component, packageName, name) => {
    const mapStateToProps = (state) => ({
      [name]: state[packageName][name]
    });
    const mapDispatchToProps = {};

    return class MyComponent extends React.Component {
      state = {
        Component: null
      }

      componentDidMount() {
        const connect = sharedState.get('connector');
        this.setState({
          Component: connect(
            mapStateToProps,
            mapDispatchToProps
          )(Component)
        })
      }

      render() {
        const { Component } = this.state;
        if (!Component) return null;
        return <Component {...this.props} />;
      }
    }
}

export const dispatcher = (action, payload) => {
  const store = sharedState.get('store');
  if (!store) return; // TODO: check cases where store will not exists

  store.dispatch({ type: action, payload });
}
export default connector;
