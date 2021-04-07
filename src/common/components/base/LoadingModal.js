import Resource from 'assets/Resource';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import Spinner from 'react-native-spinkit';
import Funcs from 'common/helpers/Funcs';

const TIME_OUT = 10 * 1000;
var ref = null;

export default class LoadingModal extends PureComponent {
  static show() {
    if (ref) ref.showLoading();
    else Funcs.log('LoadingModal instance not exist');
  }

  static hide() {
    if (ref) ref.hideLoading();
    else Funcs.log('LoadingModal instance not exist');
  }

  static defaultProps = {
    spinnerSize: 40,
    spinnerType: 'Circle',
    spinnerColor: Resource.colors.greenColorApp
  };

  static propTypes = {
    spinnerSize: PropTypes.number,
    spinnerType: PropTypes.string,
    spinnerColor: PropTypes.string
  };

  state = {
    isVisible: false
  };

  render() {
    return (
      <Modal transparent={true} animationType={'fade'} style={{ position: 'absolute' }} visible={this.state.isVisible}>
        <View style={styles.container}>
          <Spinner isVisible={true} size={this.props.spinnerSize} type={this.props.spinnerType} color={this.props.spinnerColor} />
        </View>
      </Modal>
    );
  }

  showLoading = () => {
    clearTimeout(this.loadingTimeout);
    this.loadingTimeout = setTimeout(() => {
      this.setState({ isVisible: false });
    }, TIME_OUT);
    this.setState({ isVisible: true });
  };
  hideLoading = () => {
    if (this.loadingTimeout) clearTimeout(this.loadingTimeout);
    this.setState({ isVisible: false });
  };

  componentWillUnmount() {
    ref = null;
    if (this.loadingTimeout) clearTimeout(this.loadingTimeout);
  }

  componentDidMount() {
    ref = this;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
