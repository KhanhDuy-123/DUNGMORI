import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import MainNavigator from './MainNavigator';

const mainStack = createSwitchNavigator({
  Main: MainNavigator
});

const MainNavigation = createAppContainer(MainNavigator);
export default MainNavigation;
