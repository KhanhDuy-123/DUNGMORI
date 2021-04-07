import Lang from 'assets/Lang';
import DropAlert from 'common/components/base/DropAlert';
import Funcs from 'common/helpers/Funcs';
import Const from 'consts/Const';
import React, { Component } from 'react';
import { Clipboard, TouchableOpacity, View } from 'react-native';
import Utils from 'utils/Utils';
import CommentText from './CommentText';
import CommentVoice from './CommentVoice';

export default class ItemComment extends Component {
  constructor(props) {
    super(props);
    var { item } = props;

    // Check item is admin
    if (item.user_id === 0) {
      item.name = 'Dũng Mori';
    }

    if (item.table_name != Const.COURSE_TYPE.KAIWA) {
      // Update end line message
      item.content = item.content.replace(/\\n/g, '\n');

      // User tag
      if (item.tag_data && typeof item.tag_data == 'string') {
        try {
          item.tag_data = item.tag_data.replace(new RegExp("'", 'g'), '"');
          item.tag_data = JSON.parse(item.tag_data);
        } catch (err) {
          Funcs.log(err);
        }
      }
    }

    // State
    this.state = {
      item
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Reply count change
    let { item } = this.state;
    if (nextProps.item.countReply != this.props.item.countReply) {
      item = { ...item };
      item.countReply = nextProps.item.countReply;
    }

    // Update Like
    if (nextProps.item.count_like !== this.props.item.count_like) {
      item = { ...item };
      item.count_like = nextProps.item.count_like;
    }

    // Update Like
    if (nextProps.item.content !== this.props.item.content) {
      item = { ...item };
      item.content = nextProps.item.content;
    }

    // Update Like
    if (nextProps.item.readed !== this.props.item.readed) {
      item = { ...item };
      item.readed = nextProps.item.readed;
    }

    // Update list reply
    if (nextProps.item.reply !== this.props.item.reply) {
      item = { ...item };
      item.reply = nextProps.item.reply;
    }

    //Check focus vao comment
    if (nextProps.item.viewReply !== this.props.item.viewReply) {
      item = { ...item };
      item.viewReply = nextProps.item.viewReply;
    }

    // Check item change
    if (item != this.state.item) {
      this.setState({
        item
      });
    }

    // Render or NOT
    return this.state != nextState;
  }

  componentWillUnmount() {
    clearTimeout(this.timeMenu);
    clearTimeout(this.timeEdit);
    clearTimeout(this.timeOption);
  }

  onShowMenu = async (event) => {
    if (this.props.isTeacherMode) return;
    this.Touchable.setOpacityTo(0.2);
    if (Utils.user.id != this.props.item.user_id) {
      await Clipboard.setString(this.props.item.content);
      DropAlert.info('', Lang.comment.text_dropdown);
    } else {
      this.timeMenu = setTimeout(() => {
        this.props.showMenu(this.state.item);
      }, 200);
    }
  };

  onPressOpenModal = () => {
    this.props.onPressOpenModalRecord(this.props.index);
  };

  setLinkSound = (link) => {
    this.CommentVoice?.setLinkSound(link);
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onLongPress={this.onShowMenu}
          onPress={this.props.onPress}
          activeOpacity={1}
          ref={(refs) => (this.Touchable = refs)}>
          {this.renderItem()}
        </TouchableOpacity>
      </View>
    );
  }

  renderItem() {
    var { item } = this.state;
    const { type, objectId, reply } = this.props;
    if (item.table_name === Const.COURSE_TYPE.KAIWA || type === Const.COURSE_TYPE.KAIWA) {
      return (
        <CommentVoice {...this.props} objectId={objectId} item={item} onPressOpenModal={this.onPressOpenModal} ref={(refs) => (this.CommentVoice = refs)} />
      );
    } else {
      return <CommentText {...this.props} item={item} textFlascard={this.props.textFlascard} objectId={objectId} reply={reply} type={type} />;
    }
  }
}
