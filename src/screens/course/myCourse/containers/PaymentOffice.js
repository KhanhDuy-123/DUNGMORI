import React from 'react';
import { View, StyleSheet, ScrollView, Platform, Linking } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import Resource from 'assets/Resource';
import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import DetailListBanner from 'screens/course/lession/DetailListBanner';

export default class PaymentOffice extends React.Component {
  onPressMap = () => {
    const data = {
      id: 1,
      name: Lang.saleLesson.text_name_dungmori,
      link:
        'https://www.google.com/maps/place/Nh%E1%BA%ADt+Ng%E1%BB%AF+D%C5%A9ng+Mori/@21.0016597,105.8200671,17z/data=!4m5!3m4!1s0x3135ac84ffd5e36f:0x127912f9639dc8d9!8m2!3d21.0016547!4d105.8200617'
    };
    this.DetailListBanner.showModal(data);
  };
  render() {
    return (
      <ScrollView contentContainerStyle={[styles.container, this.props.containerStyle]}>
        <View style={styles.viewInfo}>
          <BaseText style={{ ...styles.textTitle, ...this.props.textTitle }}>
            {Lang.buyCourse.text_adress}:{' '}
            <BaseText style={{ ...styles.textAdress, ...this.props.textAdress }}>
              {Lang.buyCourse.text_adress_office}
            </BaseText>
          </BaseText>
        </View>
        <View style={styles.viewHotline}>
          <View style={styles.viewInfo}>
            <View style={styles.viewTitle}>
              <Octicons style={styles.iconDot} name={'primitive-dot'} size={12} color={Resource.colors.greenColorApp} />
              <BaseText style={{ ...styles.textTitle, ...this.props.textTitle }}>
                {Lang.buyCourse.text_hotline_1}
                {' :'}
              </BaseText>
            </View>

            <BaseText style={{ ...styles.textInfo, ...this.props.textInfo }}>
              {Lang.buyCourse.text_number_hotline_1}
            </BaseText>
          </View>
          <View style={styles.viewInfo}>
            <View style={styles.viewTitle}>
              <Octicons style={styles.iconDot} name={'primitive-dot'} size={12} color={Resource.colors.greenColorApp} />
              <BaseText style={{ ...styles.textTitle, ...this.props.textTitle }}>
                {Lang.buyCourse.text_hotline_2}
                {' :'}
              </BaseText>
            </View>
            <BaseText style={{ ...styles.textInfo, ...this.props.textInfo }}>
              {Lang.buyCourse.text_number_hotline_2}
              {' - '}
              <BaseText style={{ ...styles.textInfo, ...this.props.textInfo }}>
                {Lang.buyCourse.text_support}
              </BaseText>
            </BaseText>
          </View>
        </View>
        {this.props.showContent ? null : (
          <View style={styles.viewInfos}>
            <BaseText style={{ ...styles.textTitle, ...this.props.textTitle }}>
              {Lang.buyCourse.text_map}
            </BaseText>
            <BaseText onPress={this.onPressMap} style={styles.textmap}>
              {Lang.buyCourse.text_dungmori}
            </BaseText>
          </View>
        )}
        <DetailListBanner ref={refs => (this.DetailListBanner = refs)} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 25,
    paddingHorizontal: 20
  },
  viewInfo: {
    marginTop: 10,
    flexDirection: 'row'
  },
  viewInfos: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  textInfo: {
    flex: 1,
    fontSize: 13,
    marginLeft: 7,
    lineHeight: 25,
    color: Resource.colors.black1
  },
  viewTitle: {
    flexDirection: 'row'
  },
  textAdress: {
    fontSize: 13,
    marginLeft: 7,
    color: Resource.colors.black1
  },
  iconDot: {
    marginRight: 7
  },
  textTitle: {
    fontSize: 13,
    lineHeight: 25,
    color: Resource.colors.black1
  },
  textmap: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 7,
    color: Resource.colors.greenColorApp
  },
  iconDot: {
    padding: 5
  },
  viewHotline: {
    paddingLeft: 40
  }
});
