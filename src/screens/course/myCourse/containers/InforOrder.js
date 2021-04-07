import Images from 'assets/Images';
import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';

const heightViewInfor = 63 * Dimension.scale;
const heightImage = 60 * Dimension.scale;

export default class InforOrder extends React.Component {
  render() {
    const { buyCourse } = this.props;
    let isCombo = buyCourse.services?.courses?.length > 1;
    let icon = Images.getIconBuyCourse(buyCourse.services?.courses[0] || buyCourse.id, isCombo && buyCourse.name);
    return (
      <View style={styles.container}>
        <BaseText style={styles.title}>{Lang.buyCourse.text_title_info}</BaseText>
        <View style={styles.boxItem}>
          <View style={styles.item}>
            <View style={styles.view} />
            <FastImage resizeMode={FastImage.resizeMode.conver} style={styles.imageThumb} source={icon} />
            <View style={styles.detail}>
              <View style={styles.detailCourse}>
                <View style={styles.viewExpired}>
                  <BaseText style={{ ...styles.textExpireds, fontWeight: '600' }}>
                    {isCombo ? Lang.buyCourse.text_combo : Lang.buyCourse.text_course} <BaseText style={styles.textValueName}>{buyCourse.name}</BaseText>
                  </BaseText>
                </View>
                <View style={styles.viewExpired}>
                  <BaseText style={styles.textExpired}>{Lang.buyCourse.text_price}:</BaseText>
                  <BaseText style={{ ...styles.textValue, fontWeight: 'bold' }}>
                    {Funcs.convertPrice(buyCourse.price)}
                    {/* <BaseText style={styles.unit}>đ</BaseText> */}
                  </BaseText>
                </View>
              </View>
              <View style={styles.detailExpired}>
                <View style={styles.viewExpired}>
                  <BaseText style={styles.textExpired}>{Lang.buyCourse.text_code}:</BaseText>
                  <BaseText style={styles.textValues}>{buyCourse ? buyCourse.desc : ''}</BaseText>
                </View>
                <View style={styles.viewExpired}>
                  <BaseText style={styles.textExpired}>{Lang.buyCourse.text_duration}:</BaseText>
                  <BaseText style={styles.textValues}>
                    {buyCourse && buyCourse.services ? buyCourse.services.course_watch_expired_value : buyCourse.watch_expired}{' '}
                    <BaseText style={styles.textValues}>{Lang.saleLesson.text_day}</BaseText>
                  </BaseText>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.total}>
          <BaseText style={styles.textTotal}>{Lang.buyCourse.text_total_money}:</BaseText>
          <BaseText style={styles.textTotal}>{Funcs.convertPrice(buyCourse.price)}</BaseText>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Resource.colors.white100
  },
  boxItem: {
    marginTop: 15,
    marginBottom: 20,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  title: {
    fontSize: 16 * Dimension.scale,
    color: Resource.colors.black1,
    fontWeight: '600'
  },
  item: {
    width: '95%',
    height: heightViewInfor,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Resource.colors.borderWidth,
    backgroundColor: Resource.colors.white100,
    shadowColor: Resource.colors.grey600,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 5,
    shadowRadius: Platform.OS === 'ios' ? 10 : 4,
    elevation: Platform.OS === 'ios' ? 0.3 : 5
  },
  imageThumb: {
    width: heightImage,
    aspectRatio: 1 / 1,
    borderRadius: 10,
    position: 'absolute',
    top: -17 * Dimension.scale,
    left: -17 * Dimension.scale
  },
  view: {
    width: 50 * Dimension.scale,
    aspectRatio: 1 / 1
  },
  detail: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  detailCourse: {
    flex: 1,
    paddingRight: 7
  },
  detailExpired: {
    alignContent: 'center',
    paddingRight: 5
  },
  viewExpired: {
    flexDirection: 'row',
    paddingVertical: 5
  },
  textExpireds: {
    fontSize: 11 * Dimension.scale,
    color: Resource.colors.black1
  },
  textExpired: {
    fontSize: 9 * Dimension.scale,
    color: Resource.colors.black1
  },
  unit: {
    fontSize: 9 * Dimension.scale,
    color: Resource.colors.greenColorApp
  },
  textValueName: {
    flex: 1,
    fontSize: 10 * Dimension.scale,
    marginLeft: 5,
    fontWeight: '600',
    color: Resource.colors.black1
  },
  textValue: {
    fontSize: 10 * Dimension.scale,
    marginLeft: 5,
    color: Resource.colors.greenColorApp
  },
  textValues: {
    fontSize: 9 * Dimension.scale,
    marginLeft: 5,
    fontWeight: '400',
    color: Resource.colors.greenColorApp
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5
  },
  textTotal: {
    color: Resource.colors.red700,
    fontSize: 13
  }
});
