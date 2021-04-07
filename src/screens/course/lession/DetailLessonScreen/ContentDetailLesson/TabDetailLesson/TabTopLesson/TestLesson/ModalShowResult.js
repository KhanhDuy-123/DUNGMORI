import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import React, { Component } from 'react';
import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

export default class ModalShowResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  showModal = () => {
    this.setState({ visible: true });
  };

  onPressIgnore = () => {
    this.setState({ visible: false });
    this.props.onPressIgnore();
  };

  onPressShowResult = () => {
    this.setState({ visible: false });
    this.props.onShowResult();
  };

  render() {
    const { visible } = this.state;
    const { point, totalPoint, result } = this.props;
    return (
      <Modal transparent={true} visible={visible} onRequestClose={() => {}}>
        <View style={styles.container}>
          <View style={styles.content}>
            <Image source={result ? Resource.images.imgHightPoint : Resource.images.imgLowPoint} style={styles.img} />
            <View style={styles.areaText}>
              <BaseText style={styles.textTitle}>
                {Lang.test.text_title_low} {point}/{totalPoint} {Lang.test.text_point}
              </BaseText>
              {result ? (
                <BaseText style={styles.textContent}>{Lang.test.test_good}</BaseText>
              ) : (
                <BaseText style={styles.textContent}>{Lang.test.text_try_lated}</BaseText>
              )}
            </View>
            <View style={styles.areaButton}>
              <TouchableOpacity style={styles.buttonIgnore} onPress={this.onPressIgnore}>
                <BaseText style={styles.textButtonIgnore}>{Lang.test.text_button_ignore}</BaseText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonView} onPress={this.onPressShowResult}>
                <BaseText style={styles.textButtonView}>{Lang.test.text_button_view}</BaseText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    width: 310,
    height: 340,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center'
  },
  areaButton: {
    flexDirection: 'row',
    width: 310,
    height: 45,
    position: 'absolute',
    bottom: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  buttonIgnore: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#bdbdbd',
    borderBottomLeftRadius: 20
  },
  textButtonIgnore: {
    fontSize: 14,
    color: 'black',
    fontWeight: '500'
  },
  buttonView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 20,
    backgroundColor: Resource.colors.greenColorApp
  },
  textButtonView: {
    fontSize: 14,
    color: 'white',
    fontWeight: '700'
  },
  img: {
    width: 155,
    height: 150,
    marginTop: 30
  },
  areaText: {
    width: 300,
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  textTitle: {
    fontSize: 12 * Dimension.scale,
    color: 'red',
    fontStyle: 'italic',
    fontWeight: '600'
  },
  textContent: {
    fontSize: 11 * Dimension.scale,
    color: 'black',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 5
  }
});
