import Colors from 'assets/Colors';
import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import ButtonVolume from 'common/components/base/ButtonVolume';
import HTMLFurigana from 'common/components/base/HTMLFurigana';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import Const from 'consts/Const';
import UrlConst from 'consts/UrlConst';
import React, { Component } from 'react';
import { Animated, Easing, Keyboard, PanResponder, StyleSheet, TouchableOpacity, View } from 'react-native';
import ContentFlashcard from './ContentFlashcard';

const width = Dimension.widthParent;

export default class ItemVocabularyFlashCard extends Component {
  constructor(props) {
    super(props);
    try {
      this.valueCard = Funcs.jsonParse(this.props.item.value);
    } catch (error) {
      Funcs.log(error, 'error');
    }

    this.animatedImage = new Animated.Value(1);
    this.rotageLeft = new Animated.Value(0);
    this.animatedValue = new Animated.ValueXY({ x: 0, y: 0 });
    this.moveFlashCardLeft = new Animated.Value(0);
    this.moveFlashCardRight = new Animated.Value(0);

    this.valueScale = 1; //check scale item o stack sau
    // check do nghieng cua tung item
    this.rotageVa = 0;
    if (this.props.index == this.props.dataLength - 1 || (this.props.index == 0 && this.props.dataLength == 1)) {
      this.rotageLeft.setValue(3);
      this.rotageVa = 3;
      props.item.choose = true;
      // check auto play sound
      this.autoSound = this.props.isPlayed;
    } else if (this.props.index == 0) {
      this.rotageLeft.setValue(1);
      this.rotageVa = 1;
    } else {
      this.rotageLeft.setValue(2);
      this.rotageVa = 2;
    }

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        return dx >= 3 || dx <= -3 || dy >= 3 || dy <= -3;
      },
      onStartShouldSetPanResponderCapture: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        return dx >= 3 || dx <= -3 || dy >= 3 || dy <= -3;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        return dx >= 3 || dx <= -3 || dy >= 3 || dy <= -3;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        return dx >= 3 || dx <= -3 || dy >= 3 || dy <= -3;
      },
      onPanResponderGrant: (evt, gestureState) => {
        this.animatedValue.setOffset({ x: 0, y: 0 });
        this.animatedValue.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (evt, gestureState) => {
        this.animatedValue.setValue({ x: gestureState.dx, y: gestureState.dy });
        if (gestureState.dx <= 100 && gestureState.dx >= -100) {
          this.rotageLeft.setValue(gestureState.dx);
          if (gestureState.dx < 0 && gestureState.dx > -40) {
            this.moveFlashCardLeft.setValue(gestureState.dx);
          } else if (gestureState.dx > 0 && gestureState.dx < 40) {
            this.moveFlashCardRight.setValue(gestureState.dx);
          }
        }
      },

      onPanResponderRelease: (evt, gestureState) => {
        this.moveFlasdCard = gestureState.dx;
        if (gestureState.dx <= -50) {
          Animated.timing(this.animatedValue.x, {
            toValue: -width,
            duration: 300,
            easing: Easing.linear
          }).start(() => {
            this.props.onSlideComplete(this.props.item.id, this.moveFlasdCard);
          });
        } else if (gestureState.dx >= 50) {
          Animated.timing(this.animatedValue.x, {
            toValue: width,
            duration: 300,
            easing: Easing.linear
          }).start(() => {
            this.props.onSlideComplete(this.props.item.id, this.moveFlasdCard);
          });
        } else {
          Animated.parallel([
            Animated.timing(this.animatedValue.x, {
              toValue: 0,
              duration: 200
            }),
            Animated.timing(this.animatedValue.y, {
              toValue: 0,
              duration: 200
            }),
            Animated.timing(this.rotageLeft, {
              toValue: 3,
              duration: 300,
              easing: Easing.linear
            })
          ]).start();
        }
        this.moveFlashCardLeft.setValue(0);
        this.moveFlashCardRight.setValue(0);
        this.animatedValue.flattenOffset();
      }
    });

    this.toggle = false;
    this.animateRotage = new Animated.Value(0);
    this.animatedScale = new Animated.Value(1);
    this.scaleParent = new Animated.Value(1);
    this.totalBottom = 0;
    this.state = {
      isFront: props.language != 1,
      exampleFlashcard: [],
      totalTopParent: 0
    };
  }

  componentDidMount() {
    Animated.spring(this.scaleParent, {
      toValue: this.valueScale,
      friction: 7
    }).start();
    if (this.props.language === 1) {
      this.setState({ isFront: false });
    }
    let exampleFlashcard = this.exampleFlashcard();
    this.setState({ exampleFlashcard });
  }

  componentWillUnmount() {
    clearTimeout(this.timeStartSpringIn);
    clearTimeout(this.timeStartSpringOut);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.language !== this.props.language) {
      this.setState({ isFront: nextProps.language != 1 });
    }

    if (nextProps.item.choose == true) {
      if (nextProps.index == nextProps.dataLength - 1) {
        this.rotageLeft.setValue(3);
        this.rotageVa = 3;
        this.autoSound = this.props.isPlayed;
      }
      Animated.spring(this.scaleParent, {
        toValue: 1,
        friction: 8
      }).start();
    } else {
      if (nextProps.index == 0) {
        this.rotageLeft.setValue(1);
        this.rotageVa = 1;
      } else {
        this.rotageLeft.setValue(2);
        this.rotageVa = 2;
      }
      Animated.spring(this.scaleParent, {
        toValue: this.valueScale,
        friction: 8
      }).start();
    }
    return true;
  }

  onPressToggle = () => {
    if (this.contentRef.showKeyboard()) {
      Keyboard.dismiss();
    } else {
      this.toggle = !this.toggle;
      clearTimeout(this.timeStart);
      this.setState({ isFront: !this.state.isFront }, () => {
        if (this.toggle) {
          if (this.animated) this.animated.stop();
          this.onSpringOut();
        } else {
          if (this.animated) this.animated.stop();
          this.onSpringIn();
        }
      });
    }
  };

  onSpringOut = () => {
    this.animated = Animated.spring(this.animatedScale, {
      toValue: 1.05,
      friction: 8
    });
    this.animated.start();
    this.timeStart = setTimeout(() => {
      Animated.timing(this.animateRotage, {
        toValue: 1,
        duration: 350
      }).start(() => {
        Animated.spring(this.animatedScale, {
          toValue: 1,
          friction: 8
        }).start();
      });
    }, 200);
  };

  onSpringIn = () => {
    this.animated = Animated.spring(this.animatedScale, {
      toValue: 1.05,
      friction: 8
    });
    this.animated.start();
    this.timeStart = setTimeout(() => {
      Animated.timing(this.animateRotage, {
        toValue: 0,
        duration: 350
      }).start(() => {
        Animated.spring(this.animatedScale, {
          toValue: 1,
          friction: 8
        }).start();
      });
    }, 200);
  };

  onModalComment = () => {
    const { item } = this.props;
    this.props.onModalComment(item);
  };

  hightLightText = () => {
    // hightlight text trùng với keyword
    let keyWord = new RegExp(this.valueCard.jp, 'g');
    var htmlContent = this.valueCard.ex.replace(keyWord, '<span style="color:red;">' + this.valueCard.jp + '</span>');
    // trích ra chuỗi nằm giữa 2 dấu *
    var manualReplace = new RegExp(/\*+(.+?)\*+/, 'g');
    var manualHighlightWord = manualReplace.exec(htmlContent);

    //hightlight text trong dấu *
    while (manualHighlightWord) {
      if (manualHighlightWord) htmlContent = htmlContent.replace(manualHighlightWord[0], '<span style="color:red;">' + manualHighlightWord[1] + '</span>');
      manualHighlightWord = manualReplace.exec(htmlContent);
    }
    return (htmlContent = htmlContent.replace(/\n/gi, '<br/>'));
  };

  exampleFlashcard = () => {
    let array = this.hightLightText().split('<br/>');
    let arrayNew = [];
    for (let i = 0; i < array.length; i += 1) {
      let indexStart = array[i].indexOf('{!');
      let indexEnd = array[i].indexOf('!}');
      if (indexStart > 0 && indexEnd > 0) {
        let exam = array[i].slice(0, indexStart);
        let audio = array[i].slice(indexStart + 3, indexEnd).trim();
        let item = { id: i, exam, audio };
        arrayNew.push(item);
      } else {
        arrayNew.push({ exam: array[i], audio: '' });
      }
    }
    return arrayNew;
  };

  onLayout = () => {
    this.ViewParent.measure((x, y, w, h, px, py) => {
      this.setState({ totalTopParent: py });
    });
  };

  renderExample = () => {
    const { exampleFlashcard } = this.state;
    let exampleFlashcar = exampleFlashcard.map((item, index) => {
      return (
        <View style={{ flexDirection: 'row' }} key={index}>
          {!item.audio ? null : (
            <ButtonVolume
              icVolume={{ backgroundColor: 'white' }}
              soundColor={Colors.greenColorApp}
              linkSound={`${UrlConst.MP3}${encodeURI(item.audio)}`}
              isPlayCard={false}
            />
          )}
          <HTMLFurigana style={{ width: item.audio ? 200 * Dimension.scale : 230 * Dimension.scale }} html={item.exam} />
        </View>
      );
    });
    return exampleFlashcar;
  };

  render() {
    const { item, params } = this.props;
    const { exampleFlashcard } = this.state;
    const rotageY1 = this.animateRotage.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg']
    });
    const rotageY2 = this.animateRotage.interpolate({
      inputRange: [0, 1],
      outputRange: ['180deg', '360deg']
    });

    const rolLeft = this.rotageLeft.interpolate({
      inputRange: [-40, 1, 2, 3, 40],
      outputRange: ['-3deg', '-2deg', '2deg', '0deg', '3deg']
    });

    const isPan = item.choose;

    const opacLeft = this.moveFlashCardLeft.interpolate({
      inputRange: [-40, 0],
      outputRange: [1, 0]
    });

    const opacRight = this.moveFlashCardRight.interpolate({
      inputRange: [0, 40],
      outputRange: [0, 1]
    });
    let sizeTextJP = this.valueCard && this.valueCard.jpSz ? parseInt(this.valueCard.jpSz) : 45 * Dimension.scale;

    return (
      <Animated.View
        {...(isPan && !params.typeNotify ? { ...this.panResponder.panHandlers } : null)}
        style={[
          styles.parent,
          {
            transform: [{ translateX: this.animatedValue.x }, { translateY: this.animatedValue.y }, { scale: this.scaleParent }, { rotate: rolLeft }]
          }
        ]}>
        <TouchableOpacity
          onPress={this.onPressToggle}
          activeOpacity={1}
          disabled={item.choose ? false : true}
          ref={(refs) => (this.ViewParent = refs)}
          onLayout={this.onLayout}>
          <View>
            <Animated.View style={[styles.bannerLeft, { opacity: opacLeft }]}>
              <BaseText style={styles.textLeft}>{Lang.flashcard.hint_unfinish}</BaseText>
            </Animated.View>
            <Animated.View style={[styles.bannerRight, { opacity: opacRight }]}>
              <BaseText style={styles.textRight}>{Lang.flashcard.hint_finish}</BaseText>
            </Animated.View>

            <Animated.View
              style={[
                styles.content,
                styles.positionCard,
                {
                  transform: [{ scale: this.animatedScale }, { rotateY: this.props.language == undefined || this.props.language === 0 ? rotageY2 : rotageY1 }],
                  zIndex: this.state.isFront ? 0 : 1
                }
              ]}>
              <ContentFlashcard
                ref={(refs) => (this.contentRef = refs)}
                value={this.valueCard}
                heightFlashcard={this.state.totalTopParent}
                item={item}
                onModalComment={this.onModalComment}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.content,
                {
                  transform: [{ scale: this.animatedScale }, { rotateY: this.props.language == undefined || this.props.language == 0 ? rotageY1 : rotageY2 }],
                  zIndex: this.state.isFront ? 1 : 0
                }
              ]}>
              <View style={styles.viewBefor}>
                <BaseText style={{ ...styles.textVoca, fontSize: sizeTextJP }}>{this.valueCard.jp}</BaseText>
                {this.valueCard.ex && exampleFlashcard ? (
                  <View style={styles.viewExam}>
                    <BaseText style={{ fontSize: 18 }}>{Lang.flashcard.text_example}</BaseText>
                    {this.renderExample()}
                  </View>
                ) : null}
              </View>
              {item.choose == true && this.valueCard.audio != '' ? (
                <View style={styles.viewBottom}>
                  <View style={styles.border} />
                  <View style={styles.viewVolume}>
                    <ButtonVolume linkSound={`${Const.RESOURCE_URL.FLASHCARD.AUDIO}${this.valueCard.audio}`} isPlayCard={this.autoSound} />
                  </View>
                </View>
              ) : null}
            </Animated.View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    width: 250 * Dimension.scale,
    height: 420 * Dimension.scale,
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: '#ddd',
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    backgroundColor: 'white',
    backfaceVisibility: 'hidden'
  },
  parent: {
    position: 'absolute'
  },
  bannerLeft: {
    width: 250 * Dimension.scale,
    height: 40 * Dimension.scale,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: 'yellow',
    position: 'absolute',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bannerRight: {
    width: 250 * Dimension.scale,
    height: 40 * Dimension.scale,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: 'green',
    position: 'absolute',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },

  textLeft: {
    color: 'grey',
    fontSize: 15 * Dimension.scale,
    fontWeight: '500'
  },
  textRight: {
    color: 'white',
    fontSize: 15 * Dimension.scale,
    fontWeight: '500'
  },
  positionCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden'
  },
  border: {
    width: '90%',
    borderBottomWidth: 0.5,
    borderBottomColor: '#333'
  },
  viewBefor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textVoca: {
    color: 'black',
    fontSize: 45 * Dimension.scale,
    fontWeight: 'bold'
  },
  viewVolume: {
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 25
  },
  viewExam: {
    paddingTop: 10,
    width: 250 * Dimension.scale,
    alignItems: 'flex-start',
    paddingHorizontal: 15
  },
  viewBottom: {
    width: '100%',
    alignItems: 'center'
  }
});
