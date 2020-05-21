import { Provider } from 'react-redux';
import React, { Component } from 'react';
import createStore from './redux';
import Api from '..';

class ApiProvider extends Component<{
  microfrontends: { [key: string]: Api; }
}> {
  state = {
    store: null
  }

  componentDidMount() {
    const { microfrontends } = this.props;
    const store = createStore();

    Object.values(microfrontends).forEach(microfrontend => {
      store.injectReducer(microfrontend.getName(), microfrontend.getReducers(), microfrontend.getInitialState());
    });

    this.setState({ store });
  }

  render() {
    const { store } = this.state;
    if (!store) return null;

    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default ApiProvider;
