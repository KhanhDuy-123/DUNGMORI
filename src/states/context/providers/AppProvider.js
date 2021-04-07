import React from 'react';
import { Provider } from 'react-redux';
import Store from 'states/redux/Store';

export const AppContext = React.createContext();

export default class AppProvider extends React.Component {
  static instance;

  constructor() {
    super();
    this.state = {
      itemMenuSelected: 0,
      userData: {}
    };
    AppProvider.instance = this;
  }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        <Provider store={Store}>{this.props.children}</Provider>
      </AppContext.Provider>
    );
  }
}
