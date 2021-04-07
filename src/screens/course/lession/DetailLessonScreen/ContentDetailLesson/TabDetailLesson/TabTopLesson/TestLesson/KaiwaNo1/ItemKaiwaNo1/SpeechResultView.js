import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import Sounds from 'assets/Sounds';
import BaseText from 'common/components/base/BaseText';
import DropAlert from 'common/components/base/DropAlert';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import Const from 'consts/Const';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import fs from 'react-native-fs';
import Spinner from 'react-native-spinkit';
import Configs from 'utils/Configs';
import SpeechRecordView from '../../components/SpeechRecordView';

const specialChars = ['!', '?', ',', '.', '、', '？', '。', '！'];
const languageCode = 'ja-JP';
// const languageCode = 'vi-VN';
const passScore = 0.55;
const maxTimeRecord = 8000;

class SpeechResultView extends React.Component {
  static optionSplitChar = '|';

  constructor(props) {
    super(props);
    this.state = {
      isSpeak: false,
      resultList: [],
      score: 0,
      resultPercent: 0
    };

    // Global var
    let result = props.item.value.name;
    this.correctText = '';
    this.resultText = result;
    this.resultTextTrim = result;
    for (var i = 0; i < specialChars.length; i += 1) {
      this.resultTextTrim = this.resultTextTrim.split(specialChars[i]).join('');
    }
    this.resultTextTrim = this.resultTextTrim.toLowerCase();
    this.resultPercent = 0;
  }

  isCorrect = () => {
    let correct = Configs.enabledFeature.checkCorrectKaiwa1 ? this.state.score > 0 : this.resultPercent >= 85;
    return correct;
  };

  genRandomKey = () => {
    return Date.now() + '_' + Funcs.random(1000, 9999) + '_' + Funcs.random(1000, 9999);
  };

  checkWord = (text, recognizeArr, isRecursiveCheck = false) => {
    let resultList = [];
    let optionText = [];
    text = text.split(SpeechResultView.optionSplitChar);
    if (text.length > 1) {
      optionText = text.filter((item, index) => index > 0 && index < text.length - 1);
      text = text[0] + SpeechResultView.optionSplitChar + SpeechResultView.optionSplitChar + text[text.length - 1];
    } else {
      text = text[0];
    }

    // Kiểm tra kết quả
    let textCorrect = '';
    for (var i = 0; i < recognizeArr.length; i += 1) {
      let wordObj = recognizeArr[i];
      let { word, confidence = 1, matched } = wordObj;
      if (matched) continue;
      word = word.toLowerCase();
      word = word.split('|');
      word = word[0];
      let index = text.indexOf(word);
      if (index === 0) {
        text = text.substring(index + word.length);
        resultList.push({
          type: confidence >= passScore ? 1 : 0,
          text: word,
          key: this.genRandomKey()
        });
        if (confidence >= passScore) textCorrect = textCorrect.concat(word);
        wordObj.matched = !isRecursiveCheck;
        wordObj.optionMatch = isRecursiveCheck;
      } else if (index > 0) {
        let textResult = text.substr(index, word.length).trim();
        resultList.push({
          type: 0,
          text: text.substr(0, index).trim(),
          key: this.genRandomKey()
        });
        resultList.push({
          type: 1,
          text: textResult,
          key: this.genRandomKey()
        });
        textCorrect = textCorrect.concat(textResult);
        text = text.substring(index + word.length);
        wordObj.matched = !isRecursiveCheck;
        wordObj.optionMatch = isRecursiveCheck;
      }
      text = text.trim();
    }

    // Kiểm tra text tuỳ chọn VD ( |100|một trăm| )
    for (var i = 0; i < resultList.length; i += 1) {
      let index = resultList[i].text.indexOf(SpeechResultView.optionSplitChar);
      if (index >= 0) {
        let subText = resultList[i].text.substring(0, index);
        subText = subText.trim();
        if (subText.length > 0) {
          resultList.splice(i, 1, { type: 0, text: subText, key: this.genRandomKey() });
        } else {
          resultList.splice(i, 1);
          i--;
        }

        // Đệ quy lấy kết quả từng phần tử trong text tuỳ chọn
        let optionResult = [];
        for (var j = 0; j < optionText.length; j += 1) {
          let text = optionText[j];
          let res = this.checkWord(text, recognizeArr, true);
          if (optionResult.length === 0) optionResult = res;
          else {
            let countResultCorrect = optionResult.filter((item) => item.type === 1).length;
            let countCorrect = res.filter((item) => item.type === 1).length;
            let countResultError = optionResult.filter((item) => item.type === 0).length;
            let countError = res.filter((item) => item.type === 0).length;
            if (countCorrect > countResultCorrect || countError < countResultError) {
              optionResult = res;
            }
          }
        }
        for (var j = 0; j < optionResult.length; j += 1) {
          resultList.splice(i + 1, 0, optionResult[j]);
          i++;
        }
      }
    }

    // Text còn thừa, ko khớp với đáp án nào
    if (text.length > 0) {
      resultList.push({
        type: 0,
        text,
        key: this.genRandomKey()
      });
    }

    //Tính phần trăm số từ hoàn thành trong 1 câu
    for (var i = 0; i < specialChars.length; i += 1) {
      textCorrect = textCorrect.split(specialChars[i]).join('');
    }
    this.resultPercent = Math.round(100 * (textCorrect.length / this.resultTextTrim.length));
    return resultList;
  };

