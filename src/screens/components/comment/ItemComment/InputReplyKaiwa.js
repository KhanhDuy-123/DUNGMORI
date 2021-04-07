import Colors from 'assets/Colors';
import BaseText from 'common/components/base/BaseText';
import CheckBox from 'common/components/base/CheckBox';
import LoadingModal from 'common/components/base/LoadingModal';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import Const from 'consts/Const';
import React from 'react';
import { Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SoundPlayer from 'screens/components/lession/SoundPlayer';
import AppAction from 'states/context/actions/AppAction';
import AppContextView from 'states/context/views/AppContextView';
import Utils from 'utils/Utils';

export default class InputReplyKaiwa extends AppContextView {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      linkRecord: '',
      changeLink: false
    };
  }

  setLinkSound = (link) => {
    this.setState({ linkRecord: link, changeLink: !this.state.changeLink });
  };

  onChangeText = (text) => {
    this.setState({ text });
  };

  onPressSendComment = async () => {
    //Check do dai cua file ghi am
    let comentDuration = this.SoundPlayer?.getDuration();

    const { text } = this.state;
    const { parentId, objectId } = this.props;
    const isCorrect = this.refs.Checkbox.getValue();

    //lay id comment cha
    const linkRecord = this.state.linkRecord && {
      uri: 'file://' + this.state.linkRecord,
      name: 'audio',
      type: 'audio/mp3'
    };
    let data = {
      isCorrect,
      audio: linkRecord,
      objectId: objectId,
      parentId: parentId,
      type: 'kaiwa',
      isAdmin: Utils.user.is_tester
    };
    if (Math.round(comentDuration) <= 1 || !comentDuration) data.audio = null;
    if (text?.length > 0) data.content = text;
    LoadingModal.show();
    let respone = await Fetch.postForm(Const.API.COMMENT.ADD_COMMENT, data, true);
    LoadingModal.hide();
    if (respone.status == Fetch.Status.SUCCESS) {
      let reply = respone.data.comment;
      reply.avatar = Utils.user.avatar;
      reply.name = Utils.user.name;
      AppAction.onUpdateComment({ id: parentId, readed: 1, viewReply: true });
      AppAction.onAddComment(reply);
      this.setState({
        text: '',
        linkRecord: '',
        changeLink: !this.state.changeLink
      });
      this.refs.Checkbox.setValue(false);

      // Update total unread
      let { totalKaiwaUnread = 0 } = this.context || {};
      totalKaiwaUnread--;
      if (totalKaiwaUnread < 0) totalKaiwaUnread = 0;
      AppAction.onUpdateTotalKaiwaUnread(totalKaiwaUnread);
    }
  };

  onPressOpenModal = async () => {
    let checkPermissionRecord = await Funcs.checkPermission('microphone');
    if (Platform.OS == 'android') {
      let checkRecord = await Funcs.checkPermission('storage');
      if (!checkPermissionRecord || !checkRecord) return;
      this.props.onPressOpenModal();
    } else {
      if (!checkPermissionRecord) return;
      this.props.onPressOpenModal();
    }
  };

  render() {
    const { linkRecord, text, changeLink } = this.state;
    const colorIconSend = linkRecord.length > 0 || text.length > 0 ? 'red' : 'grey';
    let disablePlay = true;
    if (linkRecord.length > 0 || text.length > 0) disablePlay = false;
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.containerCheckbox}>
            <CheckBox ref={'Checkbox'} color={'red'} />
            <BaseText style={styles.textHint}>{'Sửa phát âm'}</BaseText>
          </View>
          <TextInput multiline={true} style={styles.textInputStyles} placeholder="Chú thích..." value={text} onChangeText={this.onChangeText} />
          {/* <View style={styles.wrapperIconPlay}>
          <SoundComment
            ref={(refs) => (this.SoundComment = refs)}
            link={linkRecord}
            isAdmin={true}
            disablePlay={linkRecord.length > 0 ? false : true}
            changeLink={changeLink}
          />
        </View> */}
          <TouchableOpacity onPress={this.onPressOpenModal} style={{ marginRight: 10 }}>
            <FontAwesome name={'microphone'} size={26} color={'red'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onPressSendComment} disabled={disablePlay}>
            <Ionicons name="md-send" size={24} color={colorIconSend} />
          </TouchableOpacity>
        </View>
        {linkRecord.length > 0 ? (
          <SoundPlayer changeLink={changeLink} ref={(refs) => (this.SoundPlayer = refs)} isAdmin={true} link={linkRecord} onEnd={() => {}} onPlay={() => {}} />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15
  },
  textInputStyles: {
    flex: 1,
    maxHeight: 80,
    minHeight: 35,
    backgroundColor: '#E0E0E0',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 100,
    paddingHorizontal: 10,
    overflow: 'hidden',
    marginRight: 15
  },
  containerCheckbox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5
  },
  textHint: {
    fontSize: 10,
    textAlign: 'center',
    color: 'red'
  },
  iconPlay: {
    width: 10,
    height: 10
  },
  wrapperIconPlay: {
    padding: 5,
    marginHorizontal: 10
  },
  containerSound: {
    width: '90%',
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: Colors.greenColorApp,
    paddingHorizontal: 10,
    marginVertical: 5,
    alignSelf: 'center'
  }
});
