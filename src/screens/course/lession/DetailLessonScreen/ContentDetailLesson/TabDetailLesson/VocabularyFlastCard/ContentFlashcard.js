import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseKeyboardListener from 'common/components/base/BaseKeyboardListener';
import BaseText from 'common/components/base/BaseText';
import InputComment from 'screens/components/comment/InputComment';
import Dimension from 'common/helpers/Dimension';
import Const from 'consts/Const';
import React from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { AppContext } from 'states/context/providers/AppProvider';
import CommentFlashCard from './CommentFlashCard';
class ContentFlashcard extends BaseKeyboardListener {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      showKeyboard: false
    };
    this.moveInput = new Animated.Value(0);
    this.maxOffsetInput = 0;
    this.totalBottom = 0;
  }

  keyboardDidShow = (e) => {
    let maxHeight = e.endCoordinates.screenY - this.props.heightFlashcard - 38 * Dimension.scale;
    Animated.timing(this.moveInput, {
      toValue: maxHeight,
      duration: 200,
      useNativeDriver: true
    }).start();
    this.setState({ showKeyboard: true });
  };

  keyboardDidHide = () => {
    Animated.timing(this.moveInput, {
      toValue: this.maxOffsetInput,
      duration: 200,
      useNativeDriver: true
    }).start();
    this.setState({ showKeyboard: false });
  };

  showKeyboard = () => {
    return this.state.showKeyboard;
  };

  dataCommentLength = (data) => {
    this.setState({ commentLength: data.length });
  };
  onFocusInputComment = () => {};
  onBlurInputComment = () => {};

  onLayout = (e) => {
    this.ViewInput.getNode().measure((x, y, w, h, px, py) => {
      this.maxOffsetInput = 420 * Dimension.scale - h;
      this.moveInput.setValue(this.maxOffsetInput);
      this.totalBottom = py - 420 * Dimension.scale;
    });
  };

  render() {
    const { value } = this.state;
    const { item } = this.props;
    return (
      <View style={styles.content}>
        {value.img != '' ? (
          <FastImage
            source={{ uri: `${Const.RESOURCE_URL.FLASHCARD.IMAGE}${value.img}` }}
            style={styles.imageStyle}
            resizeMode={FastImage.resizeMode.contain}
          />
        ) : null}
        {value.vi ? <BaseText style={styles.textTrans}>{value.vi}</BaseText> : null}
        <View style={styles.border} />
        <View style={styles.viewButtonComment}>
          <AppContext.Consumer>
            {({ addComment, updateComment }) => {
              if (item.choose) {
                return (
                  <CommentFlashCard
                    item={item}
                    addComment={addComment && addComment.parent_id ? null : addComment}
                    updateComment={updateComment}
                    dataCommentLength={this.dataCommentLength}
                  />
                );
              }
            }}
          </AppContext.Consumer>
        </View>
        {this.state?.commentLength > 0 ? (
          <TouchableOpacity style={styles.buttonCmt} onPress={this.props.onModalComment}>
            <BaseText style={styles.moreStyle}>{Lang.learn.text_see_more}</BaseText>
          </TouchableOpacity>
        ) : null}

        <Animated.View
          style={[{ transform: [{ translateY: this.moveInput }] }, { position: 'absolute' }]}
          ref={(refs) => (this.ViewInput = refs)}
          onLayout={this.onLayout}>
          <InputComment
            commentFlashcard
            objectId={item.id}
            type={'flashcard'}
            placeholder={Lang.flashcard.text_placeholder_comment}
            onFocusInputComment={this.onFocusInputComment}
            onBlurInputComment={this.onBlurInputComment}
            style={styles.comentStyle}
          />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    width: 250 * Dimension.scale,
    height: 420 * Dimension.scale,
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: '#ddd',
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    backgroundColor: 'white',
    backfaceVisibility: 'hidden'
  },
  imageStyle: {
    width: 230 * Dimension.scale,
    height: 110 * Dimension.scale,
    marginTop: 10
  },
  textTrans: {
    color: 'black',
    fontSize: 22,
    fontWeight: '600',
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlign: 'center'
  },
  border: {
    width: '90%',
    borderBottomWidth: 0.5,
    borderBottomColor: '#333'
  },
  viewButtonComment: {
    width: '100%',
    height: 190 * Dimension.scale
  },
  buttonCmt: {
    position: 'absolute',
    bottom: 50 * Dimension.scale
  },
  moreStyle: {
    color: Resource.colors.greenColorApp
  },
  comentStyle: {
    width: 250 * Dimension.scale,
    height: 38 * Dimension.scale,
    paddingHorizontal: 5 * Dimension.scale
  }
});

export default ContentFlashcard;
