import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseButtonOpacity from 'common/components/base/BaseButtonOpacity';
import BaseText from 'common/components/base/BaseText';
import Header from 'common/components/base/Header';
import ModalLoginRequiment from 'common/components/base/ModalLoginRequiment';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import NavigationService from 'common/services/NavigationService';
import StorageService from 'common/services/StorageService';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React from 'react';
import { Animated, Dimensions, RefreshControl, StatusBar, StyleSheet, BackHandler, View, Alert } from 'react-native';
import FastImage from 'react-native-fast-image';
import { getStatusBarHeight } from 'common/helpers/IPhoneXHelper';
import { connect } from 'react-redux';
import ChooseLesson from 'screens/components/lession/ChooseLesson';
import ModalChooseSpec from 'screens/components/lession/ModalChooseSpec';
import ModalShowOldLesson from 'screens/components/lession/ModalShowOldLesson';
import BookingKaiwaActionCreator from 'states/redux/actionCreators/BookingKaiwaActionCreator';
import LessonActionCreator from 'states/redux/actionCreators/LessonActionCreator';
import Configs from 'utils/Configs';
import Utils from 'utils/Utils';
import HeaderProgressChooseLesson from './containers/HeaderProgressChooseLesson';
import ModalCongratulation from './containers/ModalCongratulation';
import ModalViewResult from './containers/ModalViewResult';
import SearchLesson from './containers/SearchLesson';
import AnimatedFloatButton from '../containers/AnimatedFloatButton';
import { onChangeSpeedPlayVideo } from 'states/redux/actions/SpeedVideoAction';

