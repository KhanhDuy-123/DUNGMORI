import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
const width = Dimension.widthParent;

export default class DetailedCourseInfo extends PureComponent {
  state = {
    statusData: {}
  };

  render() {
    const { params, isKaiwa } = this.props;
    const color = isKaiwa ? '#ffb629' : '#d6902e';
    const price = params?.price && params?.name !== 'Chuyên Ngành' ? Funcs.convertPrice(params.price) : 0;
    let jpy = params?.jpy_price && params?.name !== 'Chuyên Ngành' ? Funcs.formatNumber(params.jpy_price) : 0;
    if (params?.name == 'N5') jpy = 0;
    return (
      <View style={styles.boxInfo}>
        <View style={[styles.info, this.props.viewInfo]}>
          <BaseText style={[styles.titleInfo, { color }]}>{Lang.learn.text_videos}</BaseText>
          <BaseText style={[styles.titleValue, { color }]}>{params?.stats_data?.video}</BaseText>
        </View>
        <View style={styles.boderInfo} />
        <View style={[styles.info, this.props.viewInfo]}>
          <BaseText style={[styles.titleInfo, { color }]}>{Lang.learn.text_lesson}</BaseText>

          <BaseText style={[styles.titleValue, { color }]}>{params?.stats_data?.lesson}</BaseText>
        </View>
        <View style={styles.boderInfo} />
        <View style={[styles.info, this.props.viewInfo]}>
          <BaseText style={[styles.titleInfo, { color }]}>{Lang.learn.text_price}</BaseText>
          <BaseText style={[styles.titleValue, { color }]}>{price}</BaseText>
          <BaseText style={[styles.titleValue, { color }]}>{`${jpy}¥`}</BaseText>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  boxInfo: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
    // alignItems: 'center'
  },
  info: {
    width: width / 3 - 20
  },
  boderInfo: {
    height: 22 * Dimension.scale,
    width: 0.4,
    backgroundColor: Resource.colors.border
  },
  titleInfo: {
    fontSize: 12 * Dimension.scale,
    textAlign: 'center',
    color: Resource.colors.black3
  },
  titleValue: {
    fontSize: 12 * Dimension.scale,
    marginTop: 5,
    fontWeight: '500',
    textAlign: 'center',
    color: Resource.colors.greenColorApp
  }
});
