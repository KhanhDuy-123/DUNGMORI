import Dimension from 'common/helpers/Dimension';
import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import ItemLessonView from './ItemLessonView';

export default class ListLessonView extends React.Component {
  constructor(props) {
    super(props);
    this.animated = new Animated.Value(0);
  }

  componentDidMount() {
    if (this.props.item.isShow) {
      this.onShowContent();
    } else {
      this.onHideContent();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.item.isShow !== this.props.item.isShow) {
      if (nextProps.item.isShow) {
        this.onShowContent();
      } else {
        this.onHideContent();
      }
    }
    return nextProps.item !== this.props.item || this.state !== nextState;
  }

  onShowContent = () => {
    Animated.spring(this.animated, {
      toValue: 1,
      speed: 10,
      bounciness: 0
    }).start();
  };

  onHideContent = () => {
    Animated.spring(this.animated, {
      toValue: 0,
      speed: 30,
      bounciness: 0
    }).start();
  };

  render() {
    const { item, isStillTime } = this.props;
    let lengthLessons = item.lessons?.length > 0 ? item.lessons?.length : 0;
    let translateY = this.animated.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 35 * Dimension.scale * lengthLessons]
    });
    if (item.lessons?.length < 1) return null;
    return (
      <Animated.View style={[styles.container, { height: translateY }]}>
        {item.isShow &&
          item.lessons.map((val, index) => {
            return (
              <View key={index}>
                <ItemLessonView item={val} owned={this.props.owned} onPressDetailLesson={this.props.onPressDetailLesson} isStillTime={isStillTime} />
              </View>
            );
          })}
      </Animated.View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  }
});