const { width } = Dimensions.get('window');
const statusBarHeight = getStatusBarHeight();
let HEIGHT_DIMESON = (Dimension.widthParent / Const.VIDEO_CONFIG.SIZE.WIDTH) * Const.VIDEO_CONFIG.SIZE.HEIGHT;
let HEADER_HEIGHT = 45 + 50 * Dimension.scale;
class ChooseLessionScreen extends React.Component {
  constructor(props) {
    super(props);
    const scrollAnim = new Animated.Value(0);
    const offsetAnim = new Animated.Value(0);
    this.state = {
      loading: true,
      oldPracties: {},
      totalProgress: 0,
      oldProgressLesson: [],
      listLesson: [],
      listSpecLesson: [],
      scrollAnim,
      offsetAnim,
      clampedScroll: Animated.diffClamp(
        Animated.add(
          scrollAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateLeft: 'clamp'
          }),
          offsetAnim
        ),
        0,
        15
      )
    };
    this.oldLesson = [];
    this.isStillExpired = true;
    this.keepLearning = false;
    this.indexSectionChild = 0;
    this.activeSections = 0;
    this.heightLesson = 0;
    this.heightHeader = 0;
    this.listLesson = [];
    BackHandler.addEventListener('hardwareBackPress', this.pressHardBack);
  }

  async componentDidMount() {
    const { params, isStillExpired } = this.props.navigation.state.params;
    const courseId = params?.course_id;
    this.isStillExpired = !isStillExpired ? true : isStillExpired;
    let oldPracties = {};
    if (this.checkBookingKaiwa()) {
      BookingKaiwaActionCreator.getBookingRemain();
    }
    //get data
    this.setState({ loading: true }, () => {
      LessonActionCreator.getListLesson(courseId, (data, specData) => {
        this.setState({ loading: false, listLesson: data, listSpecLesson: specData });
      });
    });

    // Current lesson
    try {
      this.oldLesson = await StorageService.get(Const.DATA.OLD_LESSON);
      let oldProgress = await StorageService.get(Const.DATA.LESSON_PROGRESS);
      if (this.oldLesson) {
        this.oldLesson.find((e) => {
          if (e.courseId == courseId) {
            oldPracties = e;
            this.timeShowKeespLearn = setTimeout(() => {
              this.ModalKeepLearn.showModal(oldPracties.lessonName);
            }, 300);
          }
        });
        this.setState({ oldPracties, oldProgressLesson: oldProgress ? oldProgress : [] });
      }
    } catch (error) {
      Funcs.log(`ERROR GET CURRENT LESSON`, error);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeHideModal);
    clearTimeout(this.timeNavi);
    clearTimeout(this.timeScrollSpecSection);
    clearTimeout(this.timeShowKeespLearn);
    clearTimeout(this.timeScrollToSec);
    clearTimeout(this.timerScrollLesson);
    clearTimeout(this.timerScrollSpecLesson);
    BackHandler.removeEventListener('hardwareBackPress', this.pressHardBack);
  }

  pressHardBack = () => {
    this.onBackPress();
    return true;
  };

  onPressKeepLearning = () => {
    //tiep tuc hoc bai cu
    const { oldPracties } = this.state;
    const { listLesson, courseOwner } = this.props;
    const { params } = this.props.navigation.state.params;
    const courseId = params?.course_id;
    let typeLesson = '';
    var itemLesson = {};
    for (let i = 0; i < listLesson.length; i++) {
      if (listLesson[i].id === oldPracties.sectionId) {
        itemLesson = listLesson[i];
      }
      typeLesson = listLesson[i].type;
    }
    this.indexSectionChild = oldPracties.index;
    const item = {
      id: oldPracties.idContent,
      group_id: oldPracties.sectionId,
      selected: oldPracties.selected,
      sort_order: oldPracties.sort_order,
      videoProgress: oldPracties.videoProgress,
      name: oldPracties?.lessonName,
      keepLearning: true,
      courseId: courseId,
      courseName: params?.name,
      course_expired_day: courseOwner && courseOwner?.to ? courseOwner?.to : null
    };
    NavigationService.navigate(ScreenNames.DetailLessonScreen, {
      item: item,
      updateProgressLesson: this.onUpdateProgressLesson,
      typeLesson,
      itemLesson,
      owned: params?.owned
    });
    this.keepLearning = true;
  };

  onPressCancel = () => {
    //hoc bai hoc khac
    this.oldLesson.find((e, index) => {
      if (e.courseId == this.state.oldPracties.courseId) {
        this.oldLesson.splice(index, 1);
        return e;
      }
    });
    StorageService.save(Const.DATA.OLD_LESSON, this.oldLesson);
  };

  onScrollToHeader = (activeSections) => {
    this.activeSections = activeSections;
    var pos = activeSections > 0 && activeSections * 60;
    if (pos) this.ScrollView?.getNode()?.scrollTo(pos + 85 + this.heightHeader, 0, true);
  };

  naviToDetailLesson = (item, index) => {
    const { listLesson, courseOwner } = this.props;
    let typeLesson = '';
    var itemLesson = {};
    for (let i = 0; i < listLesson.length; i++) {
      if (listLesson[i].id === item.group_id) {
        itemLesson = listLesson[i];
      }
      typeLesson = listLesson[i].type;
    }
    this.indexSectionChild = index;
    const { params } = this.props.navigation.state.params;

    const courseId = params?.course_id;
    let passData = {
      ...item,
      courseName: params?.name,
      course_expired_day: courseOwner && courseOwner?.to ? courseOwner?.to : null
    };
    passData.courseId = courseId;
    if (!this.isStillExpired) {
      NavigationService.push(ScreenNames.DetailLessonScreen, {
        item: passData,
        typeLesson,
        itemLesson,
        owned: params.owned
      });
    } else {
      NavigationService.push(ScreenNames.DetailLessonScreen, {
        item: passData,
        updateProgressLesson: this.onUpdateProgressLesson,
        typeLesson,
        itemLesson,
        owned: params?.owned
      });
    }
  };

  onUpdateProgressLesson = async (videoProgress, examProgress, lessonId, lessonGroupId, selected, courseId) => {
    //update tien do bai hoc
    const data = {
      videoProgress: videoProgress,
      exampleProgress: examProgress,
      lessonId: lessonId,
      lessonGroupId,
      selected,
      courseId
    };

    LessonActionCreator.updateLesson(
      data,
      (listData) => {
        this.onUpdate(listData, data);
      },
      this.onScollToSection,
      this.onScrollToSpecSection
    );
    this.props.onChangeSpeedPlayVideo(Const.VIDEO_SPEED['1x']);
  };

  onUpdate = (listData, data) => {
    const { listLesson, listSpecLesson } = this.state;
    this.onShowPopup(data);
    let state = { listLesson: [...listData] };
    if (data.selected) state = { listSpecLesson: [...listData] };
    let dataList = data.selected ? listSpecLesson : listLesson;
    let index = null;
    //Lấy lesson hiện tại của mảng data
    let currentLesson = null;
    for (let i = 0; i < dataList.length; i++) {
      let item = { ...dataList[i] };
      item.update = item.id == data.lessonGroupId;
      if (item.id == data.lessonGroupId) {
        index = i;
        currentLesson = item;
      }
      dataList[i] = item;
    }
    //Lấy lesson đã update dữ liệu
    let lessonUpdated = listData.find((e) => e.id == data.lessonGroupId);
    let itemLessonUpdate = lessonUpdated.lessons.find((e) => e.id == data.lessonId);
    for (let i = 0; i < currentLesson.lessons.length; i++) {
      let item = { ...currentLesson.lessons[i] };
      if (item.id == itemLessonUpdate.id) {
        item = itemLessonUpdate;
      }
      currentLesson.progress = lessonUpdated.progress;
      currentLesson.lessons[i] = item;
    }
    //Chèn dữ lesson update lên lesson hiện tại
    dataList.fill(currentLesson, index, index + 1);
    state = { listLesson: [...dataList] };
    if (data.selected) state = { listSpecLesson: [...dataList] };
    this.setState({ ...state });
  };

  onShowPopup = async (data) => {
    //luu progress cua video khi nhan quay lai
    try {
      let prevLesson = await StorageService.get(Const.DATA.OLD_LESSON);
      if (prevLesson) {
        for (let i = 0; i <= prevLesson.length; i++) {
          if (!prevLesson[i]) continue;
          if (prevLesson[i].courseId == data.courseId) {
            if (prevLesson[i].sectionId == data.lessonGroupId && prevLesson[i].idContent == data.lessonId) {
              prevLesson[i].videoProgress = data.videoProgress;
              break;
            }
          }
        }
      }
      StorageService.save(Const.DATA.OLD_LESSON, prevLesson);
      this.onShowDialogPercentComplete(data.courseId);
    } catch (error) {
      Funcs.log(error);
    }
  };

  onShowDialogPercentComplete = async (courseId) => {
    const { totalProgress } = this.props;
    if (totalProgress >= 25) {
      const { oldProgressLesson } = this.state;
      let listData = [];
      let percent = 0;
      let data = {
        courseId: courseId,
        percent: 0
      };
      listData = oldProgressLesson;
      if (totalProgress >= 25 && totalProgress <= 49) {
        percent = 25;
      } else if (totalProgress >= 50 && totalProgress <= 74) {
        percent = 50;
      } else if (totalProgress >= 75 && totalProgress <= 99) {
        percent = 75;
      } else if (totalProgress == 100) {
        percent = 100;
      }
      if (listData.length == 0) {
        data.percent = percent;
        this.ModalCongratulation.showModal(totalProgress);
        listData.push(data);
      } else {
        listData.map((e) => {
          if (e.courseId == courseId) data.percent = e.percent;
        });
        if (data.percent < percent) {
          data.isShow = true;
          data.percent = percent;
          this.ModalCongratulation.showModal(totalProgress);
          listData.map((e) => {
            if (e.courseId == courseId) {
              e.percent = percent;
            }
            return e;
          });
          this.setState({ oldProgressLesson: listData });
        }
      }
      listData.map((e, index) => {
        if (e.courseId == courseId) {
          listData.splice(index, 1);
        }
        return e;
      });
      listData.push(data);
      StorageService.save(Const.DATA.LESSON_PROGRESS, listData);
    }
  };

  onScrollToSpecSection = () => {
    this.timerScrollSpecLesson = setTimeout(() => {
      const headerActive = 15;
      const indexSectionChild = this.indexSectionChild * 50;
      this.ScrollView?.getNode()?.scrollTo({
        y: this.heightLesson + 85 + headerActive + indexSectionChild + this.heightHeader,
        x: 0,
        animated: true
      });
    }, 300);
  };

  onScollToSection = (index) => {
    this.timerScrollLesson = setTimeout(() => {
      const posActiveSection = index > 0 && index * 60;
      const indexSectionChild = (this.indexSectionChild + 1) * 50;
      this.ScrollView?.getNode()?.scrollTo({
        y: posActiveSection + 85 + indexSectionChild + this.heightHeader,
        x: 0,
        animated: true
      });
    }, 200);
  };

  onShowSelecSpecLesson = (section) => {
    this.ModalChooseSpecLesson.showModal(section);
  };

  onPressSaveSpecLesson = async (section) => {
    const { params } = this.props.navigation.state.params;
    const courseId = params?.course_id;
    LessonActionCreator.chooseSpecialLesson(courseId, section.id, () => {
      this.timeHideModal = setTimeout(() => {
        this.ModalChooseSpecLesson.hideModal();
      }, 300);
    });
  };

  onBackPress = () => {
    //update progress cua ca khoa hoc o component khoa hoc cua toi
    if (this.props.navigation.state.params.updateData) {
      this.timeNavi = setTimeout(() => {
        this.props.navigation.state.params.updateData();
      }, 200);
    }
    NavigationService.pop();
  };

  getHeightLesson = (event) => {
    //lay chieu cao cua cac bai hoc trong khoa hoc
    this.heightLesson = event.nativeEvent.layout.height;
  };

  onPressSchedule = () => {
    if (!Utils.user || !Utils.user.id) ModalLoginRequiment.show();
    else NavigationService.navigate(ScreenNames.BookingKaiwaScreen);
  };

  onGetHeightHeader = (event) => {
    this.heightHeader = event.nativeEvent.layout.height;
  };

  onRefresh = () => {
    const { params } = this.props.navigation.state.params;
    if (this.checkBookingKaiwa()) {
      BookingKaiwaActionCreator.getBookingRemain();
    }
    const courseId = params?.course_id;
    this.setState({ loading: true }, () => LessonActionCreator.getListLesson(courseId, () => this.setState({ loading: false })));
  };

  checkBookingKaiwa = () => {
    const { params } = this.props.navigation.state.params;
    return params?.name?.toUpperCase() == 'KAIWA' || params?.title?.toUpperCase() == 'KAIWA';
  };

  onSearchComplete = (listData, listSpecData) => {
    if (listData[0] == 0) {
      this.setState({ listLesson: this.props.listLesson, listSpecLesson: this.props.listSpecLesson });
    } else this.setState({ listLesson: listData, listSpecLesson: listSpecData });
  };

  onPressReceivecertificate = () => {
    const { user, totalProgress } = this.props;
    if (user.certificate_receive_info) {
      NavigationService.navigate(ScreenNames.KaiwaCertidicateScreen);
    } else {
      if (totalProgress >= 90) {
        this.certificateRef.showModal();
      } else {
        this.showAlert();
      }
    }
  };

  showAlert = () => {
    Alert.alert(
      Lang.alert.text_title,
      Lang.alert.text_noti_certificate_kaiwa,
      [
        {
          text: Lang.learn.text_button_understand,
          style: 'cancel'
        }
      ],
      { cancelable: false }
    );
  };

  onPressCertificateConfirm = () => {
    NavigationService.navigate(ScreenNames.UpdateProfileCertificateScreen, { kaiwaCertificate: 'kaiwaCertificate' });
  };

  renderSpecialLesson = () => {
    const { params, typeView } = this.props.navigation.state.params;
    const { listSpecLesson } = this.state;
    if (listSpecLesson?.length == 0) return null;
    return (
      <View style={styles.specArea}>
        <View style={styles.header}>
          <BaseText style={styles.textSpec}>{Lang.chooseLession.text_spec.toUpperCase()}</BaseText>
        </View>
        <ChooseLesson
          data={listSpecLesson}
          courseId={params && params.course_id}
          onNavigateDetailLesson={this.naviToDetailLesson}
          onScrollToCotent={this.onScrollToHeader}
          typeRead={typeView}
          isStillExpired={this.isStillExpired}
          headerStyles={styles.headerStyles}
          parentHeaderStyle={styles.parentHeaderStyle}
          onShowSelecSpecLesson={this.onShowSelecSpecLesson}
        />
      </View>
    );
  };

  renderBookingKaiwa = () => {
    const { dataBookingRemain } = this.props;
    if (!this.checkBookingKaiwa()) return null;
    return (
      <View style={styles.wrapperKaiwa} onLayout={this.onGetHeightHeader}>
        <View style={styles.viewNumber}>
          <FastImage source={Resource.images.icTreeLeft} style={{ ...styles.iconTree, marginTop: 15 }} />
          <View style={{ alignItems: 'center' }}>
            <BaseText style={styles.numberStyle}>{dataBookingRemain?.remain || 0}</BaseText>
            <BaseText style={styles.textStyle}>{Lang.chooseLession.hint_text_number_turn_left}</BaseText>
          </View>
          <FastImage source={Resource.images.icTreeRight} style={styles.iconTree} />
        </View>
        <View style={styles.viewSchedule}>
          <View style={styles.viewTitle}>
            <BaseText style={styles.titleSchedule}>{Lang.chooseLession.text_title_booking_kaiwa1}</BaseText>
            <BaseText style={styles.content1}>{Lang.chooseLession.text_title_booking_kaiwa2}</BaseText>
            <BaseButtonOpacity
              text={Lang.calendarKaiwa.text_button_book_now}
              onPress={this.onPressSchedule}
              textStyle={{ color: Resource.colors.greenColorApp, fontSize: 12 * Dimension.scale, fontWeight: '500' }}
              socialButtonStyle={styles.buttonSchedule}
            />
          </View>
          <FastImage source={Resource.images.icShape} style={styles.shapeStyle} resizeMode={FastImage.resizeMode.contain} />
          <FastImage source={Resource.images.imTeacher} style={styles.imageStyle} />
        </View>
      </View>
    );
  };

  renderContent = () => {
    const { params, typeView } = this.props.navigation.state.params;
    const { loading, listLesson } = this.state;
    const { totalProgress } = this.props;
    if (loading) return null;
    return (
      <View style={{ flex: 1, marginBottom: 10 }}>
        {this.renderBookingKaiwa()}
        <View style={styles.viewContainer}>
          <View onLayout={this.getHeightLesson}>
            <HeaderProgressChooseLesson totalProgress={totalProgress} />
            <ChooseLesson
              courseName={params?.name}
              data={listLesson}
              courseId={params && params.course_id}
              onNavigateDetailLesson={this.naviToDetailLesson}
              onScrollToCotent={this.onScrollToHeader}
              typeRead={typeView}
              isStillExpired={this.isStillExpired}
            />
          </View>
          {this.renderSpecialLesson()}
        </View>
      </View>
    );
  };

  renderModalCertificate() {
    return (
      <ModalViewResult
        ref={(ref) => (this.certificateRef = ref)}
        showAttention
        source={Resource.images.icCertiGreen}
        title1={Lang.chooseLession.hint_text_almost_done_lesson}
        content1={Lang.chooseLession.hint_content_receive_now}
        buttonLeft={Lang.alert.text_button_no}
        buttonRight={Lang.alert.text_button_yes}
        title1Style={{ color: Resource.colors.greenColorApp }}
        navigation={this.props.navigation}
        textContent={{ ...styles.textContent1 }}
        onShowResult={this.onPressCertificateConfirm}
      />
    );
  }

  render() {
    const { listSpecLesson, listLesson } = this.props;
    const { totalProgress } = this.props;
    const { clampedScroll } = this.state;

    const buttonTranslate = clampedScroll.interpolate({
      inputRange: [0, 15],
      outputRange: [0, 80 * Dimension.scale],
      extrapolate: 'clamp'
    });
    const buttonOpacity = clampedScroll.interpolate({
      inputRange: [0, 15],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    });
    return (
      <View style={{ flex: 1, paddingTop: statusBarHeight }}>
        <StatusBar translucent={true} />
        <View style={{ width: Dimension.widthParent, height: HEADER_HEIGHT }}>
          <Animated.View style={[{ position: 'absolute', bottom: 0 }]}>
            <SearchLesson listLesson={listLesson} listSpecLesson={listSpecLesson} onSearchComplete={this.onSearchComplete} />
          </Animated.View>
          <Header
            left={true}
            onBackPress={this.onBackPress}
            text={Lang.chooseLession.text_header}
            style={{ paddingTop: 0 }}
            titleStyle={styles.titleStyle}
            titleArea={styles.areaHeaderText}
            headerStyle={styles.headerStyle}
            onScrollTopHeader={this.onBackPress}
            colorBackButton={Resource.colors.black1}
            statusBarColor={Resource.colors.greenColorApp}
          />
        </View>

        <Animated.ScrollView
          scrollEventThrottle={16}
          removeClippedSubviews={true}
          ref={(refs) => (this.ScrollView = refs)}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollAnim } } }], { useNativeDriver: true })}
          contentContainerStyle={styles.contentContainerStyle}
          refreshControl={<RefreshControl refreshing={this.state.loading} onRefresh={this.onRefresh} />}>
          {this.renderContent()}
        </Animated.ScrollView>

        <ModalShowOldLesson
          ref={(refs) => (this.ModalKeepLearn = refs)}
          lessonName={this.state.oldPracties.lessonName}
          onPressKeepLearning={this.onPressKeepLearning}
          onPressCacel={this.onPressCancel}
        />
        <ModalChooseSpec ref={(refs) => (this.ModalChooseSpecLesson = refs)} dataList={listSpecLesson} onPressSave={this.onPressSaveSpecLesson} />
        <ModalCongratulation ref={(refs) => (this.ModalCongratulation = refs)} />
        {Configs.enabledFeature.kaiwaCertificateReceive && this.checkBookingKaiwa() && (
          <Animated.View style={{ ...styles.wapperIcon, transform: [{ translateY: buttonTranslate }], opacity: buttonOpacity }}>
            <AnimatedFloatButton
              certificate
              totalProgress={totalProgress}
              buttonStyle={{ backgroundColor: totalProgress >= 90 ? '#FF9A00' : Resource.colors.greenColorApp, zIndex: 1 }}
              viewSping={{ borderColor: totalProgress >= 90 ? '#FF9A00' : Resource.colors.greenColorApp }}
              viewButton={{ bottom: 10, right: 10 }}
              onPress={this.onPressReceivecertificate}
            />
          </Animated.View>
        )}
        {this.renderModalCertificate()}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.userReducer.user,
    listLesson: state.lessonReducer.listLesson,
    listSpecLesson: state.lessonReducer.listSpecLesson,
    totalProgress: state.lessonReducer.totalProgress,
    courseOwner: state.lessonReducer.courseOwner,
    dataBookingRemain: state.bookingKaiwaReducer.dataBookingRemain
  };
};

