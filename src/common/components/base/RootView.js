import OneSignalService from 'common/services/OneSignalService';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';

class RootView extends Component {
  constructor(properties) {
    super(properties);
    OneSignalService.init();
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  componentWillUnmount() {
    OneSignalService.reset();
  }

  render() {
    const { user } = this.props;
    return (
      <View style={styles.container}>
        {this.props.children}
        {/* {Configs.enabledFeature.takeGift && user?.id && <ButtonTakeGift hideText={true} />} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
const mapStateToProps = (state) => ({
  user: state.userReducer.user
});
export default connect(mapStateToProps)(RootView);
