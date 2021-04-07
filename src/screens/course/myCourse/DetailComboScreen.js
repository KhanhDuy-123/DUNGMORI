import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import KeyboardHandle from 'common/components/base/KeyboardHandle';
import LoadingModal from 'common/components/base/LoadingModal';
import InputComment from 'screens/components/comment/InputComment';
import ListComment from 'screens/components/comment/ListComment';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React, { Component } from 'react';
import { Animated, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import NavigationService from 'common/services/NavigationService';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import Configs from 'utils/Configs';
const width = Dimension.widthParent;

const heightViewInfor = 63 * Dimension.scale;
const heightImage = 60 * Dimension.scale;
var id = '';
class DetailComboScreen extends Component {
  scrollY = new Animated.Value(0);
  constructor(props) {
    super(props);
    const { data, typeNotify } = this.props.navigation.state.params;
    this.notifyData = {};
    if (typeNotify) {
      id = data.table_id;
    } else {
      id = data.id;
    }

    try {
      this.notifyData = data;
      if (this.notifyData.dataNoti && !this.notifyData.dataNoti.commentId) this.notifyData.dataNoti = JSON.parse(data.dataNoti);
    } catch (error) {
      Funcs.log(error);
    }

    this.state = {
      combo: {},
      loading: true
    };

    this.typeNotify = typeNotify;
    this.heightHeaderContent = 0;
  }

  async componentDidMount() {
    LoadingModal.show();
    var res = await Fetch.get(Const.API.HOME.GET_COMBO_COURSE, { id: id });
    LoadingModal.hide();
    if (res.status === Fetch.Status.SUCCESS) {
      var combo = res.data.result;
      try {
        combo.services = JSON.parse(combo.services);
        combo.data.map((e) => {
          let resoure = Resource.images.icon.icN1;
          if (e.name.toUpperCase() == 'KAIWA') {
            resoure = Resource.images.icKAIWA;
          } else {
            resoure = Resource.images.icon[`ic${e.name}`];
          }
          e.resource = resoure;
          return (e.stats_data = JSON.parse(e.stats_data));
        });
      } catch (err) {
        combo.services = {};
      }
      this.setState({
        combo,
        loading: false
      });
    } else {
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeScrollComent);
  }

  onPressByCourse = () => {};

  onPressBack = () => {
    NavigationService.pop();
  };

  onPressDetailCourse = (item) => () => {
    const { lesson } = this.props.navigation.state.params;
    const { listCourse } = this.props;
    let listCourses = listCourse.find((val) => item.id === val.id);
    if (listCourses?.premium === 1) {
      NavigationService.navigate(ScreenNames.DetailCourseNewScreen, { item });
    } else {
      NavigationService.navigate(ScreenNames.DetailCourseScreen, { item, lesson, type: Const.TYPE_VIEW_DUNGMORI });
    }
  };

  onPressDetailBuyCourse = () => {
    const { data } = this.props.navigation.state.params;
    let buyCourse = data;
    NavigationService.navigate(ScreenNames.DetailBuyCourseScreen, { buyCourse });
  };

  onPressBackground = () => {
    this.refs.InputComment.hideContent();
  };

  onBlurInputComment = () => {};

  onFocusInputComment = () => {};

  onGetHeightContentHeader = (event) => {
    if (this.typeNotify) {
      this.heightHeaderContent = event.nativeEvent.layout.height;
    }
  };

  //border bottom header
  getHeaderBorderColor = () => {
    return this.scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: ['rgba(255,255,255,0.0)', '#eee'],
      extrapolate: 'clamp',
      useNativeDriver: true
    });
  };

  onScrollToComment = () => {
    if (this.typeNotify) {
      this.timeScrollComent = setTimeout(() => {
        this.ScrollView.scrollTo({ y: this.heightHeaderContent + 10, x: 0, animated: true });
      }, 600);
    }
  };

  renderItem() {
    const { combo } = this.state;
    return (
      <View style={styles.containerItem}>
        {combo.data?.map((item, index) => {
          const statusData = item.stats_data;
          return (
            <TouchableOpacity key={index} onPress={this.onPressDetailCourse(item)} style={styles.boxItem}>
              <View style={styles.item}>
                <View style={styles.view} />
                <FastImage resizeMode={FastImage.resizeMode.stretch} style={styles.imageThumb} source={item.resource} />
                <View style={styles.detail}>
                  <View style={styles.boxInfo}>
                    <BaseText style={styles.textItro}>{Lang.learn.text_course}</BaseText>
                    <BaseText style={styles.textItro}>{item.name}</BaseText>
                  </View>
                  <View style={styles.detailCourse}>
                    <View style={styles.boxInfo}>
                      <BaseText style={styles.textExpiredItem}>{Lang.saleLesson.text_number_video}</BaseText>
                      <BaseText style={styles.textValueItem}>{statusData.video}</BaseText>
                    </View>
                    <View style={{ ...styles.boxInfo, marginLeft: 15 }}>
                      <BaseText style={styles.textExpiredItem}>{Lang.learn.text_lesson}</BaseText>
                      <BaseText style={styles.textValueItem}>{statusData.lesson}</BaseText>
                    </View>
                  </View>
                </View>
                <AntDesign style={styles.iconRight} name="right" size={18} color={Resource.colors.black1} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  render() {
    const { data } = this.props.navigation.state.params;

    const heardBorderColor = this.getHeaderBorderColor();
    const { combo } = this.state;
    let course = '';
    if (this.typeNotify && this.notifyData.dataNoti.commentId) {
      course = data.combo_name ? data.combo_name : data.dataNoti.courseName;
    } else {
      course = data.name;
    }
    if (this.state.loading) return null;
    return (
      <KeyboardHandle>
        <Container>
          <View style={styles.container}>
            <Animated.View style={{ borderBottomColor: heardBorderColor, borderBottomWidth: 1 }}>
              <TouchableOpacity onPress={this.onPressBack} style={styles.buttonback}>
                <Ionicons name="ios-arrow-back" size={23 * Dimension.scale} color={Resource.colors.black1} />
                <View style={styles.boxtitle}>
                  <BaseText style={styles.title}>
                    {Lang.saleLesson.text_course_combo} {course}
                  </BaseText>
                </View>
              </TouchableOpacity>
            </Animated.View>

            <ScrollView
              style={styles.containerScrollview}
              ref={(refs) => (this.ScrollView = refs)}
              scrollEventThrottle={16}
              onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.scrollY } } }])}>
              <View style={styles.containerCombo} onLayout={this.onGetHeightContentHeader}>
                <View style={styles.boxIntro}>
                  <BaseText style={styles.textItros}>{Lang.saleLesson.text_intro_general}:</BaseText>
                  <View style={styles.intro}>
                    <BaseText style={styles.textTuition}>{Lang.saleLesson.text_tuition}</BaseText>
                    <View>
                      <BaseText style={styles.textPrices}>{Funcs.convertPrice(`${this.state.combo.price}`)}</BaseText>
                      <BaseText style={styles.textPrices}>{`${Funcs.formatNumber(`${combo.jpy_price}`)}¥`}</BaseText>
                    </View>
                  </View>
                  <View style={styles.intro}>
                    <BaseText style={styles.textTuition}>{Lang.learn.text_duration}</BaseText>
                    <View style={styles.intro}>
                      <BaseText style={styles.textValueExpired}>
                        {this.state.combo.services && this.state.combo.services.course_watch_expired_value}{' '}
                        <BaseText style={styles.textMonth}>{Lang.saleLesson.text_day}</BaseText>
                      </BaseText>
                      <BaseText style={styles.textTuition}>{Lang.saleLesson.text_active_day} </BaseText>
                    </View>
                  </View>
                </View>
                {this.renderItem()}
                <View style={styles.viewButtonBy}>
                  <TouchableOpacity onPress={this.onPressDetailBuyCourse} style={styles.buttonByCourse}>
                    <BaseText style={styles.titlebutton}>{Lang.saleLesson.button_buy_course}</BaseText>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.viewComent}>
                <ListComment
                  objectId={id}
                  type={'combo'}
                  dataReply={this.notifyData.dataNoti}
                  data={this.notifyData.data}
                  onScrollToComment={this.onScrollToComment}
                />
              </View>
            </ScrollView>
          </View>
          {this.props.showInput && (
            <InputComment
              ref={'InputComment'}
              objectId={id}
              type={'combo'}
              onFocusInputComment={this.onFocusInputComment}
              onBlurInputComment={this.onBlurInputComment}
            />
          )}
        </Container>
      </KeyboardHandle>
    );
  }
}

