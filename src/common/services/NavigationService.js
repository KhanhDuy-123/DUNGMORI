import Funcs from 'common/helpers/Funcs';
import 'react-native-gesture-handler';
import { NavigationActions, StackActions } from 'react-navigation';

let navigator;

function setNavigator(navigatorRef) {
  navigator = navigatorRef;
}

function navigate(routeName, params) {
  Funcs.log('Navigate', routeName, params);
  navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
}

function push(routeName, params) {
  navigator.dispatch(
    StackActions.push({
      routeName,
      params
    })
  );
}

function replace(routeName, params) {
  navigator.dispatch(
    StackActions.replace({
      routeName,
      params
    })
  );
}

function pop(n) {
  navigator.dispatch(
    StackActions.pop({
      n: n
    })
  );
}

function popToTop() {
  navigator.dispatch(StackActions.popToTop());
}

function reset(routeName, params) {
  navigator.dispatch(
    StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName, params })]
    })
  );
}

function back() {
  navigator.dispatch(NavigationActions.back());
}

function getParams() {
  const nav = navigator && navigator.state && navigator.state.nav ? navigator.state.nav : {};
  if (nav.index >= 0 && nav.routes.length > nav.index) {
    var router = nav.routes[nav.index];
    if (router) return router.params;
  }
  return {};
}

export default {
  navigate,
  reset,
  setNavigator,
  back,
  push,
  pop,
  replace,
  popToTop,
  getParams
};
