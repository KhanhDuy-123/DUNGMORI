import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import React, { PureComponent } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import ScreenNames from 'consts/ScreenName';
import NavigationService from 'common/services/NavigationService';
import BaseButton from './BaseButton';
import BaseText from './BaseText';
import ModalScreen from './ModalScreen';

var ref = null;

class ModalLoginRequiment extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    };
  }
  componentDidMount() {
    ref = this;
  }

  componentWillUnmount() {
    ref = null;
  }

  static show() {
    if (ref) ref.showModal();
    else Funcs.log('LoginModal instance not exits');
  }

  static hide() {
    if (ref) ref.hideModal();
    else Funcs.log('LoginModal instance not exits');
  }

  showModal = () => {
    this.setState({ isVisible: true });
  };

  hideModal = () => {
    this.setState({ isVisible: false });
  };

  onPress = () => {
    this.setState({ isVisible: false });
    NavigationService.navigate(ScreenNames.ParentAuthenticateScreen);
  };

  render() {
    return (
      <ModalScreen isVisible={this.state.isVisible}>
        <TouchableWithoutFeedback onPress={this.hideModal}>
          <View style={styles.container}>
            <View style={styles.viewModal}>
              <FastImage source={Resource.images.gifLogin} style={styles.icon} resizeMode={FastImage.resizeMode.contain} />
              <BaseText style={styles.content}>{Lang.login.login_require}</BaseText>
              <BaseText style={styles.detail}>{Lang.login.login_require_detail}</BaseText>
              <BaseButton onPress={this.onPress} style={styles.button}>
                <BaseText style={styles.textStyle}>{Lang.login.login_now}</BaseText>
              </BaseButton>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ModalScreen>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: 160,
    height: 150,
    marginBottom: 5
  },
  viewModal: {
    width: 270 * Dimension.scale,
    height: 280 * Dimension.scale,
    borderRadius: 20,
    backgroundColor: Resource.colors.white100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textStyle: {
    fontSize: 12 * Dimension.scale,
    fontWeight: '600',
    color: 'white'
  },
  content: {
    fontSize: 14 * Dimension.scale,
    paddingHorizontal: 20,
    paddingTop: 5,
    textAlign: 'center'
  },
  detail: {
    fontSize: 10 * Dimension.scale,
    paddingHorizontal: 20,
    paddingTop: 5,
    textAlign: 'center'
  },
  button: {
    padding: 10,
    paddingHorizontal: 20,
    textAlign: 'center',
    margin: 5,
    backgroundColor: Resource.colors.greenColorApp,
    borderRadius: 25,
    marginTop: 15
  },
  textHint: {
    marginHorizontal: 15
  }
});
export default ModalLoginRequiment;
