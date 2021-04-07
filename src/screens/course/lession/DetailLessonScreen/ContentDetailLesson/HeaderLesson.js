import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import Header from 'common/components/base/Header';
import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { getStatusBarHeight } from 'common/helpers/IPhoneXHelper';
import BaseText from 'common/components/base/BaseText';
const STATUS_BAR_HEIGHT = getStatusBarHeight();

export default class HeaderLesson extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onBackPress = () => {
    this.props.onBackPress();
  };

  onPressGoChooseLesson = () => {
    this.props.onPressGoChooseLesson();
  };

  rightTitle = () => {
    let rightTitle = Lang.detailLesson.text_buy_course;
    const { checkTypeCard, isStillTime, courseName } = this.props;
    if (checkTypeCard) rightTitle = '';
    if (isStillTime || courseName == 'N5') rightTitle = Lang.chooseLession.text_right_title_viewmore;
    return rightTitle;
  };

  render() {
    const { heightHeader, nameCourse, isTryLesson, lessonName } = this.props;
    let translate = 0;
    let title = '';
    if (lessonName) title = lessonName;
    return (
      <Animated.View style={{ height: heightHeader }}>
        <Animated.View style={{ flex: 1, marginTop: STATUS_BAR_HEIGHT, transform: [{ translateY: translate }] }}>
          <Header
            left={true}
            text={nameCourse ? `${nameCourse} (${title})` : null}
            titleStyle={styles.titleStyle}
            colorBackButton={Resource.colors.black1}
            titleArea={styles.titleArea}
            headerStyle={styles.headerStyle}
            onBackPress={this.onBackPress}
            onScrollTopHeader={this.onBackPress}
            right={isTryLesson ? true : false}
            rightTitle={this.rightTitle()}
            rightTitleStyle={styles.rightTitleStyle}
            buttonRight={this.onPressGoChooseLesson}
          />
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  titleStyle: {
    color: Resource.colors.black1,
    fontStyle: 'italic',
    fontSize: 18
  },
  headerStyle: {
    backgroundColor: Resource.colors.white100
  },
  areaHeaderText: {
    alignItems: 'flex-start'
  },
  titleArea: {
    alignItems: 'flex-start'
  },
  rightTitleStyle: {
    fontSize: 13,
    fontWeight: '500',
    color: Resource.colors.greenColorApp,
    fontStyle: 'italic'
  },
  textLesson: {
    marginHorizontal: 10,
    fontSize: 14
  }
});
