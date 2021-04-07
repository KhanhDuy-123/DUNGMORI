import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseButton from 'common/components/base/BaseButton';
import BaseText from 'common/components/base/BaseText';
import ImageZoom from 'common/components/base/ImageZoom';
import ModalWebView from 'common/components/base/ModalWebView';
import TextHightLightLink from 'common/components/base/TextHightLightLink';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import Time from 'common/helpers/Time';
import Const from 'consts/Const';
import React, { Component } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import AppAction from 'states/context/actions/AppAction';
import { onHideInput } from 'states/redux/actions/InputCommentAction';
import ListReply from '../ListReply';
import ModalReplyComment from '../ModalReplyComment';
import Entities from 'html-entities';
const entities = new Entities.AllHtmlEntities();

class CommentText extends Component {
  constructor(props) {
    super(props);
    var { item } = props;
    let { content } = item;

    // State
    content = entities.decode(content);
    this.state = {
      liked: item?.liked > 0,
      viewReply: item.viewReply ? item.viewReply : false,
      contentList: this.convertContentToList(content)
    };
    this.youtube = false;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.item.viewReply !== this.props.item.viewReply) {
      this.setState({ viewReply: nextProps.item.viewReply ? nextProps.item.viewReply : false });
    }
    if (nextProps.item.content !== this.props.item.content) {
      this.setState({ contentList: this.convertContentToList(nextProps.item.content) });
    }
    return nextState !== this.state || nextProps.item !== this.props.item;
  }

  componentWillUnmount() {
    clearTimeout(this.reply);
    clearTimeout(this.viewReply);
  }

  convertContentToList = (content) => {
    // Check email
    content = content.replace(new RegExp('\r?\n', 'g'), '\n');

    // Check link,
    var re = /((?:ftp|http|https):\/\/(?:\w+:{0,1}\w*@)?(?:\S+)(?::[0-9]+)?(?:\/|\/(?:[\w#!:.?+=&%@!-/]))?)/;
    let str = content.split(re);
    const contentList = [];
    for (let i = 0; i < str.length; i++) {
      if (!str[i]) continue;
      let value = str[i];
      let prefix = str[i].split('//')[0];
      if (prefix == 'http:' || prefix == 'https:' || prefix == 'ftp:') {
        let youtubeSplit = content[1].split('.');
        if (youtubeSplit[1] == 'youtube') {
          this.youtube = true;
          this.contentLink = youtubeSplit[2];
        }
        contentList.push({ type: 1, value });
      } else {
        // Check email
        const regex = /\S+[a-z0-9]@[a-z0-9\.]+/gim;
        const emails = value.match(regex);
        const emailHiddens = emails?.map((e) => {
          const index = e.indexOf('@');
          const newEmailName = new Array(3).fill('*');
          return e.substr(0, index - 3) + newEmailName.join('') + e.substr(index);
        });
        if (emailHiddens?.length > 0) {
          for (let j = 0; j < emails.length; j += 1) {
            value = value.replace(emails[j], emailHiddens[j]);
          }
        }

        // Check phone
        let phones = value.match(/[0-9]+/gim);
        phones = phones?.filter((item) => item.length > 4);
        const phoneHiddens = phones?.map((e) => {
          const newEmailName = new Array(3).fill('*');
          return e.substr(0, e.length - 4) + newEmailName.join('');
        });
        if (phoneHiddens?.length > 0) {
          for (let j = 0; j < phoneHiddens.length; j += 1) {
            value = value.replace(phones[j], phoneHiddens[j]);
          }
        }
        contentList.push({ type: 0, value });
      }
    }
    return contentList;
  };

  onPressTooggleViewReply = () => {
    this.props.onHideInput();
    let params = { ...this.props.item };
    if (this.state.liked) params.liked = 1;
    ModalReplyComment.show(params, this.props.objectId, this.props.type);
    var item = { ...this.props.item };

    // Nếu bấm vào trả lời của 1 reply item => Sẽ chuyển thành trả lời của commnent cha
    if (item?.parent_id > 0) {
      item.id = item.parent_id;
    }
    // AppAction.onReplyComment(item);
    this.viewReply = setTimeout(() => {
      AppAction.onSaveParentId(item);
    }, 500);
  };

  onPressImage = () => {
    var { item } = this.props;
    const image = item.img ? Const.RESOURCE_URL.COMMENT.DEFAULT + item.img : null;
    ImageZoom.show([image]);
  };

  onPressReply = () => {
    let item = { ...this.props.item };
    this.props.onHideInput();
    if (this.props.reply) {
      // Nếu bấm vào trả lời của 1 reply item => Sẽ chuyển thành trả lời của commnent cha
      if (item?.parent_id > 0) {
        item.id = item.parent_id;
      }
      AppAction.onReplyComment(item);
      AppAction.onSaveParentId(item);
    } else {
      this.reply = setTimeout(() => {
        let params = item;
        if (this.state.liked) item.liked = 1;
        ModalReplyComment.show(params, this.props.objectId, this.props.type);

        // Nếu bấm vào trả lời của 1 reply item => Sẽ chuyển thành trả lời của commnent cha
        if (item?.parent_id > 0) {
          item.id = item.parent_id;
        }
        AppAction.onReplyComment(item);
        AppAction.onSaveParentId(item);
      }, 500);
    }
  };

  onPressLike = async () => {
    this.setState({
      liked: true
    });
    let { item } = this.props;
    let res = await Fetch.post(Const.API.COMMENT.LIKE, { id: item.id }, true);
    if (res && res.status === 200) {
      let like = res.data.countLike;
      AppAction.onUpdateComment({
        id: item.id,
        liked: 1,
        count_like: like
      });
    }
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

  onLayout = ({ nativeEvent }) => {
    this.setState({
      height: nativeEvent.layout.height
    });
  };

  renderText = () => {
    var { contentList } = this.state;
    return contentList.map((text, index) =>
      text.type === 0 ? (
        <BaseText key={index} style={{ fontSize: 12 * Dimension.scale }}>
          {text.value}
        </BaseText>
      ) : (
        <TextHightLightLink
          key={index}
          link={text.value}
          onPressDirectLink={this.onPressLink}
          styles={{ fontSize: 12 * Dimension.scale, color: Resource.colors.greenColorApp }}
        />
      )
    );
  };

  renderReplyList = () => {
    var { item } = this.props;
    if (item?.parent_id > 0) return null;
    return <ListReply reply={item.reply} countReply={item.countReply} countReplyBefore={item.countReplyBefore} parentId={item.id} />;
  };

  render() {
    var { item, reply } = this.props;
    var { liked, viewReply, height } = this.state;
    var isReply = item?.parent_id > 0;
    const typeCard = item.table_name == 'flashcard';
    const countReply = item.countReply ? item.countReply : 0 + item.countReplyBefore ? item.countReplyBefore : 0;
    const textReply = (countReply > 0 ? countReply + ' ' : '') + Lang.comment.reply;
    const styleContainer = isReply || typeCard ? {} : { borderBottomWidth: 0.6, paddingTop: 8, paddingLeft: 15 };
    const image = item.img ? Const.RESOURCE_URL.COMMENT.SMALL + item.img : null;
    let titleViewRep = !viewReply ? Lang.comment.text_view_rep : Lang.comment.text_collapsi;
    let avatarSource = Resource.images.icAvatar;
    if (item.user_id == 0) {
      avatarSource = Resource.images.icAdmin;
    } else {
      if (item.avatar) {
        avatarSource = { uri: Const.RESOURCE_URL.AVATAR.SMALL + item.avatar };
      } else {
        avatarSource = Resource.images.icAvatar;
      }
    }
    return (
      <View style={{ ...styles.itemContainer, ...styleContainer, height }} onLayout={this.onLayout}>
        <FastImage source={avatarSource} style={isReply ? styles.avatarSmall : styles.avatar} />
        <View style={{ ...styles.itemContentContainer, minHeight: this.props.textFlascard ? 90 : 0 }}>
          <View style={styles.containerName}>
            <BaseText style={styles.textName}>{item.name}</BaseText>
            <Entypo name={'dot-single'} size={10} color={Resource.colors.black9} />
            <BaseText style={styles.titleText}>{Time.fromNow(item.created_at)}</BaseText>
          </View>
          <BaseText {...this.props} style={{ ...styles.contentText, width: this.props.textFlascard ? 200 * Dimension.scale : null }}>
            {item.tag_data && item.tag_data.name ? <BaseText style={styles.contentTagText}>{`${item.tag_data.name} `}</BaseText> : null}
            {this.renderText()}
          </BaseText>
          {image ? (
            <View style={styles.containerImage}>
              <BaseButton style={styles.buttonImageUpload} onPress={this.onPressImage}>
                <FastImage source={{ uri: image }} style={styles.image} resizeMode="contain" />
              </BaseButton>
            </View>
          ) : null}
          <View style={styles.buttonContainer}>
            {/* Button like, reply */}
            <View style={styles.buttonContainerLeft}>
              <BaseButton style={styles.button} onPress={this.onPressLike} disabled={liked}>
                <BaseText
                  style={{
                    fontWeight: liked ? 'bold' : 'normal',
                    paddingVertical: 5,
                    color: Resource.colors.greenColorApp
                  }}>
                  {liked ? Lang.comment.liked : Lang.comment.like}
                </BaseText>
              </BaseButton>
              {typeCard ? null : (
                <BaseButton style={styles.button} onPress={this.onPressReply}>
                  <BaseText style={{ color: 'gray', paddingVertical: 5 }}>{textReply}</BaseText>
                </BaseButton>
              )}
              {reply ? null : item.reply ? (
                <BaseText style={styles.textLike} onPress={this.onPressTooggleViewReply}>
                  {titleViewRep}
                </BaseText>
              ) : null}
            </View>

            {/* Count like */}
            {item.count_like > 0 ? (
              <View style={styles.buttonContainerLeft}>
                <AntDesign name={'like1'} size={14} color={Resource.colors.greenColorApp} />
                <BaseText style={styles.textLike}>{this.props.item.count_like}</BaseText>
              </View>
            ) : null}
          </View>
          {/* {viewReply ? this.renderReplyList() : null} */}
        </View>
      </View>
    );
  }
}

const mapDispatchToProp = { onHideInput };

export default connect(
  null,
  mapDispatchToProp,
  null,
  { forwardRef: true }
)(CommentText);

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  itemContainer: {
    borderColor: Resource.colors.border,
    flexDirection: 'row',
    paddingRight: 15,
    paddingLeft: 5,
    paddingTop: 7
  },
  itemContentContainer: {
    flex: 1,
    marginLeft: 10
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 0.7,
    borderColor: Resource.colors.border
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 12,
    borderWidth: 0.7,
    borderColor: Resource.colors.border
  },
  titleText: {
    fontSize: 13,
    color: Resource.colors.black7
  },
  contentText: {
    fontSize: 15
  },
  contentTagText: {
    fontSize: 15,
    fontWeight: '600'
  },
  butonText: {
    color: Resource.colors.primaryColor,
    fontSize: 13
  },
  containerName: {
    flexDirection: 'row',
    marginBottom: 3,
    alignItems: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 5,
    paddingTop: 3
  },
  buttonContainerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  button: {
    marginRight: 10
  },
  buttonLoadMore: {
    padding: 10
  },
  textLike: {
    paddingLeft: 2,
    paddingVertical: 5,
    color: Resource.colors.greenColorApp,
    fontSize: 13
  },
  image: {
    width: 60,
    height: 60
  },
  containerImage: {
    flexDirection: 'row'
  },
  textName: {
    fontSize: 13,
    color: '#000000',
    fontWeight: 'bold'
  }
});
