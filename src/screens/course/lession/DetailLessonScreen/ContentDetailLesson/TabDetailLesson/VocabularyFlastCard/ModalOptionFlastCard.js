import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseButtonOpacity from 'common/components/base/BaseButtonOpacity';
import BaseDropDown from 'common/components/base/BaseDropDown';
import BaseText from 'common/components/base/BaseText';
import ModalScreen from 'common/components/base/ModalScreen';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import React, { PureComponent } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { connect } from 'react-redux';
import { onUpdateUser } from 'states/redux/actions';
import Const from 'consts/Const';

const height = Dimension.heightParent;
const width = Dimension.widthParent;

class ModalOptionFlastCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    };
    this.languageList = [{ id: 0, name: Lang.flashcard.text_japan_language }, { id: 1, name: Lang.flashcard.text_vietnam_language }];
  }

  componentDidMount() {
    this.resetState();
  }

  resetState = () => {
    let { userSetting } = this.props;
    this.setState({
      language: userSetting.flashcard_language_front,
      cardMix: userSetting.flashcard_mix,
      autoPlay: userSetting.flashcard_auto_play
    });
  };

  showModal = () => {
    this.setState({
      isVisible: true
    });
  };

  hideModal = () => {
    this.setState({
      isVisible: false
    });
  };

  onValueChangeSound = (value) => {
    this.setState({ autoPlay: value ? 1 : 0 });
  };

  onValueChangeCard = (value) => {
    this.setState({ cardMix: value ? 1 : 0 });
  };

  onChangeLanguage = (value) => {
    this.setState({ language: value.id });
  };

  onPressBack = () => {
    this.setState(
      {
        isVisible: false
      },
      this.resetState
    );
  };

  onPressSave = async () => {
    const { autoPlay, cardMix, language } = this.state;
    let data = {
      flashCardAutoPlay: autoPlay,
      flashCardMix: cardMix,
      flashCardLanguageFront: language
    };
    let settingLang = await Fetch.post(Const.API.USER.USER_SETTING, data, true);
    if (settingLang.status === Fetch.Status.SUCCESS) {
      this.setState({ isVisible: false }, () => {
        let { userSetting } = this.props;
        userSetting = {
          ...userSetting,
          flashcard_auto_play: autoPlay,
          flashcard_mix: cardMix,
          flashcard_language_front: language
        };
        this.props.onChangeSetting(userSetting);
        this.props.onUpdateUser({ ...this.props.user, setting: JSON.stringify(userSetting) });
      });
    }
  };

  hasChangeOption = () => {
    const { autoPlay, cardMix, language } = this.state;
    const { userSetting } = this.props;
    return language != userSetting.flashcard_language_front || autoPlay != userSetting.flashcard_auto_play || cardMix != userSetting.flashcard_mix;
  };

  render() {
    let { autoPlay, cardMix, language } = this.state;
    if (language === null || language === undefined || language > this.languageList.length - 1 || isNaN(language)) language = 0;
    let checkChangeOption = this.hasChangeOption();
    return (
      <ModalScreen isVisible={this.state.isVisible} swipeDirection={['down']} onSwipeComplete={this.hideModal} style={styles.modal}>
        <View style={styles.wrapper}>
          <BaseText style={styles.title}>{Lang.flashcard.hint_text_custom}</BaseText>
          <View style={styles.viewSwitch}>
            <BaseText style={styles.text}>{Lang.flashcard.hint_auto_sound}</BaseText>
            <Switch onValueChange={this.onValueChangeSound} value={autoPlay === 1} trackColor={{ true: Resource.colors.greenColorApp }} />
          </View>
          <View style={styles.viewSwitch}>
            <BaseText style={styles.text}>{Lang.flashcard.hint_mix_card}</BaseText>
            <Switch onValueChange={this.onValueChangeCard} value={cardMix === 1} trackColor={{ true: Resource.colors.greenColorApp }} />
          </View>
          <View style={styles.viewSwitch}>
            <BaseText style={styles.text}>{Lang.flashcard.hint_befor_card}</BaseText>
            <BaseDropDown
              data={this.languageList}
              value={this.languageList[language].name}
              onChangeText={this.onChangeLanguage}
              dropStyle={styles.dropStyle}
              offsetStyle={styles.offsetStyle}
              pickerStyle={styles.pickerStyle}
            />
          </View>
          <View style={styles.wrapperButton}>
            <BaseButtonOpacity text={Lang.flashcard.text_button_back} onPress={this.onPressBack} socialButtonStyle={styles.buttonLeft} />
            <BaseButtonOpacity
              disabled={!checkChangeOption}
              text={Lang.flashcard.text_button_save}
              onPress={this.onPressSave}
              textStyle={{ color: !checkChangeOption ? Resource.colors.white100 : Resource.colors.black1 }}
              socialButtonStyle={[styles.buttonRight, { backgroundColor: !checkChangeOption ? Resource.colors.grey500 : Resource.colors.greenColorApp }]}
            />
          </View>
        </View>
      </ModalScreen>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    height: height - 80,
    justifyContent: 'flex-end',
    margin: 0
  },
  wrapper: {
    height: height - 80,
    backgroundColor: 'white'
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    paddingVertical: 20,
    fontWeight: '500'
  },
  viewSwitch: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15
  },
  text: {
    fontSize: 16,
    color: Resource.colors.grey800
  },
  dropStyle: {
    width: 100 * Dimension.scale,
    backgroundColor: Resource.colors.white100
  },
  pickerStyle: {
    width: (width / 3) * Dimension.scale,
    marginLeft: 120 * Dimension.scale,
    borderRadius: 10 * Dimension.scale
  },
  offsetStyle: {
    top: 15,
    right: 10,
    bottom: 20
  },
  wrapperButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginHorizontal: 40,
    marginBottom: 50
  },
  buttonLeft: {
    width: 120 * Dimension.scale,
    height: 40,
    borderWidth: 0.5,
    borderColor: Resource.colors.grey500,
    borderRadius: 20,
    marginRight: 40
  },
  buttonRight: {
    width: 120 * Dimension.scale,
    height: 40,
    backgroundColor: Resource.colors.greenColorApp,
    borderRadius: 20
  }
});

const mapStateToProps = (state) => ({
  user: state.userReducer.user
});

const mapDispatchToProps = { onUpdateUser };
export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(ModalOptionFlastCard);
