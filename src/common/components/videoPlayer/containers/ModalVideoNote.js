import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseButtonOpacity from 'common/components/base/BaseButtonOpacity';
import BaseInput from 'common/components/base/BaseInput';
import BaseKeyboardListener from 'common/components/base/BaseKeyboardListener';
import ModalScreen from 'common/components/base/ModalScreen';
import VideoNoteController from 'realm/controllers/VideoNoteController';
import React from 'react';
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Dimension from 'common/helpers/Dimension';
import VideoController from 'realm/controllers/VideoController';
import VideoNoteActionCreator from 'states/redux/actionCreators/VideoNoteActionCreator';

class ModalTextNote extends BaseKeyboardListener {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      text: '',
      showKeyboard: false
    };
  }

  keyboardDidShow = () => {
    this.setState({ showKeyboard: true });
  };

  keyboardDidHide = () => {
    this.setState({ showKeyboard: false });
  };

  onChangeText = (text) => {
    this.setState({ text });
  };

  showModal = () => {
    this.setState({ isVisible: true });
  };

  hideModal = () => {
    const { showKeyboard } = this.state;
    if (!showKeyboard) {
      this.setState({ isVisible: false });
    } else {
      Keyboard.dismiss();
    }
  };

  onPressBack = () => {
    this.setState({ isVisible: false });
  };

  onPressSave = async () => {
    const { timePlay, params, videoID } = this.props;
    const { text } = this.state;
    this.setState({ isVisible: false });
    let videoGroup = {
      id: videoID,
      lessonId: params.item.id
    };
    let videoNote = {
      id: VideoNoteController.genNewId(),
      content: text,
      duration: timePlay,
      createdAt: new Date()
    };
    VideoNoteActionCreator.updateVideoTextNote({ ...videoNote, video: videoID });
    const video = await VideoController.add(videoGroup);
    VideoNoteController.add({ ...videoNote, video });
    this.props.onPauseVideo();
  };

  render() {
    return (
      <ModalScreen isVisible={this.state.isVisible}>
        <TouchableWithoutFeedback onPress={this.hideModal}>
          <View style={styles.container}>
            <View style={styles.viewModal}>
              <BaseInput
                viewInputStyle={styles.viewInputStyle}
                textInputStyle={styles.textInputStyle}
                placeholder="Nhập ghi chú"
                onChangeText={this.onChangeText}
              />
              <View style={styles.wrapperButton}>
                <BaseButtonOpacity text={Lang.flashcard.text_button_back} onPress={this.onPressBack} socialButtonStyle={styles.buttonLeft} />
                <BaseButtonOpacity
                  text={Lang.flashcard.text_button_save}
                  onPress={this.onPressSave}
                  textStyle={{ color: Resource.colors.black1 }}
                  socialButtonStyle={styles.buttonRight}
                />
              </View>
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
    height: 200 * Dimension.scale,
    borderRadius: 20,
    backgroundColor: Resource.colors.white100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewInputStyle: {
    width: 220 * Dimension.scale,
    borderWidth: 1,
    borderColor: Resource.colors.grey800,
    borderRadius: 5,
    marginVertical: 20,
    paddingHorizontal: 7
  },
  textInputStyle: {
    color: Resource.colors.black1
  },
  wrapperButton: {
    flexDirection: 'row',
    marginHorizontal: 30,
    margin: 20
  },
  buttonLeft: {
    width: 100 * Dimension.scale,
    height: 40,
    borderWidth: 0.5,
    borderColor: Resource.colors.grey500,
    borderRadius: 20,
    marginRight: 20
  },
  buttonRight: {
    width: 100 * Dimension.scale,
    height: 40,
    backgroundColor: Resource.colors.greenColorApp,
    borderRadius: 20
  }
});
export default ModalTextNote;
