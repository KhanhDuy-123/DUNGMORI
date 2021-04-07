import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import DropAlert from 'common/components/base/DropAlert';
import ImageZoom from 'common/components/base/ImageZoom';
import TextHightLightLink from 'common/components/base/TextHightLightLink';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import Time from 'common/helpers/Time';
import Const from 'consts/Const';
import React from 'react';
import { ActivityIndicator, Animated, Clipboard, Image, Linking, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Utils from 'utils/Utils';

const width = Dimension.widthParent;
export default class ItemChat extends React.Component {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
    this.opacity = new Animated.Value(0);
    this.state = { clickActive: false };
    this.youtube = false;
  }

  moveToTop = () => {
    return Animated.timing(this.animatedValue, { toValue: 20, duration: 200 });
  };

  moveToBottom = () => {
    return Animated.timing(this.animatedValue, { toValue: 0, duration: 200 });
  };

  opacUp = () => {
    return Animated.timing(this.opacity, { toValue: 1, duration: 200 });
  };

  opacDown = () => {
    return Animated.timing(this.opacity, { toValue: 0, duration: 200 });
  };

  shouldComponentUpdate(nextProps) {
    if (nextProps.item.isChoose) {
      Animated.sequence([this.moveToTop(), this.opacUp()]).start();
    } else {
      Animated.sequence([this.moveToBottom(), this.opacDown()]).start();
    }
    return true;
  }

  onPressShowTime = () => {
    const { item } = this.props;
    this.props.onPressShowTime(item);
  };

  onPressZoomImage = (image) => () => {
    ImageZoom.show([image]);
  };

  onLongPress = async () => {
    const { item } = this.props;
    await Clipboard.setString(item.content);
    DropAlert.info('', Lang.comment.text_dropdown);
  };

  onPressLink = (link) => {
    if (this.youtube) {
      const indexV = this.content.indexOf('v=');
      const lastIndex = this.content.indexOf('&');
      let videoID = this.content.substring(indexV + 2);
      if (lastIndex !== -1) {
        videoID = this.content.substring(indexV + 2, lastIndex);
      }
      Linking.openURL('vnd.youtube://' + videoID)
        .then((res) => {
          Funcs.log(res);
        })
        .catch((error) => {
          Funcs.log(error);
        });
    } else {
      this.props.onShowWebView(link);
    }
  };

  renderTextOrlink = (info) => {
    var result = info + '';
    result = result.replace('<', '&#60;');
    result = result.replace('>', '&#62;');

    //xử lý xuống dòng
    result = result.replace(new RegExp('\r?\n', 'g'), '\n');
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
            <TextHightLightLink link={str[i]} onPressDirectLink={this.onPressLink} styles={{ color: 'black' }} />
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
    if (!item.type) return null;
    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <View style={styles.container}>{item.sender_id === Utils.user.id && item.sender_type === 'user' ? this.renderUserChat() : this.renderAdminChat()}</View>
      </TouchableWithoutFeedback>
    );
  }

  //Admin Chat
  renderAdminChat() {
    const { item } = this.props;
    let times = Time.format(Date.now(), 'HH:mm');
    let date = Time.format(Date.now(), 'YYYY-MM-DD');
    return (
      <View style={styles.boxItemChat}>
        <Animated.View style={[styles.dateUser, { height: this.animatedValue, opacity: this.opacity }]}>
          <BaseText style={styles.time}>{date}</BaseText>
        </Animated.View>
        <View style={styles.itemChatAdmin}>
          <View style={styles.contentImage}>
            {item.content == '' ? null : item.type == 'text' ? (
              <TouchableOpacity onPress={this.onPressShowTime} style={styles.boxContentAdmin} onLongPress={this.onLongPress}>
                <BaseText style={styles.textContentAdmin}>{this.renderTextOrlink(item.content)}</BaseText>
              </TouchableOpacity>
            ) : (
              this.renderMessage(item)
            )}
          </View>
          <Animated.View style={[styles.animatedTime, { height: this.animatedValue, opacity: this.opacity }]}>
            <BaseText style={styles.time}>{times}</BaseText>
          </Animated.View>
        </View>
      </View>
    );
  }

  // UserChat
  renderUserChat() {
    let date = Time.format(Date.now(), 'YYYY-MM-DD');
    return (
      <View style={styles.itemChatUser}>
        <Animated.View style={[styles.dateUser, { height: this.animatedValue, opacity: this.opacity }]}>
          <BaseText style={styles.textDate}>{date}</BaseText>
        </Animated.View>
        {this.renderContent()}
      </View>
    );
  }

  renderContent() {
    const { item } = this.props;
    let times = Time.format(Date.now(), 'HH:mm');
    if (item && item.content && item.type == 'text') {
      return (
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={this.onPressShowTime}
          onLongPress={this.onLongPress}
          activeOpacity={0.6}>
          <Animated.View style={[styles.animatedStyle, { height: this.animatedValue, opacity: this.opacity }]}>
            <BaseText style={styles.time}>{times}</BaseText>
          </Animated.View>
          {this.renderTextOrIcon(item)}
        </TouchableOpacity>
      );
    } else {
      return this.renderImage(item);
    }
  }

  // Render list image
  renderImage = (item) => {
    return (
      <TouchableOpacity onPress={this.onPressShowTime} activeOpacity={0.6}>
        <View style={styles.wrapperImage}>
          {item.isSent ? (
            <Icon style={styles.iconActivity} name={'ios-checkmark-circle-outline'} size={16} color={Resource.colors.inactiveButton} />
          ) : item.received ? (
            <Icon style={styles.iconActivity} name={'ios-checkmark-circle'} size={16} color={Resource.colors.inactiveButton} />
          ) : null}
          {this.renderMessage(item)}
        </View>
      </TouchableOpacity>
    );
  };

  renderMessage = (item) => {
    if (item && item.content == '') {
      return null;
    } else {
      return (
        item.content &&
        Array.isArray(item.content) &&
        item.content.map((value, index) => {
          const styleImage = item.content.length === 1;
          const avatarImage = item && item.isLocal ? value : Const.RESOURCE_URL.CONVERSATION.DEFAULT + value;
          return (
            <TouchableOpacity onPress={this.onPressZoomImage(avatarImage)} key={index} activeOpacity={0.6}>
              <View key={index} style={styleImage ? styles.viewAloneImage : styles.viewMoreImage}>
                {item.isSent || item.received || item.sender_type == 'admin' ? (
                  <Image source={{ uri: avatarImage }} style={styleImage ? styles.aloneImage : styles.moreImage} />
                ) : (
                  <View key={index} style={styleImage ? styles.aloneImages : styles.moreImages}>
                    <ActivityIndicator style={{ color: '#000' }} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })
      );
    }
  };

  // Render text and icon
  renderTextOrIcon = (item) => {
    if (item.content.length === 2 ? Const.EMOJI_LIST.indexOf(item.content) > -1 : null) {
      return (
        <View style={styles.aloneEmoji}>
          <BaseText selectable={true} style={styles.iconLike}>
            {item.content}
          </BaseText>
        </View>
      );
    } else {
      return (
        <View style={styles.content}>
          {item.status == 1 ? (
            <BaseText style={styles.readText}>{Lang.comment.text_read}</BaseText>
          ) : item.isSent ? (
            <Icon style={styles.iconActivity} name={'ios-checkmark-circle-outline'} size={15} color={Resource.colors.inactiveButton} />
          ) : null}
          <View style={item.isSent || item.received ? styles.boxContent : styles.boxContents}>
            <BaseText style={styles.textContent}>{this.renderTextOrlink(item.content)}</BaseText>
          </View>
        </View>
      );
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  itemChatUser: {
    flex: 1,
    marginTop: 15,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  animatedStyle: {
    marginRight: 10,
    justifyContent: 'flex-end'
  },
  dateUser: {
    width: width - 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textDate: {
    fontSize: 11 * Dimension.scale,
    color: Resource.colors.black3,
    textAlign: 'center'
  },
  boxItemChat: {
    marginTop: 15
  },
  itemChatAdmin: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  contentImage: {
    maxWidth: width * 0.7,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center'
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  animatedTime: {
    marginLeft: 15 * Dimension.scale
  },
  readText: {
    fontSize: 12,
    marginRight: 4
  },
  time: {
    fontSize: 12 * Dimension.scale,
    color: Resource.colors.black3
  },
  timeAdmin: {
    fontSize: 12 * Dimension.scale,
    color: Resource.colors.black3,
    marginLeft: 15
  },
  boxContent: {
    maxWidth: width / 1.5,
    paddingHorizontal: 17 * Dimension.scale,
    paddingVertical: 10 * Dimension.scale,
    borderRadius: 20 * Dimension.scale,
    backgroundColor: Resource.colors.greenColorApp
  },
  boxContents: {
    maxWidth: width / 1.5,
    paddingHorizontal: 17 * Dimension.scale,
    paddingVertical: 10 * Dimension.scale,
    borderRadius: 20 * Dimension.scale,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Resource.colors.greenColorApp,
    opacity: 0.4
  },
  boxContentAdmin: {
    maxWidth: width / 1.5,
    paddingHorizontal: 17 * Dimension.scale,
    paddingVertical: 10 * Dimension.scale,
    borderRadius: 20 * Dimension.scale,
    borderWidth: 1,
    borderColor: Resource.colors.border
  },
  textContent: {
    fontSize: 12 * Dimension.scale,
    color: Resource.colors.white100
  },
  textContentAdmin: {
    fontSize: 12 * Dimension.scale,
    color: Resource.colors.black1
  },
  aloneEmoji: {
    height: 100 * Dimension.scale
  },
  iconLike: {
    fontSize: 60 * Dimension.scale
  },
  wrapperImage: {
    width: width / 1.5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  aloneImage: {
    width: 185 * Dimension.scale,
    height: 220 * Dimension.scale,
    borderRadius: 10
  },
  aloneImages: {
    width: 185 * Dimension.scale,
    height: 220 * Dimension.scale,
    borderRadius: 10 * Dimension.scale,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewMoreImage: {
    margin: 1 * Dimension.scale
  },
  moreImage: {
    width: 60 * Dimension.scale,
    height: 60 * Dimension.scale,
    borderRadius: 7 * Dimension.scale
  },
  moreImages: {
    width: 60 * Dimension.scale,
    height: 60 * Dimension.scale,
    borderRadius: 7 * Dimension.scale,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconActivity: {
    marginRight: 7
  }
});
