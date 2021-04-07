import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseButton from 'common/components/base/BaseButton';
import BaseText from 'common/components/base/BaseText';
import LoadingModal from 'common/components/base/LoadingModal';
import ModalWebView from 'common/components/base/ModalWebView';
import TextHightLightLink from 'common/components/base/TextHightLightLink';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import Time from 'common/helpers/Time';
import Const from 'consts/Const';
import UIConst from 'consts/UIConst';
import React, { Component } from 'react';
import { Alert, Linking, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import SoundPlayer from 'screens/components/lession/SoundPlayer';
import AppAction from 'states/context/actions/AppAction';
import Configs from 'utils/Configs';
import Utils from 'utils/Utils';
import ListReply from '../ListReply';
import InputReplyKaiwa from './InputReplyKaiwa';
import SoundComment from './SoundComment';

const width = Dimension.widthParent;
export default class CommentVoice extends Component {
  constructor(props) {
    super(props);
    var { item } = props;

    // State
    this.state = {
      liked: item.liked > 0,
      viewReply: false
    };
    this.youtube = false;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.item.viewReply !== this.props.item.viewReply) {
      this.setState({ viewReply: nextProps.item.viewReply });
    }
    return nextProps !== this.props || this.state !== nextState;
  }

  onPressReply = () => {
    var item = { ...this.props.item };

    // Nếu bấm vào trả lời của 1 reply item => Sẽ chuyển thành trả lời của commnent cha
    if (item.parent_id > 0) {
      item.id = item.parent_id;
    }
    AppAction.onReplyComment(item);
  };

  onPressTooggleViewReply = () => {
    this.setState((prevState) => {
      const viewReply = !prevState.viewReply;
      return { viewReply };
    });
  };

  onPressDelete = () => {
    var item = this.props.item;
    Alert.alert('Xóa comment', 'Bạn có chắc chắn muốn xóa bình luận này', [
      {
        text: 'Ok',
        onPress: async () => {
          LoadingModal.show();
          let deleteResponse = await Fetch.post(Const.API.COMMENT.DETLETE_COMENT, { id: item.id, isTeacher: true }, true);
          LoadingModal.hide();
          if (deleteResponse.status == Fetch.Status.SUCCESS) {
            AppAction.onDeleteComment(item);
          } else {
            Funcs.log(`ERROR DELETE COMENT`, deleteResponse.status);
          }
        }
      },
      { text: 'Hủy' }
    ]);
  };

  onPressLink = (link) => {
    if (this.youtube) {
      const indexV = this.contentLink.indexOf('v=');
      const lastIndex = this.contentLink.indexOf('&');
      let videoID = this.contentLink.substring(indexV + 2);
      if (lastIndex !== -1) {
        videoID = this.contentLink.substring(indexV + 2, lastIndex);
      }
      Linking.openURL('vnd.youtube://' + videoID)
        .then((res) => {
          Funcs.log(res);
        })
        .catch((error) => {
          Funcs.log(error);
        });
    } else {
      ModalWebView.show(link);
    }
  };

  onPressOpenModal = () => {
    this.props.onPressOpenModal();
  };

  setLinkSound = (link) => {
    this.InputReplyKaiwa?.setLinkSound(link);
  };

  renderTextOrlink = (info) => {
    if (!info) return null;
    var result = info;
    result = result.replace('<', '&#60;');
    result = result.replace('>', '&#62;');

    //xử lý xuống dòng
    result = info.replace(new RegExp('\r?\n', 'g'), '\n');
    var re = /((?:ftp|http|https):\/\/(?:\w+:{0,1}\w*@)?(?:\S+)(?::[0-9]+)?(?:\/|\/(?:[\w#!:.?+=&%@!-/]))?)/;
    let str = result.split(re);
    let text = <BaseText />;
    for (let i = 0; i < str.length; i++) {
      if (!str[i]) continue;
      let content = str[i].split('//');
      this.link = str[i];
      if (content[0] == 'http:' || content[0] == 'https:' || content[0] == 'ftp:') {
        let youtubeSplit = content[1].split('.');
        if (youtubeSplit[1] == 'youtube') {
          this.youtube = true;
          this.contentLink = youtubeSplit[2];
        }
        text = (
          <BaseText>
            <BaseText>{text}</BaseText>
            <TextHightLightLink link={str[i]} onPressDirectLink={this.onPressLink} styles={{ color: Resource.colors.greenColorApp }} />
          </BaseText>
        );
      } else {
        text = (
          <BaseText>
            <BaseText>{text}</BaseText>
            <BaseText>{str[i]}</BaseText>
          </BaseText>
        );
      }
    }
    return text;
  };

  renderReplyList = () => {
    var { item, isTeacherMode } = this.props;
    if (item.parent_id > 0) return null;
    return (
      <ListReply
        reply={item.reply || []}
        isTeacherMode={isTeacherMode}
        countReply={item.countReply}
        countReplyBefore={item.countReplyBefore}
        parentId={item.id}
        type={'kaiwa'}
      />
    );
  };

  renderSoundPlayer = (isAdmin, style = {}) => {
    const { item } = this.props;
    if (!isAdmin) return <SoundComment link={Const.RESOURCE_URL.COMMENT.KAIWA + item.audio} style={style} />;
    return (
      <SoundPlayer
        style={[{ height: 40 }, style]}
        link={Const.RESOURCE_URL.COMMENT.KAIWA + item.audio}
        ref={(refs) => (this.SoundPlayer = refs)}
        isAdmin={true}
        onEnd={() => {}}
        onPlay={() => {}}
      />
    );
  };

  renderCommentVoiceOrText = () => {
    const { item, isTeacherMode } = this.props;
    const isAdmin = Configs.enabledFeature.commentKaiwaForTeacher && isTeacherMode && Utils.user.is_tester == 1;
    if (item.content && !item.audio) {
      return (
        <View style={styles.textComment}>
          <BaseText style={{ color: '#000000', fontSize: 13 }}>{this.renderTextOrlink(item.content)}</BaseText>
        </View>
      );
    } else if (!item.content && item.audio) {
      return this.renderSoundPlayer(isAdmin);
    } else {
      return (
        <View style={styles.wrapperTextAndSound}>
          {this.renderSoundPlayer(isAdmin, !isAdmin ? styles.containerSound : styles.soundPlayer)}
          <View style={styles.wrapperText}>
            <BaseText style={{ color: '#000000', fontSize: 13, fontStyle: 'italic' }}>{this.renderTextOrlink(item.content)}</BaseText>
          </View>
        </View>
      );
    }
  };

  renderLessonInfo = () => {
    var { item, isTeacherMode } = this.props;
    var isReply = item.parent_id > 0;
    if (!isTeacherMode || isReply) return null;
    return (
      <View style={styles.containerLessonInfo}>
        <BaseText style={styles.textLessonName}>
          {item.lesson_name}
          <BaseText style={{ color: 'gray' }}> # </BaseText>
          <BaseText style={{ color: 'green' }}>{item.lesson_component_name}</BaseText>
        </BaseText>
        <View style={{ backgroundColor: item.readed ? 'green' : '#FF7937', padding: 4, paddingHorizontal: 7, borderRadius: 6 }}>
          <BaseText style={{ color: 'white', fontSize: UIConst.FONT_SIZE - 2 }}>{item.readed ? 'Đã xem' : 'Chưa xem'}</BaseText>
        </View>
      </View>
    );
  };

  render() {
    var { item, objectId, isTeacherMode } = this.props;
    const { viewReply } = this.state;
    var isReply = item.parent_id > 0;
    const styleContainer = isReply ? { paddingVertical: 0 } : { borderBottomWidth: 0.6, paddingLeft: 15 };
    let titleViewRep = !viewReply ? Lang.comment.text_see_rep : Lang.comment.text_collapsi;
    return (
      <View
        style={{
          paddingVertical: 12,
          borderColor: Resource.colors.border,
          ...styleContainer
        }}>
        {this.renderLessonInfo()}
        <View style={{ ...styles.itemContainer }}>
          <FastImage source={{ uri: Const.RESOURCE_URL.AVATAR.SMALL + item.avatar }} style={styles.avatar} />
          <View style={styles.boxComment}>
            <View style={styles.containerContent}>
              <View style={styles.containerName}>
                <BaseText style={{ flex: 1 }} numberOfLines={1}>
                  <BaseText style={styles.textName}>{item.name}</BaseText>
                  <BaseText style={[{ color: Resource.colors.black9, fontSize: 10 }]}>{' • '}</BaseText>
                  <BaseText style={styles.titleText}>{Time.fromNow(item.created_at)}</BaseText>
                </BaseText>
              </View>
              {isTeacherMode && (
                <BaseButton onPress={this.onPressDelete}>
                  <BaseText style={{ color: 'red' }}>{'Xóa'}</BaseText>
                </BaseButton>
              )}
            </View>

            {/**Coment voice or text */}
            {!!item.is_correct && isTeacherMode && <BaseText style={{ fontSize: 10, color: 'red' }}>{'Check phát âm'}</BaseText>}

            {this.renderCommentVoiceOrText()}
            <View style={styles.buttonContainer}>
              {item.reply || item.replyCount > 0 ? (
                <BaseText style={styles.textReply} onPress={this.onPressTooggleViewReply}>
                  {titleViewRep}
                </BaseText>
              ) : null}
            </View>
            {viewReply ? this.renderReplyList() : null}
          </View>
        </View>
        {Configs.enabledFeature.commentKaiwaForTeacher && isTeacherMode && Utils.user.is_tester == 1 && !isReply ? (
          <InputReplyKaiwa
            objectId={objectId || item?.lesson_component_id}
            parentId={item.id}
            onPressOpenModal={this.onPressOpenModal}
            ref={(refs) => (this.InputReplyKaiwa = refs)}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row'
  },
  textLessonName: {
    flex: 1,
    fontWeight: 'bold',
    color: 'red',
    fontSize: UIConst.FONT_SIZE - 2
  },
  viewComment: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15
  },
  containerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  boxComment: {
    flex: 1,
    marginHorizontal: 15
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 0.7,
    marginTop: 20,
    borderColor: Resource.colors.border
  },
  containerName: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  textName: {
    fontSize: 13,
    color: '#000000',
    fontWeight: 'bold'
  },
  titleText: {
    fontSize: 13,
    color: Resource.colors.black7
  },
  buttonContainer: {
    paddingBottom: 5,
    paddingTop: 3
  },
  textReply: {
    color: Resource.colors.greenColorApp,
    fontWeight: '500'
  },
  textComment: {
    backgroundColor: 'rgba(224, 224, 224, 0.5)',
    width: width - (60 * Dimension.scale + 80),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 10,
    minHeight: 35,
    paddingVertical: 10,
    marginTop: 8
  },
  textAmin: {
    position: 'absolute',
    bottom: 15,
    fontSize: 12,
    fontWeight: 'bold',
    color: 'red',
    left: 5
  },
  wrapperTextAndSound: {
    borderRadius: 20,
    backgroundColor: 'rgba(224, 224, 224, 0.5)',
    justifyContent: 'flex-start',
    marginTop: 5
  },
  wrapperText: {
    paddingLeft: 15,
    marginVertical: 5
  },
  containerSound: {
    width: width - (60 * Dimension.scale + 80),
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 10
  },
  containerLessonInfo: {
    flex: 1,
    margin: 10,
    marginLeft: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  soundPlayer: {
    height: 40,
    paddingRight: 10,
    marginLeft: 0,
    width: '100%',
    marginVertical: 0,
    marginBottom: 5
  }
});
