import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseEmpty from 'common/components/base/BaseEmpty';
import BaseText from 'common/components/base/BaseText';
import DropAlert from 'common/components/base/DropAlert';
import LoadingModal from 'common/components/base/LoadingModal';
import MenuSort from 'common/components/base/Menu';
import ModalEditComent from 'common/components/base/ModalEditComent';
import PopupMenu from 'common/components/base/PopupMenu';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import Const from 'consts/Const';
import React, { Component } from 'react';
import { ActivityIndicator, Alert, Clipboard, FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import ModalRecord from 'screens/course/lession/DetailLessonScreen/ContentDetailLesson/TabDetailLesson/TabTopLesson/TestLesson/KaiwaNo2/ModalRecord';
import AppContextView from 'states/context/views/AppContextView';
import ItemComment from './ItemComment';
import ModalReplyComment from './ModalReplyComment';

const width = Dimension.widthParent;
const height = Dimension.heightParent;
class ListData extends Component {
  state = {
    data: [],
    hasMoreComment: false,
    loading: true
  };

  indexVoiceComment = 0;

  constructor() {
    super();
    this.cancelFetch = {};
    this.mount = true;
    this.sortBy = 'time';
  }

  async componentDidMount() {
    this.page = 1;
    this.sortBy = 'time';
    if (this.props.dataReply) {
      this.sortBy = 'notify';
    }
    await this.getData(this.page);
    this.setState({
      loading: false
    });
  }

  componentWillUnmount() {
    if (this.cancelFetch.cancel) {
      this.cancelFetch.cancel();
    }
    this.mount = false;
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Add comment
    if (nextProps.addComment && this.props.addComment !== nextProps.addComment) {
      var { data } = this.state;
      this.setState({
        data: [nextProps.addComment, ...data]
      });
    }

    // Delete comment
    if (nextProps.deleteComment && this.props.deleteComment !== nextProps.deleteComment) {
      var { data } = this.state;
      data = data.filter((item) => {
        if (item.id === nextProps.deleteComment.id) {
          return false;
        }
        if (item.reply) {
          item.reply = item.reply.filter((e) => {
            return e.id !== nextProps.deleteComment.id;
          });
        }
        return true;
      });
      this.setState({
        data
      });
    }

    // Update comment
    if (nextProps.updateComment && this.props.updateComment !== nextProps.updateComment) {
      var { data } = this.state;
      data = data.map((item) => {
        if (item.id === nextProps.updateComment.id) {
          item = { ...item, ...nextProps.updateComment };
          if (nextProps.updateComment.deletedReplyId) {
            let reply = item.reply.filter((e) => e.id !== nextProps.updateComment.deletedReplyId);
            item.reply = reply;
          }
        }
        return item;
      });
      this.setState({
        data
      });
    }

    if (nextProps.dataReply !== this.props.dataReply || nextProps.data !== this.props.data) {
      this.sortBy = 'notify';
      this.getData(1);
    }

    // Return render or NOT
    return nextState != this.state;
  }

  getData = async (page = 1) => {
    if (this.props.getData) return this.props.getData(page);
    const { sortBy } = this;
    const { objectId, type, onScrollToComment, dataReply } = this.props;
    let focusCommentId = null;
    let focusReplyId = null;
    if (dataReply && sortBy == 'notify') {
      focusCommentId = dataReply.commentId;
      focusReplyId = dataReply.replyId;
    }

    // get list Comment Kaiwa
    let res = {};
    if (type === Const.COURSE_TYPE.KAIWA) {
      res = await Fetch.get(Const.API.COMMENT.GET_LIST_COMMMENT_KAIWA, { objectId, page }, true, this.cancelFetch);
    } else {
      res = await Fetch.get(Const.API.COMMENT.GET_LIST, { objectId, page, type, focusCommentId, focusReplyId, sortBy }, true, this.cancelFetch);
    }

    // Result
    if (!this.mount) return;
    if (res.status === Fetch.Status.SUCCESS) {
      let { data } = this.state;
      var { comment, itemsPerPage, hasCommentBefore } = res.data;
      if (!comment) return;
      if (Math.abs(page) === 1) {
        data = comment;
      } else if (page > 0) data = [...data, ...comment];
      else data = [...comment, ...data];

      // Parse json reply
      data = data.map((item) => {
        if (!item.reply) return item;
        try {
          if (typeof item.reply !== 'string') return item;
          let reply = JSON.parse(Funcs.jsonEscape(item.reply));
          reply = reply.reverse();
          reply = reply.map((item1) => {
            item1.parent_id = item.id;
            return item1;
          });
          item.reply = reply;
        } catch (err) {
          Funcs.log(err);
          Funcs.log('Reply', item.reply);
        }
        return item;
      });
      // Sort
      if (this.props.dataReply && sortBy == 'notify') {
        for (let i = 0; i <= data.length; i++) {
          let item = { ...data[i] };
          if (item.id == this.props.dataReply.commentId) {
            item.viewReply = true;
            setTimeout(() => {
              ModalReplyComment.show(item, objectId, type);
            }, 500);
            break;
          }
        }
      }

      // UI
      this.setState({
        data,
        hasMoreComment: comment.length > 0 && comment.length >= itemsPerPage,
        hasCommentBefore
      });
    }
    if (onScrollToComment) onScrollToComment();
  };

  addNewComment = (comment) => {
    var { data } = this.state;
    data = [comment, ...data];
    this.setState({
      data
    });
  };

  onPressLoadBeforeComment = async () => {
    if (this.loadingMoreFlag) return;
    if (this.page > 0) this.page = 0;
    this.loadingMoreFlag = true;
    this.page -= 1;

    // UI
    this.setState({
      loadingMore: true
    });

    // Get data
    await this.getData(this.page);

    // UI
    this.setState({
      loadingMore: false
    });
    this.loadingMoreFlag = false;
  };

  onPressMoreComment = async () => {
    if (this.loadingMoreFlag) return;
    this.loadingMoreFlag = true;
    this.page += 1;

    // UI
    this.setState({
      loadingMore: true
    });

    // Get data
    await this.getData(this.page);

    // UI
    this.setState({
      loadingMore: false
    });
    this.loadingMoreFlag = false;
  };

  onPressDeleteComent = async (item) => {
    LoadingModal.show();
    let deleteResponse = await Fetch.post(Const.API.COMMENT.DETLETE_COMENT, { id: item.id }, true);
    LoadingModal.hide();
    if (deleteResponse.status == Fetch.Status.SUCCESS) {
      let data = this.state.data;
      for (var i = 0; i <= data.length; i++) {
        data[i] = { ...data[i] };
        if (data[i].id == item.id) {
          data.splice(i, 1);
          break;
        }
      }
      this.setState({ data });
    } else {
      Funcs.log(`ERROR DELETE COMENT`, deleteResponse.status);
    }
  };

  onPressSortLike = async () => {
    this.Menu.hideMenu();

    // Show loading
    this.setState({
      loading: true
    });

    // Get data
    this.sortBy = 'like';
    await this.getData(1);

    // Hide loading
    this.setState({
      loading: false
    });
  };

  onPressSortNew = async () => {
    this.Menu.hideMenu();

    // Show loading
    this.setState({
      loading: true
    });

    // Get data
    this.sortBy = 'time';
    await this.getData(1);

    // Hide loading
    this.setState({
      loading: false
    });
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

  onPressEdit = (item) => {
    this.PopupMenu.hide();
    this.timeEdit = setTimeout(() => {
      this.EditComent.showEdit(item);
    }, 500);
  };

  onShowMenu = (item) => {
    this.PopupMenu.show(item);
  };

  onPressCopy = async (item) => {
    this.PopupMenu.hide();
    await Clipboard.setString(item.content);
    DropAlert.info('', Lang.comment.text_dropdown);
  };

  onPressOpenModalRecord = (index) => {
    this.indexVoiceComment = index;
    this.ModalRecord.showModal();
  };

  onStopSpeak = (data) => {
    this[`ItemComment${this.indexVoiceComment}`]?.setLinkSound(data);
  };

  renderItem = ({ item, index }) => {
    const { objectId, type, isTeacherMode } = this.props;
    return (
      <ItemComment
        item={item}
        ref={(refs) => (this[`ItemComment${index}`] = refs)}
        index={index}
        objectId={objectId}
        type={type}
        isTeacherMode={isTeacherMode}
        showMenu={this.onShowMenu}
        onPressOpenModalRecord={this.onPressOpenModalRecord}
      />
    );
  };

  renderFooter = () => {
    var { hasMoreComment, loadingMore } = this.state;
    if (!hasMoreComment) return null;
    if (loadingMore) return <ActivityIndicator size="small" color={'gray'} style={styles.indicator} />;
    return (
      <View style={styles.footerContainer}>
        <TouchableOpacity onPress={this.onPressMoreComment}>
          <BaseText style={styles.replyText}>{Lang.comment.load_more_comment}</BaseText>
        </TouchableOpacity>
      </View>
    );
  };

  renderHeader = () => {
    var { hasCommentBefore, loadingMore } = this.state;
    if (!hasCommentBefore) return null;
    if (loadingMore) return <ActivityIndicator size="small" color={'gray'} style={styles.indicator} />;
    return (
      <View style={styles.footerContainer}>
        <TouchableOpacity onPress={this.onPressLoadBeforeComment}>
          <BaseText style={styles.replyText}>{Lang.comment.load_more_before_comment}</BaseText>
        </TouchableOpacity>
      </View>
    );
  };

  renderEmpty() {
    return (
      <View style={{ width, height: height / 1.5 }}>
        <BaseEmpty text={Lang.saleLesson.text_comment_empty} />
      </View>
    );
  }

  renderFilter = () => {
    const { isTeacherMode } = this.props;
    const titleLabel = this.props.type === Const.COURSE_TYPE.KAIWA ? Lang.chooseLession.text_title_reply : Lang.saleLesson.text_comment;
    if (isTeacherMode) return null;
    return (
      <View style={styles.viewtitle}>
        <BaseText style={styles.textCategory}>{titleLabel}</BaseText>
        <MenuSort ref={(refs) => (this.Menu = refs)} onPressSortLike={this.onPressSortLike} onPressSortNew={this.onPressSortNew} />
      </View>
    );
  };

  render() {
    var { data, loading } = this.state;
    return (
      <ScrollView>
        {this.renderFilter()}
        {loading ? (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="small" color={'gray'} />
          </View>
        ) : null}
        {this.renderHeader()}
        {data.length > 0 ? (
          <FlatList keyExtractor={(item) => item.id.toString()} data={data} extraData={this.props || this.state.data} renderItem={this.renderItem} />
        ) : !this.state.loading ? (
          this.renderEmpty()
        ) : null}
        {this.renderFooter()}
        <PopupMenu ref={(refs) => (this.PopupMenu = refs)} onPressDelete={this.onPressDelete} onPressEdit={this.onPressEdit} onPressCopy={this.onPressCopy} />
        <ModalEditComent ref={(refs) => (this.EditComent = refs)} onPressUpdateComent={this.onUpdateComment} />
        <ModalRecord ref={(refs) => (this.ModalRecord = refs)} onStopSpeak={this.onStopSpeak} />
      </ScrollView>
    );
  }
}

export default class ListComment extends AppContextView {
  getListRef = () => {
    return this.refs?.ListData;
  };

  render() {
    let { updateComment, addComment, deleteComment } = this.context || {};
    return (
      <ListData
        ref={'ListData'}
        deleteComment={deleteComment}
        updateComment={updateComment}
        addComment={addComment?.parent_id ? null : addComment}
        {...this.props}
      />
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  replyText: {
    color: Resource.colors.greenColorApp,
    paddingHorizontal: 15,
    fontSize: 13
  },
  footerContainer: {
    margin: 10,
    alignItems: 'center'
  },
  indicator: {
    margin: 10
  },
  viewtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 15
  },
  textCategory: {
    fontSize: 15 * Dimension.scale,
    fontWeight: '500',
    paddingVertical: 5,
    color: Resource.colors.black1
  }
});