  onStopSpeech = async (result) => {
    // Sound effect
    Sounds.stop('stopSpeak');
    Sounds.play('stopSpeak');

    // UI
    this.setState({ isSpeak: false, processing: true });
    let { resultTextTrim } = this;
    let text = resultTextTrim.toLowerCase();
    let resultList = [];

    // Recognize
    try {
      if (result) {
        let data = await fs.readFile(result, 'base64');
        let res = await Fetch.post(Const.API.LESSON.SPEECH_RECOGNIZE, { data, languageCode }, true);
        if (res.status === 200 && res.data.results && res.data.results.length > 0) {
          let recognize = res.data.results[res.data.results.length - 1].alternatives;

          // Check
          let recognizeArr = recognize[0].words;
          resultList = this.checkWord(text, recognizeArr);
          Funcs.log('ResultList', resultList);
          Funcs.log('RecognizeArr', recognizeArr);

          // Debug
          if (Configs.enabledFeature.debugRecognize) {
            this.setState({
              recognizeArr
            });
          }
        } else if (res.status === 1001) {
          DropAlert.warn(Lang.NoInternetComponent.no_internet_connection, Lang.NoInternetComponent.pls_check_your_internet_connection);
        } else if (res.status === 200 && Object.keys(res.data).length == 0) {
          //Check data = {}
          this.resultPercent = 0;
        }
      } else {
        DropAlert.warn('', Lang.speech.not_found_record_sound);
      }
    } catch (e) {
      Funcs.log(e, 'ERROR voive stop');
    }

    // Clear timeout stop
    if (this.timeoutStop > 0) {
      clearTimeout(this.timeoutStop);
      this.timeoutStop = 0;
    }

    // Caculator score
    let score = resultList.length > 0 ? 1 : 0;
    for (var i = 0; i < resultList.length; i += 1) {
      if (resultList[i].type === 0) {
        score = 0;
        break;
      }
    }

    // UI
    this.setState({
      resultList,
      processing: false,
      score,
      resultPercent: this.resultPercent
    });

    // Finish
    if (this.props.onFinish) this.props.onFinish(score, this.resultPercent / 100);
  };

  onStartSpeech = async () => {
    // Clear timeout
    if (this.timeoutStop > 0) {
      clearTimeout(this.timeoutStop);
      this.timeoutStop = 0;
    }

    // Stop
    let { isSpeak } = this.state;
    if (isSpeak) {
      this.SpeechRecordView.stop();
      return;
    }

    // Speak
    Funcs.log('START');
    Sounds.stop('startSpeak');
    Sounds.play('startSpeak');
    this.correctText = '';
    this.setState({
      result: '',
      resultList: [],
      isSpeak: true
    });
    this.props.onStartSpeak();

    // Auto stop after 8s
    this.timeoutStop = setTimeout(() => {
      if (this.SpeechRecordView) this.SpeechRecordView.stop();
      this.timeoutStop = 0;
    }, maxTimeRecord);
  };

  renderDebug = () => {
    if (!Configs.enabledFeature.debugRecognize) return null;
    let { recognizeArr = [] } = this.state;
    return (
      <>
        <View style={styles.viewScroll}>
          <ScrollView>
            {recognizeArr.map((item) => (
              <BaseText style={{ fontSize: 11 }} key={item.word.toString()}>
                {' '}
                {'&gt;'} {item.word}
              </BaseText>
            ))}
          </ScrollView>
        </View>
      </>
    );
  };

  render() {
    let { processing, resultList, score } = this.state;
    let { item, disable } = this.props;
    return (
      <View style={styles.wrapperMic}>
        <View style={styles.loadingSpine}>
          {processing ? (
            <Spinner isVisible={true} size={90} type={'Bounce'} color={Resource.colors.activeColor} />
          ) : (
            <SpeechRecordView
              ref={(ref) => (this.SpeechRecordView = ref)}
              onStart={this.onStartSpeech}
              onStop={this.onStopSpeech}
              isKaiwa1={true}
              disable={disable}
            />
          )}
        </View>
        {!Configs.enabledFeature.checkCorrectKaiwa1 && (
          <BaseText style={styles.textResult}>
            {score < 1 ? (
              resultList.map((item, index) => (
                <BaseText style={item.type == 1 ? styles.textResultContent : styles.textContent} key={item.key}>
                  {item.text}
                </BaseText>
              ))
            ) : (
              <BaseText style={styles.textResultContent}>{item.result}</BaseText>
            )}
          </BaseText>
        )}
        {this.renderDebug()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  wrapperMic: {
    alignItems: 'center'
  },
  textResult: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 20
  },
  textContent: {
    fontSize: 16 * Dimension.scale,
    paddingTop: 15,
    color: Resource.colors.red900
  },
  textResultContent: {
    fontSize: 16 * Dimension.scale,
    paddingTop: 15,
    color: Resource.colors.activeColor
  },
  loadingSpine: {
    marginVertical: 40,
    marginTop: 45
  },
  viewScroll: {
    width: 300,
    height: 60,
    padding: 4,
    borderWidth: 0.7
  }
});

export default SpeechResultView;
