import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import LoadingModal from 'common/components/base/LoadingModal';
import ItemComment from 'screens/components/comment/ItemComment';
import Const from 'consts/Const';
import React, { Component } from 'react';
import { StyleSheet, View, Keyboard, Clipboard, Alert } from 'react-native';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import PopupMenu from 'common/components/base/PopupMenu';
import ModalEditComent from 'common/components/base/ModalEditComent';
import DropAlert from 'common/components/base/DropAlert';

class CommentFlashCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  async componentDidMount() {
    const { item } = this.props;
    let res = await Fetch.get(
      Const.API.COMMENT.GET_LIST,
      {
        objectId: item.id,
        page: 1,
        type: 'flashcard',
        sortBy: 'like'
      },
      true
    );
    if (res.status === Fetch.Status.SUCCESS) {
      this.setState({ data: res.data.comment }, () => this.props.dataCommentLength(res.data.comment));
    }
  }

  shouldComponentUpdate(nextProps) {
    var { data } = this.state;
    if (nextProps.addComment && this.props.addComment != nextProps.addComment) {
      this.setState({ data: [...data, nextProps.addComment] }, () => this.props.dataCommentLength(this.state.data));
    }

    if (nextProps.updateComment && this.props.updateComment != nextProps.updateComment) {
      data = data.map((item) => {
        if (item.id === nextProps.updateComment.id) {
          item = { ...item, ...nextProps.updateComment };
        }
        return item;
      });
      this.setState({ data });
    }
    return true;
  }

  onPressComment = () => {
    this.props.onModalComment();
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

  onHideKeyboard = () => {
    Keyboard.dismiss();
  };

  onShowMenu = (item) => {
    this.PopupMenu.show(item);
  };

  onPressCopy = async (item) => {
    this.PopupMenu.hide();
    await Clipboard.setString(item.content);
    DropAlert.info('', Lang.comment.text_dropdown);
  };

  onPressEdit = (item) => {
    this.PopupMenu.hide();
    this.timeEdit = setTimeout(() => {
      this.EditComent.showEdit(item);
    }, 500);
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

  render() {
    return (
      <View style={styles.container}>
        <BaseText style={styles.textStyle}>{Lang.flashcard.hint_title_remember}</BaseText>
        {this.state.data.slice(0, 2).map((item) => {
          return (
            <ItemComment
              item={item}
              key={item.id}
              textFlascard={true}
              numberOfLines={3}
              ellipsizeMode="tail"
              onPress={this.onHideKeyboard}
              showMenu={this.onShowMenu}
            />
          );
        })}
        <PopupMenu ref={(refs) => (this.PopupMenu = refs)} onPressDelete={this.onPressDelete} onPressEdit={this.onPressEdit} onPressCopy={this.onPressCopy} />
        <ModalEditComent ref={(refs) => (this.EditComent = refs)} onPressUpdateComent={this.onUpdateComment} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10
  },
  textStyle: {
    fontSize: 11 * Dimension.scale,
    fontWeight: '500',
    textAlign: 'center'
  }
});

export default CommentFlashCard;
