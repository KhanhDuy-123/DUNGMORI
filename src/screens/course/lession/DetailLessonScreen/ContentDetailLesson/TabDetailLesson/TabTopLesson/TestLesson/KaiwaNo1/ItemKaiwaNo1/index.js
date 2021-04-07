import Images from 'assets/Images';
import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import Sounds from 'assets/Sounds';
import BaseText from 'common/components/base/BaseText';
import ButtonVolume from 'common/components/base/ButtonVolume';
import Dimension from 'common/helpers/Dimension';
import Time from 'common/helpers/Time';
import Const from 'consts/Const';
import UIConst from 'consts/UIConst';
import React, { Component } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import KaiwaCheckController from 'realm/controllers/KaiwaCheckController';
import Configs from 'utils/Configs';
import Utils from 'utils/Utils';
import SpeechResultView from './SpeechResultView';
import Styles from 'assets/Styles';

const width = Dimension.widthParent;
const MAX_KAIWA_PER_DAY = 2;

const LEVEL = {
  S: 'Level S',
  A: 'Level A',
  B: 'Level B',
  C: 'Level C'
};

export default class ItemKaiwaNo1 extends Component {
  constructor(props) {
    super(props);
    let { item } = props;

    // Result
    let result = item.value.name;
    result = result.split(SpeechResultView.optionSplitChar);
    if (result.length > 2) {
      result = result[0] + result[1] + result[result.length - 1];
    } else {
      result = result[0];
    }
    item.result = result;

    // State
    let countCheck = item.kaiwaCheck?.count || 0;
    const lastCheckExpired = Time.format(item.kaiwaCheck?.lastCheck) >= Time.format(Utils.currentTime);
    const limit = countCheck >= MAX_KAIWA_PER_DAY && lastCheckExpired;
    if (!lastCheckExpired) countCheck = 0;
    this.state = {
      item,
      showGif: false,
      showTextResult: false,
      level: LEVEL.A,
      suggest: Lang.test.text_kaiwa_lva,
      imgGif: Images.gifKaiwaLvA,
      countCheck,
      limit
    };
  }

  componentDidMount() {
    let lastScore = this.props.item.kaiwaCheck?.lastScore;
    if (lastScore !== undefined) {
      let { level, suggest } = this.getLevelStatus(lastScore);
      this.setState({ showTextResult: true, level, suggest });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeGif);
  }

  isCorrect = () => {
    return this.SpeechResultView.isCorrect();
  };

  onStartSpeak = () => {
    if (this.state.showTextResult) this.setState({ showTextResult: false });
    this.props.onStart(this.props.index);
  };

  getLevelStatus = (percent) => {
    let suggest = Lang.test.text_kaiwa_lva;
    let level = LEVEL.A;
    let imgGif = Images.gifKaiwaLvA;
    let sound = 'kaiwaLvA';
    if (percent >= 0.85) {
      level = LEVEL.S;
      suggest = Lang.test.text_kaiwa_lvs;
      imgGif = Images.gifKaiwaLvS;
      sound = 'kaiwaLvS';
    } else if (percent < 0.85 && percent >= 0.6) {
      level = LEVEL.A;
      suggest = Lang.test.text_kaiwa_lva;
      imgGif = Images.gifKaiwaLvA;
      sound = 'kaiwaLvA';
    } else if (percent < 0.6 && percent >= 0.4) {
      level = LEVEL.B;
      suggest = Lang.test.text_kaiwa_lvb;
      imgGif = Images.gifKaiwaLvB;
      sound = 'kaiwaLvB';
    } else {
      level = LEVEL.C;
      suggest = Lang.test.text_kaiwa_lvc;
      imgGif = Images.gifKaiwaLvC;
      sound = 'kaiwaLvC';
    }
    return { level, suggest, imgGif, sound };
  };

  onFinish = async (score, percent) => {
    if (!Configs.enabledFeature.checkCorrectKaiwa1) return this.props.onFinish(score, percent);
    let { level, suggest, imgGif, sound } = this.getLevelStatus(percent);
    Sounds.stop(sound);
    Sounds.play(sound);
    this.setState({ showGif: true, level, suggest, imgGif }, () => {
      clearTimeout(this.timeGif);
      this.timeGif = setTimeout(() => {
        this.setState({ showGif: false, showTextResult: true }, () => {
          this.props.onFinish(score, percent);
        });
      }, 2000);
    });

    // Save kaiwa count check
    if (this.props.limitCheckEnable) {
      let { countCheck } = this.state;
      let { item } = this.props;
      countCheck = countCheck + 1;
      await KaiwaCheckController.add({
        id: item.id,
        lessonId: item.lesson_id,
        lastCheck: Time.format(),
        lastScore: percent,
        count: countCheck
      });
      this.setState({
        countCheck,
        limit: countCheck >= MAX_KAIWA_PER_DAY
      });
    }
  };

