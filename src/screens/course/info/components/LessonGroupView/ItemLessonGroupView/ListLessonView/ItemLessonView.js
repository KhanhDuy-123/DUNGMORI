import Colors from 'assets/Colors';
import Images from 'assets/Images';
import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Animated } from 'react-native';
import FastImage from 'react-native-fast-image';
import Entypo from 'react-native-vector-icons/Entypo';

export default class ItemLessonView extends React.Component {
  constructor(props) {
    super(props);
    this.animatedBackground = new Animated.Value(0);
    this.update = false;
  }

  componentDidMount() {
    if (this.props.item.update) {
      this.onAnimated();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.item.update !== this.update && nextProps.item.update) {
      this.onAnimated();
    }
    return nextProps.item.update !== this.update;
  }

  onAnimated = () => {
    Animated.timing(this.animatedBackground, {
      toValue: 2,
      duration: 2500
    }).start((finished) => {
      if (finished) {
        this.update = false;
        this.animatedBackground.setValue(0);
      }
    });
  };

  onPressDetailLesson = () => {
    const { item } = this.props;
    this.props.onPressDetailLesson(item);
  };

  renderCheck = () => {
    const { item, owned, isStillTime } = this.props;
    let progress = (item.video_progress + item.example_progress) / 2;
    let experiod = owned || isStillTime;
    let isTryLesson = item.price_option === 0;
    if (item.course_id == 5) experiod = true;
    if (!experiod && !isTryLesson) return <FastImage source={Images.icLock} style={styles.lock} resizeMode={FastImage.resizeMode.contain} />;
    if (!experiod && isTryLesson) {
      return (
        <View style={styles.buttonStyle}>
          <BaseText style={styles.trialStyle}>{Lang.detailLesson.text_try_lesson}</BaseText>
        </View>
      );
    }
    if (progress == 100) return <Entypo name="check" size={20} color={Colors.greenColorApp} style={{ marginRight: 10 }} />;
    return null;
  };

  render() {
    const { item, owned, isStillTime } = this.props;
    const backgroundColor = this.animatedBackground.interpolate({
      inputRange: [0, 0.5, 1, 1.5, 2],
      outputRange: ['#FFFFFF', Colors.greenColorApp, Colors.greenColorApp, Colors.greenColorApp, '#FFFFFF']
    });
    const textColor = this.animatedBackground.interpolate({
      inputRange: [0, 1, 2],
      outputRange: ['#000000', '#FFFFFF', '#000000']
    });
    let source = Images.icVideo;
    if (item.type === 'test') {
      source = Images.icQuestion;
    } else if (item.type === 'docs') {
      source = Images.icDoc;
    } else if (item.type === 'flashcard') {
      source = Images.icFlash;
    }
    let disabled = false;
    if (!(owned || item.price_option === 0 || isStillTime)) disabled = true;
    return (
      <Animated.View style={[styles.viewContent, { backgroundColor }]}>
        <TouchableOpacity style={styles.container} disabled={disabled} onPress={this.onPressDetailLesson}>
          <View style={styles.wrappContent}>
            <FastImage source={source} style={styles.icon} resizeMode={FastImage.resizeMode.contain} />
            <Animated.Text style={[styles.nameStyle, { color: textColor }]} numberOfLines={1}>
              {!(owned || isStillTime) && item.is_secret === 1 && item.price_option !== 0 ? Lang.ChooseLessonNew.text_hide_content : item.name}
            </Animated.Text>
          </View>
          {this.renderCheck()}
        </TouchableOpacity>
      </Animated.View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    height: 35 * Dimension.scale,
    borderTopWidth: 0.5,
    borderTopColor: '#8C8C8C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  viewContent: {
    width: Dimension.widthParent - 20,
    paddingHorizontal: 10
  },
  icon: {
    width: 15 * Dimension.scale,
    height: 15 * Dimension.scale
  },
  nameStyle: {
    width: 195 * Dimension.scaleWidth,
    paddingLeft: 10,
    fontSize: 13 * Dimension.scale
  },
  wrappContent: {
    flex: 1,
    paddingRight: 10,
    flexDirection: 'row'
  },
  buttonStyle: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: Colors.greenColorApp
  },
  trialStyle: {
    color: Colors.greenColorApp,
    fontSize: 9 * Dimension.scale
  },
  lock: {
    width: 15 * Dimension.scale,
    height: 15 * Dimension.scale
  }
});
