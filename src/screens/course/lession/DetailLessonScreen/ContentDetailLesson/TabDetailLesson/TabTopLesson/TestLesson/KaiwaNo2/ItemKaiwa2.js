import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import ModalWebView from 'common/components/base/ModalWebView';
import TextHightLightLink from 'common/components/base/TextHightLightLink';
import Funcs from 'common/helpers/Funcs';
import Const from 'consts/Const';
import React, { PureComponent } from 'react';
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Video from 'react-native-video';
import Utils from 'utils/Utils';
import SoundComment from 'screens/components/comment/ItemComment/SoundComment';
import Colors from 'assets/Colors';

export default class ItemKaiwa2 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      paused: true
    };
    this.youtube = false;
  }

  onPressOpentModal = () => {
    this.props.openModal(this.props.item.content);
  };

  onEndPlaySound = () => {
    this.setState({ paused: true }, () => {
      this.SoundPlayer.seek(0);
    });
  };

  onPressPlaySound = () => {
    let paused = this.state.paused;
    this.setState({ paused: !paused }, () => {
      if (!this.state.paused) this.props.onHideCorrect();
    });
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

  renderTextOrlink = (info) => {
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
            <TextHightLightLink link={str[i]} onPressDirectLink={this.onPressLink} />
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

  render() {
    const { item } = this.props;
    const { paused } = this.state;
    const isAsk = item && item.user_id == Utils.user.id;
    let source = Resource.images.icKaiwaComent;
    if (isAsk) {
      if (item.avatar) {
        source = { uri: Const.RESOURCE_URL.AVATAR.SMALL + item.avatar };
      } else {
        source = Resource.images.icAvatar;
      }
    } else {
      source = Resource.images.icKaiwaComent;
    }
    let disable = true;
    let textDecorationLine = 'none';
    if (!item.audio) {
      let content = item.content.split('//');
      if (content[0] == 'http:' || content[0] == 'https:') {
        disable = false;
        textDecorationLine = 'underline';
      }
    }
    let iconName = 'playcircleo';
    if (paused) {
      iconName = 'playcircleo';
    } else {
      iconName = 'pausecircleo';
    }
    return (
      <View style={styles.wrapperItem}>
        {!isAsk ? (
          <View>
            {/*Coment text or coment voice */}
            <View style={styles.content}>
              <FastImage source={source} style={styles.avt} />
              <View style={styles.wrapperAudioText}>
                {item.audio ? (
                  <SoundComment
                    link={Const.RESOURCE_URL.COMMENT.KAIWA + item.audio}
                    style={styles.comment}
                    textTime={{ color: Resource.colors.greenColorApp }}
                  />
                ) : null}
                {item.content ? (
                  <View style={[styles.textComment, item.audio ? styles.viewTextAndAudio : null]}>
                    <BaseText style={{ color: '#FFFFFF', fontSize: 13, textDecorationLine }}>{this.renderTextOrlink(item.content)}</BaseText>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        ) : (
          <View style={{ alignItems: 'flex-end' }}>
            <View style={[styles.content, { justifyContent: 'flex-end' }]}>
              <SoundComment
                link={Const.RESOURCE_URL.COMMENT.KAIWA + item.audio}
                style={[styles.comment, { width: '65%' }]}
                textTime={{ color: Resource.colors.greenColorApp }}
              />
              {item.is_correct == '1' || item.is_correct == 1 ? (
                <View>
                  <Video
                    source={{ uri: Const.RESOURCE_URL.COMMENT.KAIWA + item.link_correct }}
                    audioOnly={true}
                    volume={1.0}
                    paused={paused}
                    ref={(refs) => (this.SoundPlayer = refs)}
                    onEnd={this.onEndPlaySound}
                  />
                  <TouchableOpacity style={styles.buttonCheck} onPress={this.onPressPlaySound}>
                    <AntDesign name={iconName} size={35} color="#D3AE4E" />
                  </TouchableOpacity>
                </View>
              ) : null}
              <FastImage source={source} style={[styles.avt, { marginRight: 0, marginLeft: 10 }]} />
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperItem: {
    flex: 1,
    paddingHorizontal: 15,
    marginBottom: 20
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avt: {
    width: 40,
    aspectRatio: 1 / 1,
    borderRadius: 100,
    marginRight: 10,
    borderWidth: 0.5
  },
  textName: {
    marginTop: 10,
    color: 'red'
  },
  soundComent: {
    width: '70%',
    backgroundColor: Resource.colors.bgcSound,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 10,
    marginRight: 10,
    height: 35
  },
  comment: {
    backgroundColor: Resource.colors.greenColorApp,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 10,
    height: 35
  },
  textComment: {
    // backgroundColor: Resource.colors.greenColorApp,
    // maxWidth: '75%',
    backgroundColor: 'rgba(65, 163, 54, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 10,
    minHeight: 35,
    paddingVertical: 10
  },
  textViewMoreComent: {
    alignSelf: 'flex-end',
    marginRight: 20,
    color: Resource.colors.greenColorApp,
    fontSize: 15,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    marginVertical: 10
  },
  wrapLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  areaViewSuggest: {
    width: 200,
    height: 50,
    position: 'absolute',
    top: -50,
    left: -110,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  send: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 25,
    backgroundColor: '#E1E1E1',
    borderRadius: 25,
    paddingHorizontal: 12
  },
  textSuggest: {
    fontSize: 13,
    color: '#414141'
  },
  triagle: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 10,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#E1E1E1'
  },
  buttonCheck: {
    width: 36,
    aspectRatio: 1 / 1,
    borderColor: '#D3AE4E',
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewTextAndAudio: {
    backgroundColor: 'rgba(0,0,0, 0)',
    borderRadius: 0,
    width: '100%',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25
  },
  wrapperAudioText: {
    flex: 1,
    backgroundColor: 'rgba(65, 163, 54, 0.7)',
    borderRadius: 25
  }
});
