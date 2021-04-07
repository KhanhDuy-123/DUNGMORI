import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseInput from 'common/components/base/BaseInput';
import BaseText from 'common/components/base/BaseText';
import LoadingModal from 'common/components/base/LoadingModal';
import ModalLoginRequiment from 'common/components/base/ModalLoginRequiment';
import PhotoSelect from 'common/components/photo/PhotoSelect';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import Const from 'consts/Const';
import React, { PureComponent } from 'react';
import { Image, Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AppAction from 'states/context/actions/AppAction';
import { AppContext } from 'states/context/providers/AppProvider';
import Utils from 'utils/Utils';

export default class InputComment extends PureComponent {
  state = {
    isPhotoActive: false,
    isSendActive: false
  };

  static defaultProps = {
    placeholder: Lang.comment.placeholder
  };

  parentComment = null;

  componentWillUnmount() {
    AppAction.onReplyComment(null);
    AppAction.onSaveParentId(null);
    this.parentComment = null;
    this.replyComment = null;
  }

  hideContent = () => {
    this.refs.PhotoSelect.hide();
  };

  setResponseUser = (responseUserName) => {
    this.setState({
      responseUserName
    });
  };

  onPressShowImage = () => {
    if (!this.props.commentFlashcard) {
      if (!this.refs.PhotoSelect.isShow()) {
        this.refs.PhotoSelect.show();
        this.setState({ isPhotoActive: true });
      } else {
        this.refs.PhotoSelect.hide();
        this.setState({ isPhotoActive: false });
      }
      Keyboard.dismiss();
    }
  };

  onPressSend = async () => {
    let photo = (this.listPhoto && this.listPhoto.length > 0 && this.listPhoto[0]) || {};
    let { uri, type } = photo;
    let image = uri
      ? {
          uri,
          name: 'image', // Bắt buộc phải có trường name
          type
        }
      : null;
    this.addComment(image, uri);
  };

  onPressSendCapture = (photo) => {
    let image = {
      uri: photo.uri,
      name: 'image',
      type: photo.type
    };

    this.addComment(image, photo.uri);
  };

  addComment = async (image, uri) => {
    // Hide keyboard
    Keyboard.dismiss();
    let { objectId, type, modalComment, item } = this.props;
    let value = this.BaseInput.getText();

    // check login app
    if (!Utils.user || !Utils.user.id) return ModalLoginRequiment.show();
    // Check message
    if (value.trim().length < 1 && !uri) return;

    let parentId = this.parentComment ? this.parentComment.id : 0;
    if (modalComment) {
      parentId = item.id;
    }
    if (this.replyComment) {
      parentId = this.replyComment.id;
    }

    // Comment data
    if (this.tagData) value = value.replace(`@${this.tagData.name} `, '');
    let commentData = {
      objectId,
      userId: Utils.user.id,
      content: value,
      type,
      image,
      parentId: parentId,
      tagData: this.tagData ? JSON.stringify(this.tagData) : null
    };

    LoadingModal.show();
    var res = await Fetch.postForm(Const.API.COMMENT.ADD_COMMENT, commentData, true);
    LoadingModal.hide();

    if (res && res.status === 200 && res.data && res.data.comment) {
      this.listPhoto = null;
      var comment = { ...res.data.comment, avatar: Utils.user.avatar, name: Utils.user.name };
      AppAction.onAddComment(comment);

      // If is reply => update count reply of parent
      let replyComment = this.replyComment ? this.replyComment : this.parentComment;
      if (replyComment) {
        var countReply = replyComment.countReply > 0 ? replyComment.countReply : 0;
        let { reply } = replyComment;
        if (!reply) reply = [];
        reply = [...reply, comment];
        AppAction.onUpdateComment({
          ...replyComment,
          reply,
          countReply: countReply + 1
        });
        if (this.parentComment) {
          this.parentComment.reply = reply;
          AppAction.onSaveParentId(this.parentComment);
        }
      }
    }

    // Reset input
    this.BaseInput.blur();
    this.tagData = null;

    // Reset user response
    AppAction.onReplyComment(null);
    if (!this.props.commentFlashcard) {
      // Hide photo
      this.refs.PhotoSelect.hide();
      this.setState({
        isSendActive: false
      });
    }
  };

  onPressClearResponseUser = () => {
    AppAction.onReplyComment(null);
    this.tagData = null;
    this.BaseInput.reset();
  };

  onPhotoSelected = (listPhoto) => {
    this.listPhoto = listPhoto;
    this.setState({
      isSendActive: this.listPhoto.length > 0 || (this.text && this.text.trim().length > 0)
    });
  };

  onFocus = () => {
    this.BaseInput.focus();
    if (!this.props.commentFlashcard) {
      this.refs.PhotoSelect.hide();
    }
    this.props.onFocusInputComment();
  };

  onBlur = () => {
    this.props.onBlurInputComment();
  };

  onChangeText = (text) => {
    text = text.trim();
    this.text = text;
    let isSendActive = text.trim().length > 0;
    if (isSendActive != this.state.isSendActive) {
      this.setState({
        isSendActive
      });
    }
    // Clear tag
    if (text.length < 2 && this.tagData) {
      AppAction.onReplyComment(null);
      this.tagData = null;
      this.BaseInput.reset();
    }
  };

  renderUserResponse = () => {
    return (
      <AppContext.Consumer>
        {(state) => {
          let replyComment = state?.replyComment;
          let parentComment = state?.parentComment;
          let updateComment = state?.updateComment;
          this.parentComment = parentComment;
          if (updateComment && updateComment.id == parentComment?.id) this.parentComment.countReply = updateComment.countReply;
          let isNewReplyComment = this.replyComment != replyComment;
          this.replyComment = replyComment;
          if (!replyComment) return null;

          // Focus to input
          if (isNewReplyComment && this.BaseInput) this.BaseInput.focus();

          // User name
          let isMyComment = replyComment.user_id === Utils.user.id;
          var userName = isMyComment ? Lang.comment.you : replyComment.name;
          if (isNewReplyComment && !isMyComment) {
            setTimeout(() => {
              this.BaseInput.setText(`@${replyComment.name} `);
            }, 500);
            this.tagData = { id: replyComment.user_id, name: replyComment.name };
          }

          // Render
          return (
            <View style={styles.containerUserResponse}>
              <BaseText numberOfLines={1} style={styles.textTitleUserResponse}>
                {Lang.comment.reply_to_comment_of}
                <BaseText numberOfLines={1} style={styles.textUserResponse}>
                  {userName}
                </BaseText>
              </BaseText>
              <TouchableOpacity style={styles.buttonClearUserResponse} onPress={this.onPressClearResponseUser}>
                <MaterialIcons name={'clear'} size={20} color={Resource.colors.primaryColor} />
              </TouchableOpacity>
            </View>
          );
        }}
      </AppContext.Consumer>
    );
  };

  renderUserAvatar = () => {
    let { avatar } = Utils.user;
    if (!avatar) return <FontAwesome5 name={'user-alt'} size={17 * Dimension.scale} color={Resource.colors.black1} style={styles.avatars} />;
    return <FastImage source={{ uri: Const.RESOURCE_URL.AVATAR.SMALL + avatar }} style={styles.avatar} />;
  };

  render() {
    let { isPhotoActive, isSendActive } = this.state;
    return (
      <View style={this.props.container}>
        {this.renderUserResponse()}
        <View style={[styles.commentBoxContainer, this.props.style]}>
          {this.renderUserAvatar()}
          <BaseInput
            autoFocus={false}
            ref={(refs) => (this.BaseInput = refs)}
            onLayout={this.onLayout}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            textInputStyle={styles.textInputStyle}
            viewInputStyle={styles.viewInputStyle}
            onChangeText={this.onChangeText}
            placeholder={this.props.placeholder}
            multiline={this.props.commentFlashcard ? false : true}
          />
          {this.props.commentFlashcard ? null : (
            <TouchableOpacity style={styles.buttonChat} onPress={this.onPressShowImage}>
              <Image source={Resource.images.iconPhoto} style={isPhotoActive ? styles.iconStyle : styles.iconInactiveStyle} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.buttonChat} onPress={this.onPressSend}>
            <Image source={Resource.images.iconSend} style={isSendActive ? styles.iconStyle : styles.iconInactiveStyle} />
          </TouchableOpacity>
        </View>
        {this.props.commentFlashcard ? null : (
          <PhotoSelect isSingleSelected={true} ref={'PhotoSelect'} onPhotoSelected={this.onPhotoSelected} onCaptureSuccess={this.onPressSendCapture} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  commentBoxContainer: {
    borderTopWidth: 0.8,
    borderColor: Resource.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15 * Dimension.scale,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: Resource.colors.white100
  },
  flex: {
    flex: 1,
    minWidth: 200 * Dimension.scale
  },
  textInputStyle: {
    color: Resource.colors.black5,
    fontSize: 13 * Dimension.scale,
    paddingVertical: 1,
    paddingHorizontal: 10
  },
  viewInputStyle: {
    flex: 1,
    marginLeft: 3,
    height: null,
    maxHeight: 80 * Dimension.scale
  },
  buttonChat: {
    marginLeft: 15 * Dimension.scale
  },
  titleText: {
    margin: 5
  },
  textTitleUserResponse: {
    flex: 1,
    fontSize: 13
  },
  textUserResponse: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600'
  },
  containerUserResponse: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderTopWidth: 0.8,
    borderColor: Resource.colors.border
  },
  buttonClearUserResponse: {
    marginHorizontal: 5,
    marginVertical: 3
  },
  avatar: {
    width: 24 * Dimension.scale,
    height: 24 * Dimension.scale,
    borderRadius: 12 * Dimension.scale
  },
  avatars: {
    padding: 3 * Dimension.scale,
    borderRadius: 13 * Dimension.scale
  },
  iconStyle: {
    width: 17 * Dimension.scale,
    height: 17 * Dimension.scale
  },
  iconInactiveStyle: {
    width: 17 * Dimension.scale,
    height: 17 * Dimension.scale,
    tintColor: Resource.colors.inactiveButton
  }
});
