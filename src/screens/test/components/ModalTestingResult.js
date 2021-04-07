import Lang from 'assets/Lang';
import Styles from 'assets/Styles';
import Header from 'common/components/base/Header';
import { getStatusBarHeight } from 'common/helpers/IPhoneXHelper';
import React, { Component } from 'react';
import { View } from 'react-native';
import CertificateJLPTView from '../TestingScreen/UpdateUserInfoJLPTView/CertificateJLPTView';

export default class ModalTestingResult extends Component {
  static instance;

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  componentDidMount() {
    ModalTestingResult.instance = this;
  }

  static showModal = (userData, result) => {
    ModalTestingResult.instance.setState({ visible: true, userData, result });
  };

  hideModel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { userData, result, visible } = this.state;
    if (!visible) return null;
    return (
      <View style={[Styles.modal, { backgroundColor: 'white', paddingTop: getStatusBarHeight() }]}>
        <Header left onBackPress={this.hideModel} text={Lang.try_do_test.result_test} />
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <CertificateJLPTView userData={userData || {}} result={result} onPressComplete={this.hideModel} isActive />
        </View>
      </View>
    );
  }
}
