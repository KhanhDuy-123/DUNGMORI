import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import LoadingModal from 'common/components/base/LoadingModal';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import NavigationService from 'common/services/NavigationService';
import StorageService from 'common/services/StorageService';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import ItemVocabularyFlashCard from './ItemVocabularyFlashCard';
import ModalCommentFlashCard from './ModalCommentFlashCard';
import ModalOptionFlastCard from './ModalOptionFlastCard';
import Dimension from 'common/helpers/Dimension';

class VocabularyFlastCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vocabulary: [],
      unfinished: [],
      finished: [],
      optionCard: null,
      optionRandomCard: null,
      changeLanguageCard: '',
      itemCard: {},
      userSetting: null,
      showComment: false,
      rememberCard: false
    };
    this.countAdd = 0;
  }

  async componentDidMount() {
    const { user, params, courseName, listFlashCard, listFinish } = this.props;
    // show modal coment flashcard to notify
    if (params.typeNotify && params.item.table_name === Const.TABLE_NAME.FLASHCARD) {
      let idCard = {
        id: params.item.table_id
      };
      this.setState({ itemCard: idCard, showComment: true });
    }

    // check show data flashcard
    let listCardNotLearn = await StorageService.get(Const.DATA.REMEMBER_FLASHCARD);
    let listUnFinish = await StorageService.get(Const.DATA.UNFINISH_FLASHCARD);
    let listRememberFinish = await StorageService.get(Const.DATA.FINISH_FLASHCARD);

    try {
      // setting random flashcard
      let userSetting = {};
      if (user.setting) {
        userSetting = JSON.parse(user.setting);
        if (userSetting.flashcard_mix) {
          this.randomFlashCard();
        }
      }
      // get data flashcard asyncstorage
      let listCardUnfinish = [];
      let listCardfinish = [];

      if (listCardNotLearn) {
        listCardNotLearn = listCardNotLearn;
        listCardUnfinish = listUnFinish;
        listCardfinish = listRememberFinish;
        if (listCardNotLearn.lessonId === params.item.id && listCardNotLearn.data.length > 0) {
          let newData = listFlashCard.filter((item) => {
            for (let i = 0; i < listCardNotLearn.data.length; i++) {
              if (item.id === listCardNotLearn.data[i]) {
                return item;
              }
            }
          });
          if (listCardUnfinish && listCardUnfinish.lessonId === params.item.id) {
            listCardUnfinish = listCardUnfinish.data;
          }
          if (listCardfinish && listCardfinish.lessonId === params.item.id) {
            listCardfinish = listCardfinish.data;
          }

          this.setState({
            vocabulary: newData,
            rememberCard: true,
            finished: listCardfinish ? listCardfinish : listFinish,
            unfinished: listCardUnfinish != null ? listCardUnfinish : []
          });
        } else if (listCardNotLearn.lessonId === params.item.id && !params.type && !params.typeNotify) {
          NavigationService.replace(ScreenNames.VocabularyScreen, { params, courseName });
        } else {
          this.setState({ vocabulary: listFlashCard });
        }
      } else {
        this.setState({ vocabulary: listFlashCard });
      }
      this.setState({
        userSetting
      });
    } catch (error) {
      Funcs.log(error, 'error card');
    }
  }

  async shouldComponentUpdate(nextProps) {
    let listCardNotLearn = await StorageService.get(Const.DATA.REMEMBER_FLASHCARD);
    if (!listCardNotLearn) {
      if (nextProps.listFlashCard !== this.props.listFlashCard) {
        this.randomFlashCard();
      }
      return true;
    }
  }

  randomFlashCard = () => {
    // check auto flash card
    const { listFlashCard } = this.props;
    let setDataCard = Funcs.randomArray(listFlashCard);
    for (let i = 0; i < setDataCard.length; i++) {
      if (i === 0) {
        setDataCard[i].choose = true;
      } else {
        setDataCard[i].choose = false;
      }
    }
    this.setState({ vocabulary: setDataCard });
  };

  onSlideComplete = (index, status) => {
    const { params, courseName } = this.props;
    const { finished, unfinished } = this.state;
    let data = [...this.state.vocabulary];
    for (let i = 0; i <= data.length; i++) {
      if (!data[i]) continue;
      let itemNext = {};
      let firstItem = {};
      if (data[i].id == index) {
        //push item finish or unfinish array flash card
        if (status > 0) {
          finished.push(data[i]);
          this.setState({ finished });
        } else {
          unfinished.push(data[i]);
          this.setState({ unfinished });
        }
        // splice item vocabulary
        data.splice(i, 1);
        if (data[i]) {
          itemNext = { ...data[i] };
          itemNext.choose = true;
          data.splice(i, 1);
          data.push(itemNext);
          firstItem = { ...data[data.length - 1] };
          data.splice(data.length - 1, 1);
          data.unshift(firstItem);
        }
      }
    }

    // remember list flashcard unfinish
    let flashcardUnFinish = {
      lessonId: params.item.id,
      data: unfinished
    };
    StorageService.save(Const.DATA.UNFINISH_FLASHCARD, flashcardUnFinish);

    // remember list flashcard finish
    let flashcardFinish = {
      lessonId: params.item.id,
      data: finished
    };
    StorageService.save(Const.DATA.FINISH_FLASHCARD, flashcardFinish);

    // remember list flashcard not learn
    let listNotLearn = data.map((item) => item.id);
    let flashcardNotLearn = {
      lessonId: params.item.id,
      data: listNotLearn
    };
    StorageService.save(Const.DATA.REMEMBER_FLASHCARD, flashcardNotLearn);

    this.setState({ vocabulary: [...data] }, async () => {
      if (this.state.vocabulary.length === 0) {
        let idCardFinish = [];
        let idCardUnFinish = [];
        for (let i = 0; i < finished.length; i++) {
          idCardFinish.push(finished[i].id);
        }
        for (let j = 0; j < unfinished.length; j++) {
          idCardUnFinish.push(unfinished[j].id);
        }
        //cập nhật lại từ vựng từ list từ vựng chưa thuộc
        if (params.type === Const.TYPE_CARD.UNFINISH) {
          let listIdFinish = await StorageService.get(Const.DATA.FINISH_FLASHCARD);
          try {
            if (listIdFinish && listIdFinish.lessonId === params.item.id) {
              listIdFinish = listIdFinish.data.map((value) => value.id);
            }
            idCardFinish = [...idCardFinish, ...listIdFinish];
          } catch (error) {}
        }

        let objectCard = {
          remember: JSON.stringify(idCardFinish),
          nonRemember: JSON.stringify(idCardUnFinish)
        };
        LoadingModal.show();
        let res = await Fetch.post(Const.API.FLASHCARD.UPDATE_FLASHCARD, objectCard, true);
        LoadingModal.hide();
        if (res.status === Fetch.Status.SUCCESS) {
          NavigationService.replace(ScreenNames.VocabularyScreen, { params, courseName });
        }
      }
    });
  };

  finishCard = () => {
    const { finished } = this.state;
    return finished;
  };

  unfinishCard = () => {
    const { unfinished } = this.state;
    return unfinished;
  };

  typeCard = () => {
    let typeCard = Const.TABLE_NAME.FLASHCARD;
    return typeCard;
  };

  onChangeSetting = (userSetting) => {
    if (userSetting.flashcard_mix) {
      this.randomFlashCard();
    }
    this.setState({ userSetting });
  };

  onModalComment = (item) => {
    this.setState({ itemCard: item, showComment: true });
  };

  onPressOption = () => {
    this.optionRef.showModal();
  };

  onPressCloseModal = () => {
    this.optionRef.hideModal();
  };

  onPressHideModal = () => {
    const { params, listFlashCard } = this.props;

    if (params.typeNotify) {
      let newFlashCard = listFlashCard.filter((item) => {
        if (item.id === params.item.table_id) {
          return item;
        }
      });
      this.setState({ showComment: false, vocabulary: newFlashCard });
    } else {
      this.setState({ showComment: false });
    }
  };

  renderModalOption() {
    const { userSetting } = this.state;
    if (!userSetting) return null;
    return (
      <ModalOptionFlastCard
        userSetting={userSetting}
        ref={(ref) => (this.optionRef = ref)}
        onPressCloseModal={this.onPressCloseModal}
        onChangeSetting={this.onChangeSetting}
      />
    );
  }
  renderModalComment() {
    const { itemCard } = this.state;
    const { params } = this.props;
    if (itemCard) {
      return <ModalCommentFlashCard itemCard={itemCard} params={params} onPressHideModal={this.onPressHideModal} />;
    }
  }

  renderCard = (item, index) => {
    const { vocabulary, userSetting } = this.state;
    const { params } = this.props;
    if (!userSetting) return null;
    return (
      <ItemVocabularyFlashCard
        item={item}
        index={index}
        key={item.id}
        params={params}
        onSlideComplete={this.onSlideComplete}
        onModalComment={this.onModalComment}
        dataLength={vocabulary.slice(0, 3).length}
        isPlayed={userSetting.flashcard_auto_play === 1}
        language={userSetting.flashcard_language_front}
      />
    );
  };

  render() {
    const { showComment, vocabulary, unfinished, finished } = this.state;
    const { params } = this.props;
    if (showComment) {
      return this.renderModalComment();
    } else {
      return (
        <View style={styles.container}>
          {this.renderModalOption()}
          {params.typeNotify ? null : (
            <View style={styles.wrapper}>
              <View style={styles.titleStyle}>
                <BaseText style={styles.textUnfinish}>{unfinished.length}</BaseText>
                <Icon name="ios-arrow-round-back" size={30} style={{ paddingHorizontal: 15 }} />
                <BaseText style={{ fontSize: 22 }}>{vocabulary.length}</BaseText>
                <Icon name="ios-arrow-round-forward" size={30} style={{ paddingHorizontal: 15 }} />
                <BaseText style={styles.textFinish}>{finished.length}</BaseText>
              </View>
              <View style={styles.viewOption}>
                <TouchableOpacity style={{ paddingHorizontal: 10 }} onPress={this.onPressOption}>
                  <FastImage source={Resource.images.icMenu} style={{ width: 30, height: 30 }} resizeMode={FastImage.resizeMode.contain} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.content}>
            {vocabulary
              .slice(0, 3)
              .reverse()
              .map(this.renderCard)}
          </View>
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  wrapper: {
    flexDirection: 'row',
    position: 'absolute',
    top: -10
  },
  content: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent'
  },
  titleStyle: {
    flex: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: Dimension.isIPad ? 65 * Dimension.scale : 45 * Dimension.scale
  },
  textUnfinish: {
    color: 'red',
    fontSize: 16 * Dimension.scale
  },
  textFinish: {
    color: 'green',
    fontSize: 16 * Dimension.scale
  },
  viewOption: {
    flex: 1,
    alignItems: 'center'
  }
});
const mapStateToProps = (state) => ({
  user: state.userReducer.user
});
export default connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(VocabularyFlastCard);
