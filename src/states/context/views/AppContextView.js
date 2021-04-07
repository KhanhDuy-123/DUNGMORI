import { AppContext } from 'states/context/providers/AppProvider';
import { Component } from 'react';

export default class AppContextView extends Component {
  static contextType = AppContext;
  render() {
    return null;
  }
}
