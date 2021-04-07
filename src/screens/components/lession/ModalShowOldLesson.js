import Dimension from 'common/helpers/Dimension';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
const height = Dimension.heightParent;
const width = Dimension.widthParent;

export default class ModalShowOldLesson extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      lessonName: ''
    };
  }

  hideModal = () => {
    this.setState({ visible: false });
  };

  showModal = (lessonName) => {
    this.setState({ visible: true, lessonName });
  };

  onPressKeepLearning = () => {
    this.hideModal();
    this.props.onPressKeepLearning();
  };

  onPressCacel = () => {
    this.hideModal();
    this.props.onPressCacel();
  };

  render() {
    const { visible, lessonName } = this.state;
    if (!visible) return null;
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Image source={Resource.images.hocTiepGif} style={styles.img} />
          <View style={styles.areaText}>
            <BaseText style={{ fontSize: 13 * Dimension.scale }}>
              <BaseText style={styles.textContent}>{Lang.chooseLession.text_you_are_learn}</BaseText> <BaseText style={styles.textTitle}>{lessonName}</BaseText>{' '}
              {'. '} <BaseText style={styles.textContent}>{Lang.chooseLession.text_ask_keep_learn}</BaseText>
            </BaseText>
          </View>
          <View style={styles.areaButton}>
            <TouchableOpacity style={styles.buttonIgnore} onPress={this.onPressCacel}>
              <BaseText style={styles.textButtonIgnore}>{Lang.chooseLession.text_button__cancel_show_old_lesson}</BaseText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonView} onPress={this.onPressKeepLearning}>
              <BaseText style={styles.textButtonView}>{Lang.chooseLession.text_button_keep_learning_lesson}</BaseText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width,
    height
  },
  content: {
    width: 250 * Dimension.scale,
    height: 'auto',
    backgroundColor: 'white',
    borderRadius: 20 * Dimension.scale,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 0
  },
  areaButton: {
    flexDirection: 'row',
    height: 35 * Dimension.scale,
    marginTop: 20 * Dimension.scale
  },
  buttonIgnore: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: Resource.colors.borderWidth,
    borderTopWidth: 1
  },
  textButtonIgnore: {
    fontSize: 11 * Dimension.scale,
    color: 'black',
    fontWeight: '600'
  },
  buttonView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Resource.colors.greenColorApp
  },
  textButtonView: {
    fontSize: 11 * Dimension.scale,
    color: 'white',
    fontWeight: '700'
  },
  img: {
    width: 110 * Dimension.scale,
    height: 125 * Dimension.scale,
    marginTop: 30
  },
  areaText: {
    width: 225 * Dimension.scale,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20 * Dimension.scale
  },
  textTitle: {
    fontSize: 11 * Dimension.scale,
    color: 'black',
    fontStyle: 'italic',
    fontWeight: 'bold'
  },
  textContent: {
    fontSize: 11 * Dimension.scale,
    color: 'black',
    fontStyle: 'italic',
    marginTop: 5
  }
});
