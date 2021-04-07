import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseNoInternet from 'common/components/base/BaseNoInternet';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import LoginRequire from 'common/components/base/LoginRequire';
import ModalWebView from 'common/components/base/ModalWebView';
import PhotoSelect from 'common/components/photo/PhotoSelect';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import { isIphoneX } from 'common/helpers/IPhoneXHelper';
import Time from 'common/helpers/Time';
import OneSignalService from 'common/services/OneSignalService';
import SocketService from 'common/services/SocketService';
import Const from 'consts/Const';
import UrlConst from 'consts/UrlConst';
import moment from 'moment';
import React from 'react';
import { ActivityIndicator, FlatList, Keyboard, KeyboardAvoidingView, Linking, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import RNOneSignal from 'react-native-onesignal';
import { connect } from 'react-redux';
import AppContextView from 'states/context/views/AppContextView';
import Configs from 'utils/Configs';
import Utils from 'utils/Utils';
import { onCountConversation } from '../../states/redux/actions/CountNotiAction';
import InputChat from './containers/InputChat';
import ItemChat from './containers/ItemChat';
import ListSticker from './containers/ListSticker';
import WelcomeChat from './containers/WelcomeChat';

let keyboardOffset = 30;
if (Platform.OS === 'android') {
  keyboardOffset = -500;
} else {
  if (isIphoneX()) {
    keyboardOffset = 40;
  } else {
    keyboardOffset = 10;
  }
}

class ChatScreen extends AppContextView {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      question: {},
      dataImage: [],
      showEmojPicker: false,
      loadingMore: false,
      isActivity: false,
      hasMoreChat: false,
      isTyping: false
    };
    this.page = 1;
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      RNOneSignal.inFocusDisplaying(0);
    });
    this.props.navigation.addListener('willBlur', () => {
      RNOneSignal.inFocusDisplaying(2);
    });
    const { user } = this.props;
    if (!user || !user.id) return;
    this.init();
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Khi có thông tin user và chưa khởi tạo thì bắt đầu khởi tạo lại
    const { user } = nextProps;
    if (!this.isInit && user && user.id) this.init();
    return this.state != nextState || this.props != nextProps;
  }

  componentWillUnmount() {
    clearTimeout(this.timeSocketUnFinish);
    SocketService.disconnect();
    this.isInit = false;
  }

  init = async () => {
    // Get conversation
    this.isInit = true;
    var res = await Fetch.get(Const.API.CONVERSATION.GET_MESSAGE, { page: this.page }, true);
    if (res && res.status === Fetch.Status.SUCCESS) {
      var data = res.data.message;
      data = data.reverse().map((item) => {
        try {
          item.content = JSON.parse(item.content);
          item.received = true;
          item.isChoose = false;
        } catch (err) {
          Funcs.log(err);
          item.content = '';
        }
        return item;
      });
      this.setState({
        data: [...this.state.data, ...res.data.message],
        hasMoreChat: res.data.message.length > 0 && res.data.message.length >= res.data.itemsPerPage
      });
    }
    // Init socket
    SocketService.init({
      url: UrlConst.SOCKET,
      conversationId: res.data.conversationId,
      senderId: Utils.user.id,
      senderName: Utils.user.name,
      senderAvatar: Utils.user.avatar,
      receiverId: 0, // Now, user chat with only admin. With admin, we set id is 0
      onReceived: (message) => {
        var { data } = this.state;
        data = [this.genMessage(message.content, message.type, 'admin', 0, false, message.sentId), ...data];
        this.setState({ data });
        clearTimeout(this.timer);
        this.timer = setTimeout(async () => {
          let readedNotify = await Fetch.post(Const.API.CONVERSATION.MAKE_READED, null, true);
          if (readedNotify.status == 200) {
            OneSignalService.countNotifyChat = 0;
            this.props.onCountConversation(0);
          }
        }, 500);
      },
      onSent: (message) => {
        var { data } = this.state;
        data = data.map((item) => {
          if (item.sentId && item.sentId === message.sentId) {
            item = { ...item };
            item.isSent = true;
          }
          return item;
        });
        this.setState({ data });
      },
      onReaded: () => {
        let { data } = this.state;
        data = data.map((item) => {
          if (item.sender_type == 'user') {
            item = { ...item };
            item.status = 1;
          }
          return item;
        });
        this.setState({ data });
      },
      onTyping: () => {
        this.setState({ isTyping: true });
      },
      onStopTyping: () => {
        this.setState({ isTyping: false });
      }
    });

    // SocketService do not finish here
    this.timeSocketUnFinish = setTimeout(() => {
      SocketService.read();
    }, 500);
  };

  genMessage = (content, type = 'text', senderType = 'user', senderId = Utils.user.id, isLocal = false, sentId) => {
    if (!sentId) sentId = Date.now() + '_' + senderId + '_' + Funcs.random(0, 100) + '' + Funcs.random(100, 200);
    return {
      content,
      created_at: Time.format(Date.now(), 'YYYY-MM-DDTHH:mm:ss'),
      sender_type: senderType,
      sender_id: senderId,
      status: 0,
      isLocal,
      sentId,
      type
    };
  };

  // Button Send messeger
  onPressSubmitMessenger = () => {
    if (this.PhotoSelected.isShow()) {
      this.sendSelectImage();
      this.setState({ isActivity: false });
    } else {
      this.sendMessage();
    }
    this.flatList.scrollToOffset({ animated: true, y: 0 });
  };

  //button Send Like
  onPressSubmitLike = () => {
    let textChange = '👍';
    // Message data
    var newMessage = this.genMessage(textChange);
    SocketService.send(textChange, newMessage.sentId);

    // UI
    var { data } = this.state;
    data = [newMessage, ...data];
    this.setState({ data });
  };

  // Send text and icon
  sendMessage = () => {
    let textChange = this.textInputRef.state.text.trim();
    if (!textChange) {
      return;
    }
    // Emit read socket
    SocketService.read();

    // Message data
    var newMessage = this.genMessage(textChange);
    SocketService.send(textChange, newMessage.sentId);

    // UI
    var { data } = this.state;
    data = [newMessage, ...data];
    this.setState({ data });

    // Reset
    this.textInputRef.onChangeText('');
  };

  // Send image
  sendSelectImage = async () => {
    SocketService.read();

    // Update UI item photo
    var content = this.state.dataImage.map((item) => item.uri);
    var { data } = this.state;
    var newMessage = this.genMessage(content, 'image', 'user', Utils.user.id, true);
    data = [newMessage, ...data];
    this.setState({
      data
    });

    // Reset
    this.PhotoSelected.reset();
    this.PhotoSelected.hide();

    // Upload image
    await Funcs.delay(100);
    var uploadContent = this.state.dataImage.map((item) => {
      return { uri: item.uri, name: 'image', type: item.type || 'image/jpeg' };
    });
    // Upload
    let res = await Fetch.postForm(Const.API.CONVERSATION.UPLOAD_IMAGE, { images: uploadContent }, true);
    if (res.status === Fetch.Status.SUCCESS) {
      var images = res.data.images;
      // Send socket
      SocketService.send(images, newMessage.sentId, 'image');
    } else {
    }
  };

  //hide enmoji
  onPressHide = () => {
    this.PhotoSelected.hide();
    Funcs.hideKeyboard();
    this.setState({ isActivity: false });
  };

  // push question on list data
  onPressChooseQuestion = (item) => () => {
    var { data } = this.state;
    var newMessage = this.genMessage(item.message);
    data = [newMessage, ...data];
    this.setState({
      data
    });

    SocketService.send(item.message, newMessage.sentId);
    this.flatList.scrollToOffset({ animated: true, y: 0 });
  };

  onBlurTextInput = () => {
    if (!this.textInputRef.state.text) {
      SocketService.stopTyping();
    }
  };

  // Check show keyboard => hide emoji, image
  onFocusCheckKeyboard = () => {
    this.textInputRef.inputRef?.focus();
    SocketService.typing();
    this.PhotoSelected.hide();
    this.ListSticker && this.ListSticker.hide();
    this.setState({ isActivity: false });
  };

  // Show Image
  onPressShowImage = () => {
    if (!this.PhotoSelected.isShow()) {
      this.PhotoSelected.show();
      this.ListSticker && this.ListSticker.hide();
      this.setState({
        isActivity: true
      });
    } else {
      this.PhotoSelected.hide();
      this.setState({
        isActivity: false
      });
    }
    Funcs.hideKeyboard();
    this.flatList.scrollToOffset({ animated: true, y: 0 });
  };

  // Send image when take a picture
  onCaptureSuccess = (photo) => {
    let data = [];
    data.push(photo);
    this.setState({ dataImage: data }, () => {
      this.sendSelectImage();
    });
  };

  onPhotoSelected = (listPhotoCheck) => {
    this.setState({
      dataImage: listPhotoCheck
    });
  };

  // dial Call Admin
  onPressDialCall = () => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = 'tel:0969868485';
    } else {
      phoneNumber = 'telprompt:0969868485';
    }
    Linking.openURL(phoneNumber);
  };

  //Show Time item
  onPressShowTime = (item) => {
    let data = this.state.data;
    data.map((e) => {
      if (item.id == undefined) {
        // Message already sent, no have id
        if (e.sentId == item.sentId) {
          e.isChoose = !e.isChoose;
        } else {
          e.isChoose = false;
        }
      } else {
        if (e.id == item.id) {
          e.isChoose = !e.isChoose;
        } else {
          e.isChoose = false;
        }
      }
      return e;
    });
    this.setState({ data: data });
  };

  onPressShowEmoj = () => {
    this.ListSticker.tooggleSticker();
    this.PhotoSelected.hide();
    Keyboard.dismiss();
  };

  render() {
    const { user } = this.props;
    const { internet = true } = this.context || {};
    if (!internet) return <BaseNoInternet />;
    if (!user || !user.id) return <LoginRequire />;
    return (
      <Container>
        {Platform.OS === 'ios' ? (
          <KeyboardAvoidingView keyboardVerticalOffset={keyboardOffset} behavior="padding" enabled={true} style={styles.avoidStyle}>
            {this.renderChat()}
          </KeyboardAvoidingView>
        ) : (
          this.renderChat()
        )}
      </Container>
    );
  }
  renderChat() {
    const { user } = this.props;
    let avatarImage = Resource.images.icAvatar;
    if (user && user.avatar !== null) {
      avatarImage = {
        uri: Const.RESOURCE_URL.AVATAR.DEFAULT + user.avatar
      };
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.user}>
            <FastImage source={Utils.user.id ? Resource.images.icAdmin : avatarImage} style={styles.avata} resizeMode={FastImage.resizeMode.contain} />
            <BaseText style={styles.nameUser}>{Utils.user.id ? 'Dũng Mori' : this.props.user.name}</BaseText>
          </View>
          <TouchableOpacity onPress={this.onPressDialCall}>
            <FastImage
              source={Resource.images.iconCall}
              style={styles.iconCall}
              tintColor={Resource.colors.greenColorApp}
              resizeMode={FastImage.resizeMode.contain}
            />
          </TouchableOpacity>
        </View>
        {this.renderContent()}
        <PhotoSelect ref={(refs) => (this.PhotoSelected = refs)} onPhotoSelected={this.onPhotoSelected} onCaptureSuccess={this.onCaptureSuccess} />
        {Configs.enabledFeature.sticker ? <ListSticker ref={(refs) => (this.ListSticker = refs)} /> : null}
        <ModalWebView ref={(refs) => (this.ModalWebView = refs)} />
      </View>
    );
  }
  handleScroll = (event) => {
    if (Number.isInteger(event.nativeEvent.contentOffset.y) && event.nativeEvent.contentOffset.y < 20) {
      SocketService.read();
    }
  };

  renderContent() {
    const { data, isTyping } = this.state;
    return (
      <View style={styles.chatBox}>
        <FlatList
          style={styles.flexFlatlist}
          ref={(ref) => (this.flatList = ref)}
          onLayout={() => this.flatList.scrollToOffset({ animated: true, y: 0 })}
          inverted
          data={data}
          extraData={this.state}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          ListFooterComponent={this.renderFooter()}
          onMomentumScrollBegin={() => (this.onMomentumScrollBegin = false)}
          onScroll={this.handleScroll}
        />
        <BaseText style={styles.isTypingText}>{isTyping ? Lang.chat.text_is_typing : ''}</BaseText>
        <InputChat
          ref={(ref) => (this.textInputRef = ref)}
          isActivity={this.state.isActivity}
          onPressShowImage={this.onPressShowImage}
          onPressSubmitMessenger={this.onPressSubmitMessenger}
          onFocusTextInput={this.onFocusCheckKeyboard}
          onBlurTextInput={this.onBlurTextInput}
          onPressSubmitLike={this.onPressSubmitLike}
          onPressShowEmoj={this.onPressShowEmoj}
        />
      </View>
    );
  }
  keyExtractor = (item, index) => {
    if (item.created_at) {
      return item.created_at.toString();
    } else {
      return moment()
        .valueOf()
        .toString();
    }
  };

  onShowWebView = (link) => {
    this.ModalWebView.showModal(link);
  };

  renderItem = ({ item, index }) => {
    const { user } = this.props;
    return (
      <ItemChat
        onPress={this.onPressHide}
        item={item}
        user={user}
        onPressShowTime={this.onPressShowTime}
        onLongPressCoppy={this.onCoppyClipBoard}
        onShowWebView={this.onShowWebView}
      />
    );
  };

  //Load More List Chat
  onLoadMore = async () => {
    // this.flatList.scrollToEnd({ animated: true, index: -1 }, 200);
    if (this.loadingMore || this.endLoadMore) return;
    this.page += 1;
    this.setState({
      showLoadMore: true
    });
    this.loadingMore = true;
    var res = await Fetch.get(Const.API.CONVERSATION.GET_MESSAGE, { page: this.page }, true);
    this.loadingMore = false;
    if (res.status === Fetch.Status.SUCCESS) {
      var data = res.data.message;
      data = data.reverse().map((item) => {
        try {
          item.content = JSON.parse(item.content);
          item.received = true;
        } catch (err) {
          Funcs.log(err);
          item.content = '';
        }
        return item;
      });
      this.setState({ data: [...this.state.data, ...res.data.message] });
      this.endLoadMore = res.data.message.length < res.data.itemsPerPage;
    }
    this.setState({
      showLoadMore: false,
      hasMoreChat: res.data.message.length > 0 && res.data.message.length >= res.data.itemsPerPage
    });
    this.onMomentumScrollBegin = true;
  };

  renderFooter() {
    const { user } = this.props;
    return (
      <View>
        <WelcomeChat user={user} onPress={this.onPressChooseQuestion} />
        {this.renderLoadMore()}
      </View>
    );
  }
  renderLoadMore() {
    const { showLoadMore, hasMoreChat } = this.state;
    if (!hasMoreChat) return null;
    if (showLoadMore) return <ActivityIndicator size="small" color={'gray'} style={styles.indicator} />;
    return (
      <View style={styles.indicator}>
        <TouchableOpacity onPress={this.onLoadMore}>
          <BaseText style={styles.textLoadMore}>{Lang.chat.text_load_more}</BaseText>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Resource.colors.white100
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    backgroundColor: Resource.colors.white100,
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1
  },
  avata: {
    width: 30 * Dimension.scale,
    height: 30 * Dimension.scale,
    borderRadius: 15 * Dimension.scale
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  nameUser: {
    fontSize: 14 * Dimension.scale,
    marginLeft: 10,
    fontWeight: '600'
  },
  avoidStyle: {
    flex: 1
  },
  iconCall: {
    marginRight: 20,
    width: 18 * Dimension.scale,
    height: 18 * Dimension.scale
  },
  chatBox: {
    flex: 1
  },
  flexFlatlist: {
    flex: 1,
    paddingHorizontal: 20 * Dimension.scale,
    paddingBottom: 20
  },
  isTypingText: {
    height: 20,
    paddingHorizontal: 25,
    marginTop: 5,
    color: '#707070'
  },
  textLoadMore: {
    color: Resource.colors.greenColorApp,
    textAlign: 'center',
    fontSize: 12 * Dimension.scale
  },
  indicator: {
    marginTop: 20
  }
});
const mapStateToProps = (state) => ({
  user: state.userReducer.user,
  language: state.languageReducer.language
});
const mapDispatchToProps = { onCountConversation };
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatScreen);
