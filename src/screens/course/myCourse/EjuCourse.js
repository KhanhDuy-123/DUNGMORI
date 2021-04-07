import Colors from 'assets/Colors';
import Images from 'assets/Images';
import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import NavigationService from 'common/services/NavigationService';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import HomeActionCreator from 'states/redux/actionCreators/HomeActionCreator';

export default class EjuCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onUpdateData = () => {
    HomeActionCreator.getHomeLesson();
  };

  onPressItem = (item) => () => {
    if (item.price == 0 || item.owned == 1) {
      let params = { ...item };
      params.course_id = item.id;
      if (params.premium === 1) {
        NavigationService.navigate(ScreenNames.CourseProgressScreen, { params, updateData: this.onUpdateData });
      } else {
        NavigationService.navigate(ScreenNames.ChooseLessionScreen, { params, updateData: this.onUpdateData });
      }
    } else {
      let type = Const.COURSE_TYPE.EJU;
      if (item.premium === 1) {
        NavigationService.navigate(ScreenNames.DetailCourseNewScreen, { item, type, updateData: this.onUpdateData });
      } else {
        NavigationService.navigate(ScreenNames.DetailCourseScreen, { item, type, updateData: this.onUpdateData });
      }
    }
  };

  renderTitle = (item) => {
    let titleName = '';
    let backgroundColor = Colors.greenColorApp;
    if (item.price == 0) {
      titleName = Lang.homeScreen.text_free;
      backgroundColor = '#FF9A00';
    } else if (item.owned == 1) titleName = Lang.homeScreen.text_bought;
    if (titleName == '') return null;
    return (
      <View style={[styles.viewTitle, { backgroundColor }]}>
        <BaseText style={styles.titleName}>{titleName}</BaseText>
      </View>
    );
  };

  renderItem = (item, index) => {
    let imgSource = Images.ejuJapan;
    if (item.name == 'EJU - Toán') imgSource = Images.ejuMath;
    else if (item.name == 'EJU - XHTH') imgSource = Images.ejuSocial;
    return (
      <View style={styles.wrapperItem} key={index}>
        {index == 1 && <View style={styles.indicator} />}
        <TouchableOpacity style={styles.buttonLeft} onPress={this.onPressItem(item)}>
          <FastImage source={imgSource} style={styles.icon} />
          <BaseText style={styles.textTitle}>{item.name}</BaseText>
          {this.renderTitle(item)}
        </TouchableOpacity>
        {index == 1 && <View style={styles.indicator} />}
      </View>
    );
  };

  render() {
    const { listEju } = this.props;
    if (!listEju) return null;
    return <View style={styles.container}>{listEju?.map(this.renderItem)}</View>;
  }
}

const iconRatio = 16 / 18;
const styles = StyleSheet.create({
  container: {
    width: Dimension.widthParent - 30,
    height: 95 * Dimension.scale,
    alignSelf: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    backgroundColor: 'white',
    flexDirection: 'row',
    borderRadius: 8,
    elevation: 3
  },
  buttonLeft: {
    flex: 1,
    height: 95 * Dimension.scale,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: 26 * Dimension.scale,
    height: (26 * Dimension.scale) / iconRatio
  },
  indicator: {
    width: 1,
    height: '100%',
    backgroundColor: '#CCCCCC'
  },
  textTitle: {
    fontSize: 9 * Dimension.scale,
    textAlign: 'center',
    fontWeight: '500',
    paddingTop: 5 * Dimension.scale
  },
  viewTitle: {
    paddingHorizontal: 7,
    height: 11 * Dimension.scale,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10 * Dimension.scale
  },
  titleName: {
    fontSize: 7,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginHorizontal: 3,
    marginVertical: 2
  },
  wrapperItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  }
});