const mapStateToProps = (state) => ({
  showInput: state.inputCommentReducer.showInput,
  listCourse: state.courseReducer.listCourse
});

export default connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(DetailComboScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonback: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Resource.colors.white100
  },
  boxtitle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    width: width - 50 * Dimension.scale,
    fontStyle: 'italic',
    fontSize: 20 * Dimension.scale,
    fontWeight: '600',
    color: Resource.colors.black1,
    marginLeft: 7
  },
  containerCombo: {
    flex: 1,
    backgroundColor: Resource.colors.white100,
    padding: 20
  },
  containerScrollview: {
    flex: 1,
    backgroundColor: Resource.colors.grey100
  },
  containerItem: {
    flex: 1,
    marginTop: 20
  },
  intro: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  textItros: {
    fontSize: 13 * Dimension.scale,
    fontWeight: '600',
    marginRight: 5,
    marginBottom: 10,
    color: Resource.colors.black1
  },
  textItro: {
    fontSize: 14 * Dimension.scale,
    fontWeight: '500',
    marginRight: 5,
    marginBottom: 10,
    color: Resource.colors.black1
  },
  textTuition: {
    fontSize: 12 * Dimension.scale,
    lineHeight: 30,
    color: Resource.colors.black1
  },
  textPrices: {
    fontSize: 12 * Dimension.scale,
    lineHeight: 30,
    fontWeight: '600',
    color: Resource.colors.black1
  },
  textMonth: {
    fontSize: 12 * Dimension.scale,
    color: Resource.colors.black1,
    fontWeight: '500'
  },
  textValueExpired: {
    fontSize: 12 * Dimension.scale,
    fontWeight: '500',
    marginRight: 5,
    color: Resource.colors.black1
  },
  boxItem: {
    marginTop: 15 * Dimension.scale,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  item: {
    width: '95%',
    height: heightViewInfor,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20 * Dimension.scale,
    borderWidth: 1,
    borderColor: Resource.colors.borderWidth,
    backgroundColor: Resource.colors.white100,
    shadowColor: Resource.colors.grey600,
    shadowOffset: { width: 0, height: 2 },
    paddingHorizontal: 10,
    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 5,
    shadowRadius: Platform.OS === 'ios' ? 10 : 4,
    elevation: Platform.OS === 'ios' ? 0.3 : 5
  },
  imageThumb: {
    width: heightImage,
    aspectRatio: 1 / 1,
    borderRadius: 10 * Dimension.scale,
    position: 'absolute',
    top: -17 * Dimension.scale,
    left: -17 * Dimension.scale,
    borderWidth: 0.5,
    borderColor: Resource.colors.border,
    backgroundColor: Resource.colors.white100
  },
  view: {
    width: 50 * Dimension.scale
  },
  boxInfo: {
    flexDirection: 'row'
  },
  detail: {
    flex: 1,
    justifyContent: 'space-between'
  },
  detailCourse: {
    flexDirection: 'row'
  },
  textExpiredItem: {
    fontSize: 12 * Dimension.scale,
    color: Resource.colors.black1
  },
  textValueItem: {
    fontSize: 12 * Dimension.scale,
    marginLeft: 5,
    color: Resource.colors.greenColorApp,
    fontWeight: '600'
  },
  iconRight: {
    marginLeft: 20,
    textAlign: 'center'
  },
  viewButtonBy: {
    paddingVertical: 25,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonByCourse: {
    paddingHorizontal: 17 * Dimension.scale,
    paddingVertical: 8 * Dimension.scale,
    backgroundColor: Resource.colors.greenColorApp,
    borderRadius: 20 * Dimension.scale
  },
  titlebutton: {
    fontSize: 14 * Dimension.scale,
    fontWeight: '600',
    textAlign: 'center',
    color: Resource.colors.white100
  },
  viewComent: {
    marginTop: 10,
    paddingVertical: 15,
    backgroundColor: Resource.colors.white100
  },
  viewtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  }
});
