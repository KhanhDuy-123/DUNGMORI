import Resource from 'assets/Resource';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import React, { Component } from 'react';
import { Animated, Easing, KeyboardAvoidingView, PanResponder, ScrollView, StyleSheet, View, Modal } from 'react-native';
import { getStatusBarHeight } from 'common/helpers/IPhoneXHelper';
import { connect } from 'react-redux';
import AppAction from 'states/context/actions/AppAction';
import { AppContext } from 'states/context/providers/AppProvider';
import { onShowInput } from 'states/redux/actions/InputCommentAction';
import CommentText from './ItemComment/CommentText';
import InputComment from './InputComment';
import ListReply from './ListReply';
import AppConst from 'consts/AppConst';

const height = Dimension.heightParent;
const width = Dimension.widthParent;
const STATUS_BAR_HEIGHT = getStatusBarHeight();

var modelReply = null;
class ModalReplyComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      item: null,
      objectId: null,
      type: 'lesson'
    };
    this.counReply = 0;
    this.addComment = null;
    this.animatedHeight = new Animated.ValueXY({ x: 0, y: height });
    this.animatedProgress = new Animated.Value(-width);
    this.opacityView = new Animated.Value(1);

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (event, gestureState) => {
        this.animatedHeight.setOffset({ x: this.animatedHeight.x._value, y: 0 });
        this.animatedHeight.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (event, gestureState) => {
        this.animatedHeight.setValue({ x: 0, y: gestureState.dy });
      },
      onPanResponderRelease: (event, gestureState) => {
        this.animatedHeight.flattenOffset();
        if (gestureState.dy < 90) {
          Animated.timing(this.animatedHeight.y, {
            toValue: 0,
            duration: 150,
            easing: Easing.linear
          }).start();
        } else {
          this.onMoveTapDown();
        }
      }
    });
    this.onFocus = false;
  }

  static show = (item, objectId, type) => {
    if (modelReply) modelReply.showModal(item, objectId, type);
    else Funcs.log('Modal reply not instance');
  };

  static hide = () => {
    if (modelReply) modelReply.hideModal();
    else Funcs.log('Modal reply not instance');
  };

  showModal = (item, objectId, type) => {
    this.counReply = item.countReply;
    this.setState({ visible: true, item, objectId, type }, this.onMoveUp);
  };

  hideModal = () => {
    this.setState({ visible: false });
    this.props.onShowInput();
  };

  componentDidMount() {
    modelReply = this;
  }

  componentWillUnmount() {
    modelReply = null;
  }

  onMoveUp = () => {
    Animated.timing(this.animatedHeight.y, {
      toValue: 0,
      duration: 250,
      easing: Easing.linear
    }).start();
  };

  onMoveTapDown = () => {
    Animated.timing(this.animatedHeight.y, {
      toValue: height,
      duration: 300
    }).start(() => {
      this.hideModal();
    });
  };

  onFocusInputComment = () => {};
  onBlurInputComment = () => {
    AppAction.onReplyComment(null);
    this.InputComment.onChangeText('');
  };

  onRequestClose = () => {
    AppAction.onReplyComment(null);
    this.InputComment.onChangeText('');
    this.hideModal();
  };

  onCountReply = (num) => {
    let item = { ...this.state.item };
    item.countReply = num;
    this.counReply = num;
    this.setState({ item });
  };

  renderReplyList = () => {
    var { item } = this.state;
    if (item?.parent_id > 0) return null;
    return (
      <ListReply
        reply={item.reply ? item.reply : []}
        countReply={item.countReply}
        countReplyBefore={item.countReplyBefore}
        parentId={item.id}
        onCountReply={this.onCountReply}
      />
    );
  };

  renderParentItem = () => {
    return (
      <AppContext.Consumer>
        {({ addComment, updateComment }) => {
          let comment = { ...this.state.item };
          if (addComment && this.addComment !== addComment) {
            this.addComment = addComment;
            this.counReply += 1;
          } else if (updateComment && updateComment.id == comment.id) {
            this.counReply = updateComment.countReply;
          }
          comment.countReply = this.counReply;
          return <CommentText item={comment} reply={true} />;
        }}
      </AppContext.Consumer>
    );
  };

  renderContent = () => {
    const { item, objectId, type } = this.state;
    return (
      <View style={styles.container}>
        <Animated.View {...this.panResponder.panHandlers} style={[styles.headerPan, { transform: [{ translateY: this.animatedHeight.y }] }]}>
          <View style={styles.contentPan} />
        </Animated.View>
        <Animated.View style={[styles.content, { transform: [{ translateY: this.animatedHeight.y }] }]}>
          <ScrollView>
            {item && this.renderParentItem()}
            <View style={{ paddingLeft: 50 }}>{item && this.renderReplyList()}</View>
          </ScrollView>
          <InputComment
            ref={(refs) => (this.InputComment = refs)}
            objectId={objectId}
            modalComment
            type={type}
            item={item}
            onFocusInputComment={this.onFocusInputComment}
            onBlurInputComment={this.onBlurInputComment}
            container={{ marginBottom: AppConst.IS_IOS ? 0 : STATUS_BAR_HEIGHT }}
          />
        </Animated.View>
      </View>
    );
  };

  renderForAndroid = () => {
    const { visible } = this.state;
    return (
      <Modal transparent={true} visible={visible} onRequestClose={this.onRequestClose}>
        <KeyboardAvoidingView behavior={'height'} keyboardVerticalOffset={0} style={{ width, height: height }}>
          {this.renderContent()}
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  renderForIos = () => {
    return (
      <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={0} style={styles.containerIos}>
        {this.renderContent()}
      </KeyboardAvoidingView>
    );
  };

  render() {
    const { visible } = this.state;
    if (visible && AppConst.IS_IOS) return this.renderForIos();
    if (AppConst.IS_ANDROID) return this.renderForAndroid();
    return null;
  }
}

const mapDispatchToProps = { onShowInput };

export default connect(
  null,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(ModalReplyComment);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: STATUS_BAR_HEIGHT + 20,
    flex: 1
  },
  content: {
    flex: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#ffffff',
    paddingTop: 10
  },
  wraperHeader: {
    width,
    height: 40,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  indicatorStyle: {
    width,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    position: 'absolute'
  },
  buttonClose: {
    top: 2,
    zIndex: 10
  },
  header: {
    alignSelf: 'center',
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10
  },
  headerPan: {
    width,
    height: 30,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentPan: {
    width: '30%',
    height: 5,
    borderRadius: 5,
    backgroundColor: '#FFFFFF'
  },
  flex: {
    flex: 1
  },
  itemContainer: {
    flex: 1,
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
  },
  containerIos: {
    width,
    height: height + 1,
    position: 'absolute',
    bottom: 0
  }
});
