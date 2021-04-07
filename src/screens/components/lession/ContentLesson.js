import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import TextPercentProgress from 'common/components/base/TextPercentProgress';
import React, { Component } from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Dimension from 'common/helpers/Dimension';
import ItemChoose from './ItemChoose';
const width = Dimension.widthParent;

export default class ContentLesson extends Component {
  constructor(props) {
    super(props);
    let data = {};
    let index = 0;
    if (props.section) {
      data = props.section;
    }
    if (props.index) {
      index = props.index;
    }
    this.animated = new Animated.Value(0);
    this.state = {
      data: data,
      index: index,
      heightList: 0,
      active: props.section.isActive
    };
    this.height = 0;
  }

  onPressShowContent = () => {
    this.props.onPressShowData(this.props.section);
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.section.isActive !== this.props.section.isActive) {
      if (nextProps.section.isActive) {
        this.setState({ active: true }, this.onShowContent);
      } else {
        this.onHideContent((finished) => {
          if (finished) this.setState({ active: false });
        });
      }
    }
    let isUpdate = false;
    if (nextProps.section.update) {
      isUpdate = nextProps.section.update;
    }
    if (nextProps.section.progress !== this.props.section.progress) {
      isUpdate = true;
    }
    if (nextProps.section.selected !== this.props.section.selected) {
      isUpdate = true;
    }
    return isUpdate || nextState.active !== this.state.active;
  }

  onShowContent = () => {
    Animated.spring(this.animated, {
      toValue: 1,
      speed: 12,
      bounciness: 0
    }).start();
  };

  onHideContent = (callback) => {
    Animated.spring(this.animated, {
      toValue: 0,
      speed: 20,
      bounciness: 0
    }).start(callback);
  };

  renderItem = ({ item, index }) => {
    return (
      <ItemChoose
        active={item.isActive}
        courseName={this.props.courseName}
        item={item}
        index={index}
        courseId={this.props.courseId}
        sectionId={this.props.sectionId}
        onNavigateDetailLesson={this.props.onNavigateDetailLesson}
        type={this.props.typeRead}
        isStillExpired={this.props.isStillExpired}
        selected={this.props.section.selected}
      />
    );
  };

  renderProgress = () => {
    const { section, courseName } = this.props;
    let showProgress = false;
    let showLogSpecial = false;
    if (section.is_specialezed && section.is_specialezed == 1) {
      showProgress = section.selected == 1 && this.props.isStillExpired ? true : false;
      showLogSpecial = section.is_specialezed == 1 && !this.props.isStillExpired ? true : false;
    } else if (this.props.isStillExpired || courseName == 'N5') {
      showLogSpecial = false;
      showProgress = true;
    }
    let colors = Resource.colors.redCircle;
    if (section.progress <= 25) {
      colors = Resource.colors.redCircle;
    } else if (section.progress <= 50) {
      colors = Resource.colors.yellowCircle;
    } else if (section.progress <= 75) {
      colors = Resource.colors.greenCircle;
    } else if (section.progress <= 100) {
      colors = Resource.colors.greenComplete;
    }
    if (showProgress) {
      return (
        <AnimatedCircularProgress
          size={38}
          width={3 * Dimension.scale}
          fill={section && section.progress ? section.progress : 0}
          tintColor={colors}
          backgroundColor={Resource.colors.greyProgress}
          rotation={0}
          duration={1200}
          easing={Easing.linear}>
          {(fill) => <TextPercentProgress percent={section && section.progress ? section.progress : 0} textStyle={styles.textPercent} />}
        </AnimatedCircularProgress>
      );
    } else if (showLogSpecial) {
      return <FontAwesome name="lock" color="grey" size={20} />;
    }
    return null;
  };

  renderListContent = (translateList) => {
    const { section } = this.props;
    if (!section.isActive) return null;
    return (
      <Animated.FlatList
        data={section.lessons}
        extraData={this.props}
        keyExtractor={(item, index) => index.toString()}
        renderItem={this.renderItem}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
      />
    );
  };

  render() {
    const { section, headerStyles, parentHeaderStyle } = this.props;
    const lengthLesson = section.lessons ? section.lessons.length : 0;
    let translateY = this.animated.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 50 * lengthLesson]
    });

    let translateList = this.animated.interpolate({
      inputRange: [0, 1],
      outputRange: [-50 * lengthLesson, 0]
    });

    let sectionName = section.name.split('*');

    //render các giai đoạn của khoá học
    if (section.is_step == 1) {
      return (
        <View style={styles.viewStep}>
          <BaseText style={styles.textStep}>{section.name.toUpperCase()}</BaseText>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={[styles.parentContent, parentHeaderStyle]}>
          <TouchableOpacity style={styles.header} onPress={this.onPressShowContent} activeOpacity={1}>
            <View style={[styles.contentHeader, headerStyles]}>
              <View style={[styles.areaTextTitle]}>
                <BaseText style={styles.textTitle} numberOfLines={1}>
                  {sectionName[0]}
                </BaseText>
                {sectionName.length > 1 && (
                  <View style={styles.viewNew}>
                    <BaseText style={styles.textNew}>New</BaseText>
                  </View>
                )}
              </View>
              {this.renderProgress()}
            </View>
          </TouchableOpacity>
          <Animated.View style={[styles.viewAnimated, { height: translateY }]}>{this.renderListContent(translateList)}</Animated.View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  header: {
    // marginVertical: 5
  },
  contentHeader: {
    height: 50,
    width: width - 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: 'grey',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 1
  },
  textTitle: {
    fontSize: 12 * Dimension.scale,
    color: Resource.colors.black1,
    fontWeight: '500',
    flex: 1
  },
  content: {
    width: width - 20,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Resource.colors.white100,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    borderRadius: 8
  },
  textArea: {
    width: '88%'
  },
  textTitleLession: {
    fontSize: 9 * Dimension.scale,
    color: Resource.colors.black1,
    fontWeight: '500'
  },
  textPercent: {
    fontSize: 9,
    fontWeight: '400',
    color: Resource.colors.black1
  },
  areaTextTitle: {
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  viewStep: {
    width,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5
  },
  textStep: {
    fontWeight: 'bold',
    fontSize: 18,
    color: Resource.colors.black1
  },
  parentContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: 'grey',
    shadowOffset: { width: 1, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2
  },
  viewNew: {
    borderRadius: 10,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginLeft: 10,
    paddingVertical: 2
  },
  textNew: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold'
  },
  viewAnimated: {
    // overflow: 'hidden',
    borderRadius: 10
  }
});
