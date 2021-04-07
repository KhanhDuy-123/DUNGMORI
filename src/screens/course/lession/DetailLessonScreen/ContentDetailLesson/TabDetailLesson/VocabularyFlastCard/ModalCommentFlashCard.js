import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import InputComment from 'screens/components/comment/InputComment';
import ListComment from 'screens/components/comment/ListComment';
import Dimension from 'common/helpers/Dimension';
import React, { PureComponent } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationService from 'common/services/NavigationService';
import AppConst from 'consts/AppConst';

const height = Dimension.heightParent;
class ModalCommentFlashCard extends PureComponent {
  constructor(props) {
    super(props);
    this.animation = new Animated.Value(height);
  }
  componentDidMount() {
    Animated.timing(this.animation, {
      toValue: 0,
      duration: 300
    }).start();
  }
  onFocusInputComment = () => {};

  onBlurInputComment = () => {};

  onPressHideModal = () => {
    Animated.timing(this.animation, {
      toValue: height,
      duration: 200
    }).start(() => {
      this.props.onPressHideModal();
    });
  };

  onPressBack = () => {
    NavigationService.pop();
  };

  render() {
    const { itemCard, params } = this.props;
    return (
      <View style={[StyleSheet.absoluteFill, styles.wrapper]}>
        <Animated.View style={[{ transform: [{ translateY: this.animation }] }, { flex: 1 }]}>
          <View style={styles.viewTitle}>
            {params.typeNotify ? (
              <TouchableOpacity onPress={this.onPressBack} style={styles.buttonClose}>
                <Icon name="ios-close" size={30} />
              </TouchableOpacity>
            ) : null}
            <View style={styles.viewComment}>
              <BaseText style={styles.title}>{Lang.flashcard.text_title_comment}</BaseText>
            </View>
            {params.typeNotify ? (
              <TouchableOpacity onPress={this.onPressHideModal} style={styles.buttonClose1}>
                <BaseText>{Lang.flashcard.text_button_show_flashcard}</BaseText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={this.onPressHideModal} style={styles.buttonClose}>
                <Icon name="ios-close" size={30} />
              </TouchableOpacity>
            )}
          </View>
          <ListComment objectId={itemCard.id} type={'flashcard'} onScrollToComment={this.onScrollToComment} />
          <InputComment
            commentFlashcard
            objectId={itemCard.id}
            type={'flashcard'}
            onFocusInputComment={this.onFocusInputComment}
            onBlurInputComment={this.onBlurInputComment}
          />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'white'
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    paddingVertical: 20,
    fontWeight: '500',
    paddingLeft: 20
  },
  viewTitle: {
    paddingTop: AppConst.IS_IPHONEX ? 40 : 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  viewComment: {
    flex: 5,
    alignItems: 'center'
  },
  buttonClose: {
    width: 60,
    paddingLeft: 20
  },
  buttonClose1: {
    height: 35,
    marginRight: 15,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: Resource.colors.black1,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ModalCommentFlashCard;
