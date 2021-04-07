import Resource from 'assets/Resource';
import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

export default class ModalScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { isVisible } = this.props;
    return (
      <Modal {...this.props} isVisible={isVisible}>
        {this.props.children}
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    backgroundColor: Resource.colors.white100
  }
});
