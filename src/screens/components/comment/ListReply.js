import Resource from 'assets/Resource';
import BaseButton from 'common/components/base/BaseButton';
import BaseText from 'common/components/base/BaseText';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import React, { Component } from 'react';
import { FlatList, StyleSheet, View, ActivityIndicator, Clipboard, Alert } from 'react-native';
import Const from 'consts/Const';
import ItemComment from './ItemComment';
import Lang from 'assets/Lang';
import LoadingModal from 'common/components/base/LoadingModal';
import AppAction from 'states/context/actions/AppAction';
import AppContextView from 'states/context/views/AppContextView';
import PopupMenu from 'common/components/base/PopupMenu';
import ModalEditComent from 'common/components/base/ModalEditComent';
import DropAlert from 'common/components/base/DropAlert';

class ListDataReply extends Component {
  constructor(props) {
    super(props);

    // Parse reply
    var data = props.reply;
    let updateComment = props.updateComment;
    if (updateComment) {
      for (let i = 0; i < data.length; i++) {
        let item = { ...data[i] };
        if (item.id == updateComment.id) {
          item = { ...item, ...updateComment };
        }
        data[i] = item;
      }
    }
    this.state = {
      data,
      loadingMore: false,
      countReply: data.length,
      countReplyBefore: 0
    };

    // Local var
    this.firstId = data && data.length > 0 ? data[0].id : null;
    this.lastId = data && data.length > 0 ? data[data.length - 1].id : null;
    this.page = 0;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.addComment && this.props.addComment != nextProps.addComment && nextProps.addComment?.parent_id === nextProps.parentId) {
      let { data, countReply } = this.state;
      data = [...data, nextProps.addComment];
      this.setState({
        data,
        countReply: countReply + 1
      });
    }

    // Add reply
    if (nextProps.replyComment && nextProps.replyComment !== this.props.replyComment) {
      let { data, countReply } = this.state;
      data = [...data, nextProps.replyComment];
      this.setState({
        data,
        countReply: countReply + 1
      });
    }

    // Update comment
    if (nextProps.updateComment && this.props.updateComment != nextProps.updateComment) {
      var { data } = this.state;
      data = data.map((item) => {
        if (item.id === nextProps.updateComment.id) {
          item = { ...item, ...nextProps.updateComment };
        }
        return item;
      });
      this.setState({
        data
      });
    }