const mapDispatchToProp = { onChangeSpeedPlayVideo };

export default connect(
  mapStateToProps,
  mapDispatchToProp,
  null,
  { forwardRef: true }
)(ChooseLessionScreen);

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: Resource.colors.white100
  },
  containerMinimize: {
    backgroundColor: Resource.colors.white100,
    paddingTop: 0,
    paddingBottom: HEIGHT_DIMESON / 2 + 10
  },
  titleStyle: {
    color: Resource.colors.black1,
    fontSize: 14 * Dimension.scale
  },
  areaHeaderText: {
    alignItems: 'center'
  },
  wrapperKaiwa: {
    marginTop: 10,
    borderRadius: 30,
    marginHorizontal: 10,
    backgroundColor: '#398E2F',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'grey',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1
  },
  viewNumber: {
    width: '100%',
    paddingVertical: 5,
    borderRadius: 30,
    backgroundColor: '#41A335',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  iconTree: {
    width: 50 * Dimension.scale,
    height: 110 * Dimension.scale
  },
  viewSchedule: {
    width: '100%',
    marginVertical: 10,
    alignItems: 'center',
    flexDirection: 'row'
  },
  titleShedule: {
    fontSize: 18,
    fontWeight: '500'
  },
  content: {
    width: width - 20,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Resource.colors.white100,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    borderRadius: 10
  },
  textArea: {
    width: '88%'
  },
  textTitleLession: {
    fontSize: 16,
    color: Resource.colors.black1,
    fontWeight: '500'
  },
  percentComplete: {
    width: width - 20,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Resource.colors.white100,
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 10
  },
  titleSchedule: {
    fontWeight: '700',
    fontSize: 15 * Dimension.scale,
    width: 150 * Dimension.scale,
    color: Resource.colors.white100
  },
  content1: {
    fontSize: 9 * Dimension.scale,
    paddingTop: 10,
    width: 170 * Dimension.scale,
    color: Resource.colors.white100
  },
  content2: {
    fontSize: 15,
    paddingTop: 10
  },
  shapeStyle: {
    width: 130 * Dimension.scale,
    height: 115 * Dimension.scale,
    position: 'absolute',
    right: 0,
    bottom: -11
  },
  imageStyle: {
    width: 130 * Dimension.scale,
    height: 140 * Dimension.scale,
    position: 'absolute',
    right: 7 * Dimension.scale,
    bottom: -11
  },
  areaTextPercent: {
    width: width - 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  textTitlePercent: {
    fontSize: 16,
    color: Resource.colors.black1
  },
  sectionContainerStyle: {
    backgroundColor: 'white',
    marginTop: 10,
    borderRadius: 10
  },
  textPercent: {
    fontSize: 8,
    fontWeight: '400',
    color: Resource.colors.black1
  },
  textSpec: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red'
  },
  header: {
    height: 50,
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center',
    paddingLeft: 20
  },
  specArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    flex: 1,
    marginVertical: 5,
    marginHorizontal: 10
  },
  headerStyles: {
    borderTopWidth: 0.3,
    borderTopColor: 'grey'
  },
  parentHeaderStyle: {
    marginVertical: 0
  },
  buttonSchedule: {
    width: 110 * Dimension.scale,
    height: 30 * Dimension.scale,
    backgroundColor: Resource.colors.white100,
    borderRadius: 20 * Dimension.scale,
    marginVertical: 20 * Dimension.scale,
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1
  },
  contentContainerStyle: {
    backgroundColor: Resource.colors.white100
  },
  viewTitle: {
    paddingLeft: 25,
    justifyContent: 'flex-end',
    zIndex: 2,
    paddingVertical: 15 * Dimension.scale
  },
  viewContainer: {
    flex: 1,
    paddingTop: 30
  },
  numberStyle: {
    fontSize: 70 * Dimension.scale,
    fontWeight: 'bold',
    color: Resource.colors.white100
  },
  textStyle: {
    fontSize: 13 * Dimension.scale,
    paddingBottom: 15,
    fontWeight: '700',
    color: Resource.colors.white100
  },
  wapperIcon: {
    width: 50 * Dimension.scale,
    height: 50 * Dimension.scale,
    borderRadius: 25 * Dimension.scale,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 15,
    right: 20
  },
  textContent1: {
    color: Resource.colors.greenColorApp,
    fontSize: 12 * Dimension.scale,
    fontWeight: '500',
    textAlign: 'center',
    paddingTop: 0,
    paddingLeft: 0
  }
});