  renderTextResult = () => {
    const { showTextResult, suggest, level } = this.state;
    if (!showTextResult) return;
    return (
      <View style={styles.wrapperResult}>
        <View style={styles.viewLevel}>
          <BaseText style={styles.textResult}>{level}</BaseText>
        </View>
        <BaseText style={styles.textSuggest}>{suggest}</BaseText>
      </View>
    );
  };

  renderGif = () => {
    const { showGif, suggest, imgGif } = this.state;
    if (!showGif) return;
    return (
      <View style={[styles.container, { position: 'absolute' }]}>
        <View style={styles.wrapperGif}>
          <FastImage source={imgGif} style={styles.gifStyles} />
          <View style={styles.wrappTextResult}>
            <BaseText style={styles.textGif}>{suggest}</BaseText>
          </View>
        </View>
      </View>
    );
  };

  renderLimit = () => {
    if (!this.props.limitCheckEnable) return false;
    const { limit, countCheck } = this.state;
    let textRemain = limit
      ? Lang.detailLesson.kaiwa_1_speech_limit
      : Lang.parse(countCheck === 0 ? Lang.detailLesson.kaiwa_1_speech_has : Lang.detailLesson.kaiwa_1_speech_remain, MAX_KAIWA_PER_DAY - countCheck);
    return (
      <View style={styles.containerLimitWarning}>
        <View style={[styles.containerTextLimit, !limit && { backgroundColor: '#DDD' }]}>
          <BaseText style={[styles.textLimit, !limit && { color: '#333' }]}>{textRemain}</BaseText>
        </View>
        <View style={[styles.triangleLimit, !limit && { borderTopColor: '#DDD' }]} />
      </View>
    );
  };

  render() {
    const { item, limit } = this.state;
    return (
      <View style={styles.containerItem}>
        <View style={styles.container}>
          <View style={styles.viewVolum}>
            <ButtonVolume linkSound={`${Const.RESOURCE_URL.DOCUMENT.KAIWA}${encodeURIComponent(item.value.link)}`} />
            <BaseText style={styles.textTitle}>{item.result}</BaseText>
          </View>
          <View style={Styles.flex}>
            <View style={{ height: 5 }} />
            <SpeechResultView
              disable={limit}
              item={item}
              ref={(ref) => (this.SpeechResultView = ref)}
              onFinish={this.onFinish}
              onStartSpeak={this.onStartSpeak}
              index={this.props.index}
            />
            {this.renderLimit()}
            {Configs.enabledFeature.checkCorrectKaiwa1 && this.renderTextResult()}
          </View>
          {Configs.enabledFeature.checkCorrectKaiwa1 && this.renderGif()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerItem: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10
  },
  container: {
    width: 280 * Dimension.scale,
    height: 280 * Dimension.scale,
    backgroundColor: Resource.colors.white100,
    shadowColor: Resource.colors.grey600,
    borderRadius: 20 * Dimension.scale,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 5,
    shadowRadius: Platform.OS === 'ios' ? 5 : 4,
    elevation: Platform.OS === 'ios' ? 0.3 : 5
  },
  viewVolum: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: UIConst.SCALE * 15
  },
  textTitle: {
    width: 220 * Dimension.scale,
    paddingLeft: 10,
    fontSize: 16 * Dimension.scale
  },
  gifStyles: {
    width: 110 * Dimension.scale,
    height: 110 * Dimension.scale,
    marginBottom: UIConst.SCALE * 10
  },
  wrapperResult: {
    width: 260 * Dimension.scale,
    paddingHorizontal: UIConst.SCALE * 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: UIConst.SCALE * 20
  },
  viewLevel: {
    borderRadius: UIConst.SCALE * 25,
    width: UIConst.SCALE * 70,
    height: UIConst.SCALE * 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7CCEF9',
    marginRight: UIConst.SCALE * 10
  },
  textResult: {
    color: 'white',
    fontWeight: '600'
  },
  textSuggest: {
    width: '80%',
    letterSpacing: -0.5
  },
  textGif: {
    fontSize: 16,
    letterSpacing: -0.5,
    textAlign: 'center'
  },
  wrapperGif: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  wrappTextResult: {
    width: '85%',
    alignItems: 'center'
  },
  containerLimitWarning: {
    position: 'absolute',
    alignItems: 'center',
    left: 0,
    right: 0,
    top: 0,
    paddingBottom: UIConst.SCALE * 10
  },
  containerTextLimit: {
    backgroundColor: '#DB2D2E',
    width: '87%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: UIConst.SCALE * 30,
    paddingVertical: UIConst.SCALE * 10
  },
  textLimit: {
    color: 'white',
    textAlign: 'center',
    fontSize: UIConst.FONT_SIZE - 1
  },
  triangleLimit: {
    width: 0,
    height: 0,
    borderLeftWidth: UIConst.SCALE * 6,
    borderRightWidth: UIConst.SCALE * 6,
    borderTopWidth: UIConst.SCALE * 10,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#DB2D2E',
    position: 'absolute',
    bottom: 0
  }
});
