import Resource from 'assets/Resource';
import EmojiIcons from 'common/components/base/EmojiIcons';
import Dimension from 'common/helpers/Dimension';
import React, { PureComponent } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Configs from 'utils/Configs';

const width = Dimension.widthParent;

export default class InputChat extends PureComponent {
  state = {
    text: ''
  };

  onChangeText = (text) => {
    this.setState({ text });
  };

  showEmoji = () => {
    this.showEmojiRef.show();
  };

  hideEmoji = () => {
    this.showEmojiRef.hide();
  };

  render() {
    const { isActivity, onPressSubmitMessenger, onFocusTextInput, onBlurTextInput, onPressSubmitLike, onPressShowEmoj } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.inputBox}>
          <View style={styles.input}>
            <TextInput
              ref={(ref) => (this.inputRef = ref)}
              placeholder="Aa..."
              placeholderTextColor={'#C4C4C4'}
              style={this.state.text.length === 0 ? styles.textInputStyle : styles.textInputStyle1}
              value={this.state.text}
              multiline={true}
              onChangeText={this.onChangeText}
              onFocus={onFocusTextInput}
              onBlur={onBlurTextInput}
              selectTextOnFocus={true}
              allowFontScaling={false}
            />
            {this.state.text.length === 0 ? (
              <TouchableOpacity style={styles.buttonPhoto} onPress={this.props.onPressShowImage}>
                <FastImage source={Resource.images.iconPhoto} style={styles.iconStyle} />
              </TouchableOpacity>
            ) : null}

            {Configs.enabledFeature.sticker ? (
              <TouchableOpacity onPress={onPressShowEmoj} style={[styles.buttonChat, { marginRight: 10 }]}>
                <FontAwesome name={'smile-o'} size={24} color={Resource.colors.greenColorApp} />
              </TouchableOpacity>
            ) : null}
          </View>
          {this.state.text.length != 0 || (this.state.text.length === 0 && isActivity) ? (
            <TouchableOpacity onPress={onPressSubmitMessenger} style={styles.buttonChat}>
              <FastImage source={Resource.images.iconSend} style={styles.iconStyle} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onPressSubmitLike} style={styles.buttonChat}>
              <FastImage source={Resource.images.iconLike} style={styles.iconStyle} tintColor={Resource.colors.greenColorApp} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.showEmoji}>
          <EmojiIcons ref={(ref) => (this.showEmojiRef = ref)} onSelected={this.props.onSelected} />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  inputBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5 * Dimension.scale,
    paddingBottom: 15 * Dimension.scale,
    paddingHorizontal: 20 * Dimension.scale
  },
  input: {
    flex: 1,
    width: width - 80 * Dimension.scale,
    minHeight: 35 * Dimension.scale,
    maxHeight: 80 * Dimension.scale,
    borderWidth: 0.8,
    borderColor: Resource.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10 * Dimension.scale,
    borderRadius: 25 * Dimension.scale
  },
  textInputStyle: {
    padding: 10,
    maxHeight: 80 * Dimension.scale,
    width: width - 150 * Dimension.scale,
    paddingTop: 7 * Dimension.scale
  },
  textInputStyle1: {
    padding: 10,
    maxHeight: 80 * Dimension.scale,
    width: width - 125 * Dimension.scale,
    paddingTop: 7 * Dimension.scale
  },
  iconStyle: {
    width: 20 * Dimension.scale,
    height: 20 * Dimension.scale
  },
  buttonPhoto: {
    paddingVertical: 7,
    paddingLeft: 5
  },
  buttonChat: {
    paddingVertical: 7,
    paddingLeft: 15
  }
});
