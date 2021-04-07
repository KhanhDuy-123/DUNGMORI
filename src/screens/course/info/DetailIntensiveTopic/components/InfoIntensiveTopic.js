import Colors from 'assets/Colors';
import Images from 'assets/Images';
import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import Funcs from 'common/helpers/Funcs';

class InfoIntensiveTopic extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderExperiod = () => {
    const { course } = this.props;
    return (
      <View style={styles.infoExpired}>
        <View style={styles.viewExpired}>
          <BaseText style={styles.textExpired}>{`${Lang.buyCourse.text_duration}:`}</BaseText>
          <BaseText style={styles.textValueExpired}>
            {course?.watch_expired} {Lang.saleLesson.text_day.toLowerCase()}
            <BaseText style={styles.textValue}> {Lang.saleLesson.text_active_day}</BaseText>
          </BaseText>
        </View>
        <View style={styles.viewExpired}>
          <BaseText style={styles.textExpired}>{Lang.saleLesson.text_lecturers}</BaseText>
          <BaseText style={styles.textTeacher}>{course?.teacher}</BaseText>
        </View>
      </View>
    );
  };

  render() {
    const { course } = this.props;
    const price = course?.price ? Funcs.convertPrice(course.price) : 0;
    let jpy = course?.jpy_price ? Funcs.formatNumber(course.jpy_price) : 0;
    return (
      <View style={styles.container}>
        <View style={[styles.viewBanner, styles.styleLayout]}>
          <View style={[styles.borderBanner, styles.styleLayout]}>
            <View style={[styles.viewTitle, styles.styleLayout]}>
              <FastImage
                source={Images.intensive.icDocument}
                style={{ ...styles.iconVideo, transform: [{ rotate: '-30deg' }] }}
                resizeMode={FastImage.resizeMode.contain}
              />
              <FastImage source={Images.intensive.iconSnow} style={styles.iconSnow} resizeMode={FastImage.resizeMode.contain} />
              <BaseText style={styles.textTitle}>{Lang.intensive.textInDepthTraning}</BaseText>
              <FastImage
                source={Images.intensive.iconSnow}
                style={{ ...styles.iconSnow, transform: [{ rotateY: '180deg' }] }}
                resizeMode={FastImage.resizeMode.contain}
              />
              <FastImage source={Images.intensive.icPlayVideo} style={styles.iconVideo} resizeMode={FastImage.resizeMode.contain} />
            </View>
            <View style={styles.viewTitle}>
              <FastImage source={Images.intensive.icPen} style={styles.iconPen} resizeMode={FastImage.resizeMode.contain} />
              <BaseText style={styles.textDes}>{Lang.intensive.textDescriptionLayout}</BaseText>
              <FastImage
                source={Images.intensive.icPen}
                style={{ ...styles.iconPen, transform: [{ rotateY: '180deg' }] }}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          </View>
        </View>
        <View style={styles.parentBox}>
          <View style={styles.boxInfo}>
            <View style={styles.info}>
              <BaseText style={styles.titleInfo}>{Lang.learn.text_videos}</BaseText>
              <BaseText style={styles.titleValue}>{course?.stats_data?.video}</BaseText>
            </View>
            <View style={styles.boderInfo} />
            <View style={styles.info}>
              <BaseText style={styles.titleInfo}>{Lang.learn.text_lesson}</BaseText>
              <BaseText style={styles.titleValue}>{course?.stats_data?.lesson}</BaseText>
            </View>
            <View style={styles.boderInfo} />
            <View style={styles.info}>
              <BaseText style={styles.titleInfo}>{Lang.learn.text_price}</BaseText>
              <BaseText style={styles.titleValue}>{price}</BaseText>
              <BaseText style={styles.titleValue}>{`${jpy}¥`}</BaseText>
            </View>
          </View>
          {this.renderExperiod()}
        </View>
        <TouchableOpacity style={[styles.buttonStyle, styles.styleLayout]}>
          <BaseText style={styles.textButton}>{Lang.intensive.textBuyCoursePractice}</BaseText>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  viewBanner: {
    width: Dimension.widthParent - 20,
    height: 70,
    borderRadius: 7,
    marginTop: 12,
    backgroundColor: '#CACBFF'
  },
  borderBanner: {
    width: Dimension.widthParent - 30,
    height: 60,
    borderWidth: 1,
    borderColor: Colors.white100,
    borderRadius: 7
  },
  styleLayout: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewTitle: {
    flexDirection: 'row'
  },
  textTitle: {
    fontSize: 12 * Dimension.scale,
    color: Colors.violet,
    fontWeight: 'bold',
    paddingHorizontal: 10
  },
  textDes: {
    fontSize: 8.5 * Dimension.scale,
    color: Colors.black,
    fontWeight: 'bold',
    paddingHorizontal: 7
  },
  iconVideo: {
    width: 28,
    height: 28,
    marginLeft: 7
  },
  iconPen: {
    width: 13,
    height: 13,
    marginTop: 5
  },
  iconSnow: {
    width: 20,
    height: 20
  },
  boxInfo: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  parentBox: {
    width: Dimension.widthParent - 20,
    marginTop: 5
  },
  info: {
    width: Dimension.widthParent / 3 - 20
  },
  boderInfo: {
    height: 22 * Dimension.scale,
    width: 1,
    backgroundColor: Colors.border
  },
  titleInfo: {
    fontSize: 10 * Dimension.scale,
    textAlign: 'center',
    color: Colors.black
  },
  titleValue: {
    fontSize: 10 * Dimension.scale,
    marginTop: 5,
    textAlign: 'center',
    color: Colors.violet
  },
  infoExpired: {
    marginTop: 5,
    paddingHorizontal: 20
  },
  viewExpired: {
    flexDirection: 'row',
    marginBottom: 5
  },
  textExpired: {
    flex: 1,
    fontSize: 10 * Dimension.scale,
    color: Colors.black
  },
  textTeacher: {
    flex: 1,
    fontSize: 10 * Dimension.scale,
    lineHeight: 18 * Dimension.scale,
    color: Colors.black,
    textAlign: 'right'
  },
  textValue: {
    fontSize: 10 * Dimension.scale,
    color: Colors.violet
  },
  textValueExpired: {
    fontSize: 10 * Dimension.scale,
    color: Colors.violet
  },
  buttonStyle: {
    width: 130 * Dimension.scale,
    height: 30 * Dimension.scale,
    borderRadius: 20 * Dimension.scale,
    backgroundColor: '#FFBA3B'
  },
  textButton: {
    fontSize: 10 * Dimension.scale,
    fontWeight: '600',
    color: Colors.black3
  }
});
const mapStateToProps = (state) => ({
  course: state.courseReducer.course
});
export default connect(mapStateToProps)(InfoIntensiveTopic);
