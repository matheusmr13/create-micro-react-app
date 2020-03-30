import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Api from "../api";

class App  extends React.Component<{
  microfrontends: Array<Api>
}> {
  render() {
    const { microfrontends} = this.props;
    console.info(microfrontends);
    return (
      <Router>
        <Switch>
          {microfrontends.map(micro => (
            <Route path={micro.definition.url} component={micro.view} />
          ))}
        </Switch>
      </Router>
    );
  }
}

export default App;
