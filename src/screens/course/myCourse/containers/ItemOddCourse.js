import Images from 'assets/Images';
import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import ModalLoginRequiment from 'common/components/base/ModalLoginRequiment';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import NavigationService from 'common/services/NavigationService';
import CourseConst from 'consts/CourseConst';
import ScreenNames from 'consts/ScreenName';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Utils from 'utils/Utils';

const heightViewInfor = 63 * Dimension.scale;
const heightImage = 55 * Dimension.scale;

export default class ItemOddCourse extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  onPressItem = () => {
    const { item, type } = this.props;
    if (item.services.courses.length == 1) {
      const data = item;
      data.id = item.services.courses[0];
      if (item.premium === 1) {
        NavigationService.navigate(ScreenNames.DetailCourseNewScreen, { item });
      } else {
        NavigationService.navigate(ScreenNames.DetailCourseScreen, { item: data, type: type });
      }
    } else {
      NavigationService.navigate(ScreenNames.DetailComboScreen, { data: item });
    }
  };

  onPressBuy = () => {
    const { item } = this.props;
    let params = {
      course_id: item.services.courses,
      name: item.name,
      owned: item.owned,
      premium: item.premium
    };
    if (!Utils.user || !Utils.user.id) ModalLoginRequiment.show();
    else if (item.price_option == 0 || item.owned == 1) {
      if (params.premium === 1) {
        NavigationService.navigate(ScreenNames.CourseProgressScreen, { params });
      } else {
        NavigationService.navigate(ScreenNames.ChooseLessionScreen, { params, updateData: this.props.updateData });
      }
    } else {
      NavigationService.navigate(ScreenNames.DetailBuyCourseScreen, { buyCourse: item, type: 'buyCourse' });
    }
  };

  render() {
    const { item } = this.props;
    let jpy = item.id !== CourseConst.SPECIAL.ID ? item.jpy_price : 0;
    if (item.name == 'N5') jpy = 0;
    let isCombo = item.services?.courses?.length > 1;
    let icon = Images.getIconBuyCourse(item.services?.courses[0] || item.id, isCombo && item.name);
    if (item.price == 0) {
      return null;
    } else {
      return (
        <View style={styles.container} key={item.id}>
          <TouchableOpacity activeOpacity={0.5} onPress={this.onPressItem}>
            <View style={styles.containerInfor}>
              <View style={styles.viewInforCourse}>
                <View style={styles.emptyView} />
                <View style={styles.inforViewCourse}>
                  <View style={styles.showInforCourse}>
                    <View style={styles.boxInfo}>
                      <BaseText style={styles.textNameCourse}>
                        {item.services.courses > 1 ? Lang.saleLesson.text_course : Lang.saleLesson.text_combo} {item.name}
                      </BaseText>
                    </View>
                    <View style={styles.detailCourse}>
                      <View style={styles.boxInfo}>
                        <BaseText style={styles.titlePrice}>{Lang.saleLesson.text_price}</BaseText>
                        <BaseText style={styles.textPrice}> {item.price_option == 0 ? Lang.saleLesson.text_Free : Funcs.convertPrice(item.price)}</BaseText>
                      </View>
                      <View style={styles.boxInfo}>
                        <BaseText style={styles.textCodeTitle}>{Lang.saleLesson.text_code}</BaseText>
                        <BaseText style={styles.textCodeValue}>{item.desc}</BaseText>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 2 }}>
                      <BaseText style={styles.titlePrice}>{Lang.learn.text_money_japan}</BaseText>
                      <BaseText style={styles.textPrice}>{` ${Funcs.formatNumber(jpy)}¥`}</BaseText>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={styles.buttonBuy} onPress={this.onPressBuy}>
                  <BaseText numberOfLines={2} style={styles.textButton}>
                    {item.price_option == 0 || item.owned == 1 ? Lang.saleLesson.button_learn_now : Lang.saleLesson.text_buy_course}
                  </BaseText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
          <FastImage resizeMode={FastImage.resizeMode.stretch} source={icon} style={styles.imgCourse} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10 * Dimension.scale
  },
  imgCourse: {
    width: heightImage,
    aspectRatio: 1 / 1,
    borderRadius: 8 * Dimension.scale,
    position: 'absolute',
    borderWidth: 1,
    borderColor: Resource.colors.border,
    backgroundColor: Resource.colors.white100
  },
  containerInfor: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: Resource.colors.white100
  },
  viewInforCourse: {
    width: '95%',
    height: heightViewInfor,
    shadowColor: Resource.colors.grey600,
    shadowOffset: { width: 0, height: 2 },
    borderRadius: 10 * Dimension.scale,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderColor: 'white',
    backgroundColor: Resource.colors.white100,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10 * Dimension.scale,
    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 5,
    shadowRadius: Platform.OS === 'ios' ? 5 : 4,
    elevation: Platform.OS === 'ios' ? 1.2 : 5
  },
  emptyView: {
    width: 38 * Dimension.scale
  },
  inforViewCourse: {
    flex: 1,
    justifyContent: 'space-between',
    paddingRight: 10
  },
  showInforCourse: {
    flex: 1,
    justifyContent: 'center'
  },
  boxInfo: {
    flexDirection: 'row'
  },
  detailCourse: {
    flexDirection: 'row',
    marginRight: 5
  },
  textNameCourse: {
    fontSize: 12 * Dimension.scale,
    color: Resource.colors.black1,
    marginBottom: 5,
    fontWeight: '500'
  },
  titlePrice: {
    fontSize: 10 * Dimension.scale,
    color: Resource.colors.black1
  },
  textPrice: {
    fontWeight: '700',
    color: Resource.colors.greenColorApp,
    fontSize: 10 * Dimension.scale
  },
  textCodeTitle: {
    marginLeft: 7 * Dimension.scale,
    fontSize: 10 * Dimension.scale
  },
  textCodeValue: {
    marginLeft: 3,
    color: Resource.colors.greenColorApp,
    fontWeight: '600',
    fontSize: 10 * Dimension.scale
  },
  textCode: {
    flex: 1,
    color: Resource.colors.greenColorApp,
    fontSize: 10 * Dimension.scale,
    fontWeight: '600'
  },
  buttonBuy: {
    backgroundColor: Resource.colors.greenColorApp,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8 * Dimension.scale,
    width: 58 * Dimension.scale,
    height: 32 * Dimension.scale
  },
  textButton: {
    textAlign: 'center',
    color: Resource.colors.white100,
    fontSize: 9 * Dimension.scale,
    fontWeight: 'bold'
  }
});