    // Delete comment
    if (nextProps.deleteComment && this.props.deleteComment != nextProps.deleteComment) {
      var { data } = this.state;
      data = data.filter((item) => item.id !== nextProps.deleteComment.id);
      this.setState({
        data
      });
    }
    return nextState != this.state;
  }

  componentDidMount() {
    if (this.props.reply.length <= 1) {
      const { data } = this.state;
      this.lastId = data && data.length > 0 ? data[data.length - 1].id : null;
      this.page += 1;
      this.getData();
    }
  }

  getData = async () => {
    var { data, countReply, countReplyBefore } = this.state;
    let { parentId } = this.props;
    var res = await Fetch.get(
      Const.API.COMMENT.GET_REPLY,
      {
        commentId: parentId,
        page: this.page,
        headId: this.page > 0 ? this.firstId : this.lastId
      },
      true
    );
    if (res.status === 200) {
      var replyNew = res.data.reply;
      if (this.page > 0) {
        data = [...replyNew.reverse(), ...data];
        countReply += replyNew.length;
      } else {
        data = [...data, ...replyNew];
        countReplyBefore += replyNew.length;
      }
      this.setState({
        data,
        countReply,
        countReplyBefore
      });
    }
  };

  onPressLoadReply = async () => {
    // Update UI
    this.setState({
      loadingMore: true
    });

    // Request
    if (this.page < 0) this.page = 0;
    this.page += 1;
    await this.getData();

    // Update UI
    this.setState({
      loadingMore: false
    });
  };

  onPressLoadReplyBefore = async () => {
    // Update UI
    this.setState({
      loadingMoreBefore: true
    });

    // Request
    if (this.page > 0) this.page = 0;
    this.page -= 1;
    await this.getData();

    // Update UI
    this.setState({
      loadingMoreBefore: false
    });
  };

  onPressDeleteComent = async (item) => {
    LoadingModal.show();
    let deleteResponse = await Fetch.post(Const.API.COMMENT.DETLETE_COMENT, { id: item.id }, true);
    LoadingModal.hide();
    if (deleteResponse.status == Fetch.Status.SUCCESS) {
      let { data } = this.state;
      data = data.filter((item1) => item.id != item1.id);

      // Update count reply parent item
      let { parentId, countReply } = this.props;
      if (!countReply) countReply = 0;
      countReply -= 1;
      if (countReply < 0) countReply = 0;
      AppAction.onAddComment(null);
      AppAction.onUpdateComment({
        id: parentId,
        countReply,
        deletedReplyId: item.id
      });

      this.props.onCountReply(countReply);

      // Update UI
      this.setState({ data, countReply }, () => {
        if (data.length <= 1) {
          this.lastId = data && data.length > 0 ? data[data.length - 1].id : null;
          this.page += 1;
          this.getData();
        }
      });
    } else {
      Funcs.log(`ERROR DELETE COMENT`, deleteResponse.status);
    }
  };

  onUpdateComment = async (id, content) => {
    LoadingModal.show();
    let updateResponse = await Fetch.post(
      Const.API.COMMENT.EDIT_COMENT,
      {
        id,
        content
      },
      true
    );
    LoadingModal.hide();
    if (updateResponse.status == Fetch.Status.SUCCESS) {
      let data = this.state.data;
      for (var i = 0; i <= data.length; i++) {
        if (data[i].id == id) {
          data[i] = { ...data[i] };
          data[i].content = content;
          break;
        }
      }
      this.setState({ data });
      // AppAction.onUpdateComment({ id, content });
    } else {
      Funcs.log(`ERROR Upate COMENT`, updateResponse.status);
    }
    this.EditComent.hideEdit();
  };

  onPressEdit = (item) => {
    this.PopupMenu.hide();
    this.timeEdit = setTimeout(() => {
      this.EditComent.showEdit(item);
    }, 500);
  };

  onPressCopy = async (item) => {
    this.PopupMenu.hide();
    await Clipboard.setString(item.content);
    DropAlert.info('', Lang.comment.text_dropdown);
  };

  onShowMenu = (item) => {
    this.PopupMenu.show(item);
  };

  onPressDelete = async (item) => {
    this.PopupMenu.hide();
    this.timeOption = setTimeout(() => {
      Alert.alert(
        '',
        Lang.popupMenu.text_ask,
        [
          {
            text: Lang.popupMenu.text_agree,
            onPress: () => {
              this.onPressDeleteComent(item);
            }
          },
          { text: Lang.popupMenu.text_cancel }
        ],
        { cancelable: true }
      );
    }, 500);
  };

  renderItem = ({ item, index }) => {
    return <ItemComment item={item} showMenu={this.onShowMenu} type={this.props.type} reply={true} isTeacherMode={this.props.isTeacherMode} />;
  };

  renderHeader = () => {
    var { data, loadingMore } = this.state;
    if (!data || !this.props.countReply || data?.length >= this.props.countReply) return null;
    if (loadingMore) return <ActivityIndicator size="small" color={'gray'} style={styles.indicator} />;
    return (
      <BaseButton onPress={this.onPressLoadReply} style={styles.buttonLoadMore}>
        <BaseText style={styles.butonText}>{Lang.comment.load_more_reply}</BaseText>
      </BaseButton>
    );
  };

  renderFooter = () => {
    var { data, countReplyBefore, loadingMoreBefore } = this.state;
    if (!data || !this.props.countReplyBefore || countReplyBefore >= this.props.countReplyBefore) return null;
    if (loadingMoreBefore) return <ActivityIndicator size="small" color={'gray'} style={styles.indicator} />;
    return (
      <BaseButton onPress={this.onPressLoadReplyBefore} style={styles.buttonLoadMore}>
        <BaseText style={styles.butonText}>{Lang.comment.load_more_before_reply}</BaseText>
      </BaseButton>
    );
  };

  render() {
    var { data } = this.state;
    if (!data || data.length < 1) return null;
    console.log('###########data', data);
    return (
      <View>
        {this.renderHeader()}
        <FlatList keyExtractor={(item) => item?.id?.toString()} data={data} extraData={this.props} renderItem={this.renderItem} />
        {this.renderFooter()}
        <PopupMenu ref={(refs) => (this.PopupMenu = refs)} onPressDelete={this.onPressDelete} onPressEdit={this.onPressEdit} onPressCopy={this.onPressCopy} />
        <ModalEditComent ref={(refs) => (this.EditComent = refs)} onPressUpdateComent={this.onUpdateComment} />
      </View>
    );
  }
}

export default class ListReply extends AppContextView {
  render() {
    let { parentId } = this.props;
    let { addComment, updateComment, replyComment, deleteComment } = this.context;
    var addCommentData = addComment && addComment.parent_id && addComment.parent_id === parentId ? addComment : null;
    return (
      <ListDataReply {...this.props} deleteComment={deleteComment} replyComment={replyComment} addComment={addCommentData} updateComment={updateComment} />
    );
  }
}

const styles = StyleSheet.create({
  butonText: {
    color: Resource.colors.primaryColor,
    fontSize: 13
  },
  buttonLoadMore: {
    padding: 10,
    alignItems: 'center'
  },
  indicator: {
    margin: 8
  }
});
