import Colors from 'assets/Colors';
import Lang from 'assets/Lang';
import BaseImage from 'common/components/base/BaseImage';
import BaseText from 'common/components/base/BaseText';
import DropAlert from 'common/components/base/DropAlert';
import UrlConst from 'consts/UrlConst';
import React, { Component } from 'react';
import { Keyboard } from 'react-native';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default class FrontCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showResult: false,
      correct: false
    };
    this.text = '';
  }

  onPressCheckResult = () => {
    const { item } = this.props;
    let correct = false;
    Keyboard.dismiss();
    if (this.text?.length === 0) return DropAlert.info(Lang.guessImage.titleMessage, Lang.guessImage.message, 2000);
    if (this.text.toLocaleLowerCase().trim() === item?.value?.result?.toLocaleLowerCase()?.trim()) {
      correct = true;
    }
    this.setState({ showResult: true, correct }, () => {
      this.props.onShowResult(item);
    });
  };

  onChangeText = (text) => {
    this.text = text;
  };

  renderResult = () => {
    const { correct } = this.state;
    let textResult = Lang.guessImage.wrong;
    let color = 'red';
    let iconName = 'closecircle';
    if (correct) {
      iconName = 'checkcircle';
      color = Colors.greenColorApp;
      textResult = Lang.guessImage.correct;
    }
    return (
      <View style={styles.wrapperResult}>
        <BaseText style={{ color, fontWeight: '700', marginRight: 10 }}>{textResult}</BaseText>
        <AntDesign name={iconName} size={24} color={color} />
      </View>
    );
  };

  render() {
    const { index, item } = this.props;
    const { showResult } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.image}>
          <BaseImage source={{ uri: UrlConst.CDN + item?.value?.img }} style={styles.img} resizeMode="contain" />
        </View>
        <View style={styles.content}>
          <BaseText style={styles.textEnter}>{Lang.guessImage.enterHiragana}</BaseText>
          <View style={styles.wrapperInput}>
            <TextInput editable={!showResult} style={styles.input} placeholder={Lang.guessImage.enterTheAnswer} onChangeText={this.onChangeText} />
            {showResult ? (
              this.renderResult()
            ) : (
              <TouchableOpacity style={styles.buttonCheck} onPress={this.onPressCheckResult}>
                <BaseText style={styles.textButton}>{Lang.guessImage.check}</BaseText>
              </TouchableOpacity>
            )}
          </View>
          {showResult && (
            <View>
              <BaseText style={styles.textResult}>{`${Lang.guessImage.result} ${item?.value?.result}`}</BaseText>
              <BaseText style={styles.textDescription}>{Lang.guessImage.pressShowExplain}</BaseText>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10
  },
  image: {
    flex: 1,
    padding: 5
  },
  content: {
    flex: 1,
    paddingTop: 10
  },
  textEnter: {
    letterSpacing: 0.5,
    fontWeight: '700',
    marginBottom: 10
  },
  wrapperInput: {
    width: '100%',
    height: 45,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 2,
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center'
  },
  input: {
    flex: 1,
    height: 45,
    fontWeight: '700'
  },
  buttonCheck: {
    width: 80,
    height: 25,
    backgroundColor: Colors.greenColorApp,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100
  },
  textButton: {
    color: 'white'
  },
  wrapperResult: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row'
  },
  textResult: {
    fontWeight: 'bold',
    color: Colors.greenColorApp,
    marginTop: 20,
    marginHorizontal: 10,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 10,
    elevation: 2
  },
  textDescription: {
    color: '#8B1A13',
    marginHorizontal: 10
  },
  img: {
    width: '100%',
    height: '100%'
  }
});
