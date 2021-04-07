import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import ModalScreen from 'common/components/base/ModalScreen';
import React, { PureComponent } from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Dimension from 'common/helpers/Dimension';

const width = Dimension.widthParent;

class ModalActivation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ModalScreen isVisible={this.props.isVisible}>
        <View style={styles.container}>
          <FastImage source={Resource.images.determinationGif} style={styles.iconStyle} resizeMode={FastImage.resizeMode.contain} />
          <BaseText style={styles.actiStyle}>{Lang.profile.hint_activation_success}</BaseText>
          <BaseText style={styles.contentStyle}>{Lang.profile.hint_content_modal_activation}</BaseText>
          <View style={styles.viewButton}>
            <TouchableHighlight underlayColor="transparent" style={styles.buttonStyle} onPress={this.props.onPress}>
              <BaseText style={styles.learnStyle}>{Lang.learn.text_button_understand}</BaseText>
            </TouchableHighlight>
          </View>
        </View>
      </ModalScreen>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width - 60,
    height: width,
    borderRadius: 20,
    backgroundColor: Resource.colors.white100,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  buttonStyle: {
    width: width - 60,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Resource.colors.colorButton,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  iconStyle: {
    width: 200,
    height: 200,
    marginLeft: 20
  },
  learnStyle: {
    fontSize: 17,
    fontWeight: '600',
    color: Resource.colors.white100
  },
  viewButton: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  actiStyle: {
    fontSize: 17,
    fontWeight: '700',
    fontStyle: 'italic',
    color: Resource.colors.red700
  },
  contentStyle: {
    fontSize: 15,
    paddingHorizontal: 20,
    textAlign: 'center',
    paddingTop: 20
  }
});

export default ModalActivation;
