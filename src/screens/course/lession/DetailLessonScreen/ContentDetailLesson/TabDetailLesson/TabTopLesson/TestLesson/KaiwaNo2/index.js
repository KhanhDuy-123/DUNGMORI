import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import DropAlert from 'common/components/base/DropAlert';
import LoadingModal from 'common/components/base/LoadingModal';
import ModalWebView from 'common/components/base/ModalWebView';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import Const from 'consts/Const';
import React, { Component } from 'react';
import { ActivityIndicator, Animated, FlatList, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SoundComment from 'screens/components/comment/ItemComment/SoundComment';
import ListComment from 'screens/components/comment/ListComment';
import Utils from 'utils/Utils';
import ItemKaiwa2 from './ItemKaiwa2';
import ModalRecord from './ModalRecord';

const width = Dimension.widthParent;
const MAX_KAIWA_COMMENT = 1;

export default class KaiwaNo2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      linkRecord: '',
      limited: false,
      lastItem: {},
      loading: true,
      showComent: false,
      changeLink: false,
      showSuggestion: false
    };
    this.countAnswer = 0;
    this.coundtLimit = 0;
    this.animatedSuggestion = new Animated.Value(1);
    this.animCorrect = new Animated.Value(0);
  }

  componentDidMount() {
    this.getData();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state;
  }

  //get data
  getData = async () => {
    const { kaiwaNo2Demo } = this.props;
    const data = {
      objectId: kaiwaNo2Demo.id,
      page: 1
    };
    let dataList = [];
    let lastItem = {};
    let respone = await Fetch.get(Const.API.COMMENT.GET_MY_LIST_KAIWA_COMMENT, data, true);
    if (respone.status == Fetch.Status.SUCCESS) {
      if (Object.keys(respone.data.comment).length > 0) {
        let dataComment = { ...respone.data.comment };
        dataComment.content = dataComment.audio;
        dataList.push(dataComment);
      }
      try {
        let reply = [];
        if (respone.data.comment.reply) {
          reply = Funcs.jsonParse(respone.data.comment.reply);
          //sap xep reply so le nhau
          if (reply.length > 0) {
            reply.sort((a, b) => {
              if (a.id > b.id) return -1;
              if (a.id < b.id) return 1;
              return 0;
            });
            //day item reply cung cap vao mang du lieu chinh
            reply.reverse().map((e, index) => {
              let item = { ...e };
              dataList.push(item);
            });
            // dataList[0].reply = null;
          }
        }
        for (let i = 0; i < dataList.length; i++) {
          let item = { ...dataList[i] };
          //Check correct comment
          if (item.is_correct == 1 || item.is_correct == '1') {
            let prevItem = null;
            for (let j = i; j >= 0; j--) {
              if (dataList[j].user_id == Utils.user.id) {
                prevItem = { ...dataList[j] };
                prevItem.is_correct = 1;
                prevItem.link_correct = item.audio;
                item.audio = null;
                dataList[i] = item;
                dataList[j] = prevItem;
                if (!item.content) dataList.splice(i, 1);
                break;
              }
            }
            this.onShowCorrect();
          }
        }
        //Đếm số lần user comment
        for (let i = 0; i < dataList.length; i++) {
          if (dataList[i].user_id == Utils.user.id) this.coundtLimit += 1;
        }

        lastItem = dataList[dataList.length - 1];
        this.setState({ dataList, lastItem, loading: false });
      } catch (error) {
        Funcs.log(`ERROR PARSE`, error);
      }
    } else {
      DropAlert.error(respone.message);
      this.setState({ loading: false });
    }
  };

  onPressOpenModal = async () => {
    if (this.coundtLimit <= MAX_KAIWA_COMMENT) {
      // //check permisson
      let checkPermissionRecord = await Funcs.checkPermission('microphone');
      if (Platform.OS == 'android') {
        let checkRecord = await Funcs.checkPermission('storage');
        if (!checkPermissionRecord || !checkRecord) return;
        this.ModalRecord.showModal();
      } else {
        if (!checkPermissionRecord) return;
        this.ModalRecord.showModal();
      }
    }
  };

  onPressSendComment = async () => {
    //Check do dai cua file ghi am
    let comentDuration = this.SoundComment?.duration();
    if (Math.round(comentDuration) <= 1 || !comentDuration) return DropAlert.error('', Lang.learn.text_short_record);

    const { dataList } = this.state;
    const { kaiwaNo2Demo } = this.props;

    //lay id comment cha
    let parentId = null;
    if (dataList.length > 0) {
      parentId = dataList[0].id;
    }
    const linkRecord = {
      uri: 'file://' + this.state.linkRecord,
      name: 'audio',
      type: 'audio/mp3'
    };
    let data = {
      audio: linkRecord,
      objectId: kaiwaNo2Demo.id,
      parentId: parentId,
      type: 'kaiwa'
    };
    LoadingModal.show();
    let respone = await Fetch.postForm(Const.API.COMMENT.ADD_COMMENT, data, true);
    LoadingModal.hide();
    if (respone.status == Fetch.Status.SUCCESS) {
      this.setState((prevState) => {
        this.coundtLimit += 1;
        let dataList = prevState.dataList;
        let item = respone.data.comment;
        item.avatar = Utils.user.avatar;
        dataList.push(item);
        return { dataList, linkRecord: '', lastItem: item, showSuggestion: false };
      });
    }
  };

  onStopSpeak = (data) => {
    let link = data;
    this.setState({ linkRecord: link, changeLink: !this.state.changeLink, showSuggestion: true }, this.onHideSuggesttion);
  };

  onShowAnotherComent = () => {
    this.setState({ showComent: !this.state.showComent }, () => {
      this.props.onScrollToEnd();
    });
  };

  onHideSuggesttion = () => {
    Animated.sequence([
      Animated.delay(4000),
      Animated.timing(this.animatedSuggestion, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true
      })
    ]).start(() => {
      this.setState({ showSuggestion: false });
    });
  };

  onOpentModal = (link) => {
    this.ModalWebView.showModal(link);
  };

  onShowCorrect = () => {
    this.timeCorrect = setTimeout(() => {
      Animated.timing(this.animCorrect, {
        toValue: 1,
        duration: 300
      }).start();
    }, 2000);
  };

  hideCorrect = () => {
    Animated.timing(this.animCorrect, {
      toValue: 0,
      duration: 300
    }).start();
  };

  keyExtractor = (item, index) => item.id.toString();

  renderHeaderReply = () => {
    const opacity = this.animCorrect.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });
    return (
      <Animated.View style={[styles.viewWrapCorrect, { right: 35, opacity }]}>
        <View style={[styles.send, { height: 30 }]}>
          <BaseText style={styles.textSuggest}>{Lang.chooseLession.hint_check_sound}</BaseText>
        </View>
        <View style={[styles.triagle, { marginLeft: 70 }]} />
      </Animated.View>
    );
  };

  renderItem = ({ item, index }) => {
    return <ItemKaiwa2 item={item} openModal={this.onOpentModal} onHideCorrect={this.hideCorrect} />;
  };

  renderItemReply = () => {
    const { linkRecord, lastItem, changeLink, showSuggestion } = this.state;
    const source = linkRecord.length > 0 ? Resource.images.iconSend : Resource.images.iconNotSend;
    let description = '';
    let disableRecord = false;
    if (this.coundtLimit == MAX_KAIWA_COMMENT && lastItem && lastItem.user_id !== Utils.user.id) {
      description = Lang.test.text_has_one_answer;
      disableRecord = false;
    } else if (lastItem && lastItem.user_id == Utils.user.id) {
      description = Lang.test.text_wait_answer;
      disableRecord = true;
    } else if (this.coundtLimit > MAX_KAIWA_COMMENT && (lastItem && lastItem.user_id !== Utils.user.id)) {
      description = Lang.test.text_has_no_answer;
      disableRecord = true;
    } else {
      description = Lang.test.text_record_reply;
      disableRecord = false;
    }
    return (
      <View style={styles.containerReply}>
        {linkRecord.length !== 0 ? (
          <SoundComment
            link={linkRecord}
            style={styles.soundComent}
            textTime={{ color: Resource.colors.greenColorApp }}
            changeLink={changeLink}
            ref={(refs) => (this.SoundComment = refs)}
          />
        ) : (
          <BaseText style={styles.textRecord}>{description}</BaseText>
        )}
        <View style={styles.areaAction}>
          <TouchableOpacity onPress={this.onPressOpenModal} disabled={disableRecord}>
            <FontAwesome
              name={'microphone'}
              size={28}
              color={(lastItem && lastItem.user_id == Utils.user.id) || disableRecord ? '#C5C5C5' : Resource.colors.greenColorApp}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onPressSendComment} disabled={linkRecord.length > 0 ? false : true}>
            <FastImage source={source} style={{ width: 22, height: 22 }} />
          </TouchableOpacity>
          {showSuggestion && this.renderSuggestion()}
        </View>
      </View>
    );
  };

  renderSuggestion = () => {
    return (
      <Animated.View style={[styles.areaViewSuggest, { opacity: this.animatedSuggestion }]}>
        <View style={{ marginRight: 10, alignItems: 'flex-end' }}>
          <View style={styles.send}>
            <BaseText style={styles.textSuggest}>{Lang.test.text_re_record}</BaseText>
          </View>
          <View style={[styles.triagle, { marginRight: 15 }]} />
        </View>
        <View style={{ alignItems: 'center', marginRight: 10 }}>
          <View style={styles.send}>
            <BaseText style={styles.textSuggest}>{Lang.test.text_send}</BaseText>
          </View>
          <View style={styles.triagle} />
        </View>
      </Animated.View>
    );
  };

  render() {
    const source = Resource.images.icKaiwaComent;
    const { kaiwaNo2Demo } = this.props;
    const { showComent } = this.state;
    return (
      <View style={styles.container}>
        <View>
          <BaseText style={[styles.textTitle, { marginBottom: 20 }]}>{Lang.test.text_kaiwa_no2}</BaseText>
          {/* <BaseText style={styles.textNote}>{Lang.test.text_note_kaiwa2}</BaseText> */}
        </View>
        <View style={styles.wrapper}>
          {this.state.loading ? (
            <View style={styles.wrapLoading}>
              <ActivityIndicator size="large" color={Resource.colors.greenColorApp} />
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1, paddingTop: 20 }}>
                <ScrollView
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                  ref={(refs) => (this.ScrollView = refs)}
                  onLayout={() => this.ScrollView.scrollToEnd({ animated: true })}
                  onContentSizeChange={() => this.ScrollView.scrollToEnd({ animated: true })}>
                  {/*render question demo*/}
                  <View style={{ marginBottom: 15, width: '100%', alignItems: 'center' }}>
                    <View style={styles.content}>
                      <FastImage source={source} style={styles.avt} />
                      <SoundComment
                        link={Const.RESOURCE_URL.DOCUMENT.KAIWA + kaiwaNo2Demo.link}
                        style={styles.comment}
                        textTime={{ color: Resource.colors.greenColorApp }}
                      />
                    </View>
                    {/* <BaseText style={styles.textName}>{item.name}</BaseText> */}
                  </View>
                  {/*render item comment*/}
                  <FlatList data={this.state.dataList} extraData={this.state} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />
                  {/* {this.renderHeaderReply()} */}
                </ScrollView>
              </View>
              {this.renderItemReply()}
            </View>
          )}
        </View>
        <BaseText style={styles.textViewMoreComent} onPress={this.onShowAnotherComent}>
          {Lang.test.text_viewmore_coment}
        </BaseText>
        <ModalRecord ref={(refs) => (this.ModalRecord = refs)} onStopSpeak={this.onStopSpeak} />
        {showComent && (
          <View style={{ flex: 1, width }}>
            <ListComment objectId={kaiwaNo2Demo.id} type={Const.COURSE_TYPE.KAIWA} />
          </View>
        )}
        <ModalWebView ref={(refs) => (this.ModalWebView = refs)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopColor: '#E8EEF0',
    borderTopWidth: 7,
    paddingTop: 15,
    alignItems: 'center',
    paddingBottom: 10
  },
  textTitle: {
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 15,
    marginHorizontal: 15
  },
  wrapper: {
    width: 280 * Dimension.scale,
    height: 280 * Dimension.scale,
    backgroundColor: Resource.colors.white100,
    shadowColor: Resource.colors.grey600,
    borderRadius: 20 * Dimension.scale,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20
  },
  containerReply: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 10
  },
  textRecord: {
    fontSize: 15,
    fontStyle: 'italic',
    fontWeight: '300',
    color: '#919191'
  },
  areaAction: {
    width: 60 * Dimension.scale,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
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
    width: '75%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 10,
    height: 35
  },
  textComment: {
    backgroundColor: Resource.colors.greenColorApp,
    maxWidth: '75%',
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
    borderTopColor: '#E1E1E1',
    marginTop: -1
  },
  viewWrapCorrect: {
    position: 'absolute',
    width: 120,
    height: 55,
    justifyContent: 'flex-end'
  },
  textCorrect: {
    fontSize: 13
  },
  textNote: {
    marginVertical: 0,
    fontStyle: 'italic',
    fontWeight: '500',
    marginBottom: 20,
    marginHorizontal: 15
  }
});
