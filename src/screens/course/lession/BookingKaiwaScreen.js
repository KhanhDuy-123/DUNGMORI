import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseButtonOpacity from 'common/components/base/BaseButtonOpacity';
import BaseEmpty from 'common/components/base/BaseEmpty';
import BaseText from 'common/components/base/BaseText';
import Header from 'common/components/base/Header';
import Dimension from 'common/helpers/Dimension';
import Time from 'common/helpers/Time';
import NavigationService from 'common/services/NavigationService';
import React, { Component } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, View, StatusBar } from 'react-native';
import { CalendarProvider, ExpandableCalendar } from 'react-native-calendars';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import ModalViewResult from 'screens/course/lession/containers/ModalViewResult';
import ModalChooseInfo from 'screens/profile/myProfile/containers/ModalChooseInfo';
import BookingKaiwaActionCreator from 'states/redux/actionCreators/BookingKaiwaActionCreator';
import { onUpdateUser } from 'states/redux/actions';
import Utils from 'utils/Utils';
import CountDownBookingKaiwa from './containers/CountdownBookingKaiwa';
import ItemBookingKaiwa from './containers/ItemBookingKaiwa';
import AppConst from 'consts/AppConst';

class BookingKaiwaScreen extends Component {
  constructor(props) {
    super(props);
    this.itemBooking = {};
  }
  state = {
    optionId: null,
    today: Time.format(),
    listBooking: [],
    date: '',
    loading: true,
    canBooking: null,
    showModalBooking: false,
    showModalCancel: false,
    options: [
      { id: 0, name: Lang.learn.text_all_calendar, choose: true },
      { id: 1, name: Lang.learn.text_empty_calendar },
      { id: 2, name: Lang.learn.text_my_calendar }
    ]
  };

  async componentDidMount() {
    BookingKaiwaActionCreator.getBookingKaiwa(Time.format());
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps?.dataListBooking !== this.props?.dataListBooking) {
      const { listBooking, date, canBooking } = nextProps.dataListBooking;
      this.setState({
        listBooking,
        canBooking,
        date,
        loading: false
      });
    }
    if (nextProps?.showModalBooking !== this.props?.showModalBooking) {
      this.setState({ showModalBooking: nextProps?.showModalBooking?.showModalBookingKaiwa, showModalCancel: false }, () => {
        if (this.state.showModalBooking) {
          this.resultRef.showModal();
        }
      });
    }
    if (nextProps?.showModalCancel !== this.props?.showModalCancel) {
      this.setState({ showModalCancel: nextProps?.showModalCancel?.showModalCancelKaiwa, showModalBooking: false }, () => {
        if (this.state.showModalCancel) {
          this.resultRef.showModal();
        }
      });
    }
    if (nextProps?.language !== this.props.language) {
      this.setState({
        options: [
          { id: 0, name: Lang.learn.text_all_calendar, choose: true },
          { id: 1, name: Lang.learn.text_empty_calendar },
          { id: 2, name: Lang.learn.text_my_calendar }
        ]
      });
    }
    return nextState != this.state;
  }

  onDateChanged = async (date) => {
    BookingKaiwaActionCreator.getBookingKaiwa(date);
  };

  onBackPress = () => {
    NavigationService.pop();
  };

  onPressFilter = () => {
    this.optionRef.showModal();
  };

  getMarkedDates = () => {
    const { dataBookingRemain } = this.props;
    let array = dataBookingRemain?.registedList.map((item) => item.date);
    let marked = {};
    for (let i = 0; i < array?.length; i += 1) marked[array[i]] = { marked: true };
    return marked;
  };

  onChangeOption = (value) => {
    const { allData } = this.props?.dataListBooking;
    this.setState({ optionId: value.id }, () => {
      if (value.id === 0) {
        this.setState({ listBooking: allData });
      } else if (value.id === 1) {
        let bookingEmpty = allData.filter((item) => (item.user_1 === '' || item.user_2 === '') && item.user_1.id !== Utils.user.id);
        if (bookingEmpty?.length > 0) {
          this.setState({ listBooking: bookingEmpty });
        } else {
          this.setState({
            listBooking: [{ id: 0, isBookingEmpty: true, status: 1, time: '', is_full: 0, name: '', user_1: '', user_2: '' }]
          });
        }
      } else if (value.id === 2) {
        let myBooking = allData.filter((item) => item.user_1.id === Utils.user.id || item.user_2 === Utils.user.id);
        if (myBooking?.length > 0) {
          this.setState({ listBooking: myBooking });
        } else {
          this.setState({
            listBooking: [{ id: 0, isMyBooking: true, status: 1, time: '', is_full: 0, name: '', user_1: '', user_2: '' }]
          });
        }
      }
    });
  };

  onPressRegisterKaiwa = (item) => {
    this.itemBooking = item;
    if (item.user_1.id === Utils.user.id || item.user_2.id === Utils.user.id) {
      this.cancelRef.showModal();
    } else {
      this.regisRef.showModal();
    }
  };

  onPressRegisterBooking = async () => {
    this.attentionRef.showModal();
  };

  onPressAttentionBooking = async () => {
    const { date } = this.state;
    // Register bokking kaiwa
    let data = {
      id: this.itemBooking.id,
      skype: this.regisRef.state.IDSkype
    };
    let dateRegister = {
      date,
      time: this.itemBooking.time
    };
    BookingKaiwaActionCreator.bookingKaiwa(data, dateRegister);
    this.props.onUpdateUser({ ...this.props.user, skype: this.regisRef.state.IDSkype });
  };

  onPressCancelBooking = async () => {
    const { date } = this.state;
    // Cancel bokking kaiwa
    BookingKaiwaActionCreator.cancelBookingKaiwa(this.itemBooking.id, date);
  };

  onPressHideModal = () => {
    this.setState({ showModalBooking: false, showModalCancel: false });
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => {
    const { registed } = this.props?.dataListBooking;
    return <ItemBookingKaiwa item={item} onPressRegisterKaiwa={this.onPressRegisterKaiwa} registed={registed} date={this.state.date} />;
  };

  listHeaderComponent = () => {
    return (
      <View style={styles.viewHeader}>
        <BaseButtonOpacity
          icon={Resource.images.IcCalendar}
          socialButtonStyle={styles.socialButtonStyle}
          textStyle={styles.textButtonStyle}
          text={Lang.calendarKaiwa.text_button_all_calendar}
          onPress={this.onPressFilter}
        />
        <CountDownBookingKaiwa dataBookingRemain={this.props.dataBookingRemain} />
      </View>
    );
  };

  renderModalOption() {
    return (
      <ModalChooseInfo
        ref={(ref) => (this.optionRef = ref)}
        value={this.state.optionId}
        data={this.state.options}
        onChangeOption={this.onChangeOption}
        scheduleKaiwa={'ScheduleKaiwa'}
      />
    );
  }

  renderModalButtonRegister() {
    const { user } = this.props;
    return (
      <ModalViewResult
        ref={(ref) => (this.regisRef = ref)}
        showSkype
        user={user.skype}
        navigation={this.props.navigation}
        buttonLeft={Lang.calendarKaiwa.text_button_back}
        buttonRight={Lang.calendarKaiwa.text_button_confirm}
        textTitle={styles.textTitle}
        textContent={styles.textContent}
        onShowResult={this.onPressRegisterBooking}
      />
    );
  }
  renderModalAttention() {
    return (
      <ModalViewResult
        ref={(ref) => (this.attentionRef = ref)}
        showAttention
        source={Resource.images.imCalendar}
        title1={Lang.chooseLession.hint_text_attention}
        content1={Lang.chooseLession.hint_text_attention_content}
        buttonLeft={Lang.calendarKaiwa.text_button_back}
        buttonRight={Lang.calendarKaiwa.text_button_confirm}
        title1Style={styles.title1Style}
        navigation={this.props.navigation}
        textContent={styles.textContent1}
        onShowResult={this.onPressAttentionBooking}
      />
    );
  }
  renderModalButtonCancel() {
    return (
      <ModalViewResult
        ref={(ref) => (this.cancelRef = ref)}
        showAttention
        source={Resource.images.imCalendar}
        title1={Lang.chooseLession.hint_text_cancel_lesson}
        content1={Lang.chooseLession.hint_text_cancel_lesson_content}
        buttonLeft={Lang.calendarKaiwa.text_button_back}
        buttonRight={Lang.calendarKaiwa.text_button_confirm}
        title1Style={styles.title1Style}
        navigation={this.props.navigation}
        textContent={styles.textContent1}
        onShowResult={this.onPressCancelBooking}
      />
    );
  }
  renderModalResult() {
    return (
      <ModalViewResult
        ref={(ref) => (this.resultRef = ref)}
        showAttention
        showResult
        source={Resource.images.imCheckCircle}
        buttonLeft={Lang.calendarKaiwa.text_button_back}
        buttonRight={Lang.calendarKaiwa.text_button_confirm}
        title1={this.state.showModalBooking ? Lang.calendarKaiwa.text_booking_kaiwa_success : Lang.calendarKaiwa.text_cancel_kaiwa_success}
        content1={this.state.showModalBooking ? Lang.calendarKaiwa.text_content_booking_kaiwa_success : Lang.calendarKaiwa.text_content_cancel_kaiwa_success}
        title1Style={styles.titleResultStyle}
        navigation={this.props.navigation}
        textContent={{ ...styles.textContent1, color: Resource.colors.greenColorApp, fontWeight: '500' }}
        onShowResult={this.onPressHideModal}
      />
    );
  }

  renderEmpty() {
    return <BaseEmpty text={Lang.chooseLession.text_empty_booking_kaiwa} />;
  }
  renderEmptyBooking() {
    const { listBooking } = this.state;
    if (listBooking[0].isBookingEmpty) {
      return <BaseEmpty text={Lang.chooseLession.text_empty_booking_kaiwa1} />;
    } else {
      return <BaseEmpty text={Lang.chooseLession.text_empty_booking_kaiwa2} />;
    }
  }

  renderCalendar() {
    const { listBooking } = this.state;
    return (
      <CalendarProvider
        ref={(ref) => (this.calendarRef = ref)}
        date={this.state.today}
        onDateChanged={this.onDateChanged}
        onMonthChange={this.onMonthChange}
        disabledOpacity={0.6}>
        <ExpandableCalendar firstDay={1} minDate={this.state.today} markedDates={this.getMarkedDates()} />
        {listBooking?.length > 0 ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1, marginTop: 110 * Dimension.scale }}>
              {this.listHeaderComponent()}
              {listBooking[0]?.isBookingEmpty || listBooking[0]?.isMyBooking ? (
                this.renderEmptyBooking()
              ) : (
                <FlatList
                  data={this.state.listBooking}
                  showsVerticalScrollIndicator={false}
                  style={styles.flatlist}
                  scrollEnabled={false}
                  keyExtractor={this.keyExtractor}
                  extraData={this.state}
                  renderItem={this.renderItem}
                />
              )}
            </View>
          </ScrollView>
        ) : !this.state.loading ? (
          this.renderEmpty()
        ) : null}
      </CalendarProvider>
    );
  }

  render() {
    const { dataBookingRemain } = this.props;
    if (this.state.loading) {
      return (
        <View style={styles.viewLoading}>
          <ActivityIndicator size="small" color={'gray'} />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Header
          left={true}
          onBackPress={this.onBackPress}
          text={Lang.calendarKaiwa.text_header}
          titleStyle={styles.titleStyle}
          colorBackButton={Resource.colors.white100}
          titleArea={styles.areaHeaderText}
          headerStyle={styles.headerStyle}
        />
        <View style={{ alignItems: 'center' }}>
          <View style={styles.viewNumber}>
            <FastImage source={Resource.images.icTreeLeft} style={{ ...styles.iconTree, marginTop: 15 }} />
            <View style={{ alignItems: 'center' }}>
              <BaseText style={styles.numberStyle}>{dataBookingRemain?.remain || 0}</BaseText>
              <BaseText style={styles.textStyle}>{Lang.chooseLession.hint_text_number_turn_left}</BaseText>
            </View>
            <FastImage source={Resource.images.icTreeRight} style={styles.iconTree} />
          </View>
          <View style={styles.borderStyle} />
        </View>
        {this.renderCalendar()}
        {this.renderModalOption()}
        {this.renderModalButtonCancel()}
        {this.renderModalButtonRegister()}
        {this.renderModalAttention()}
        {this.renderModalResult()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Resource.colors.white100
  },
  headerStyle: {
    backgroundColor: '#41A335',
    height: AppConst.IS_IPHONEX ? 80 * Dimension.scale : 50 * Dimension.scale,
    paddingTop: AppConst.IS_IPHONEX ? 30 : 10
  },
  titleStyle: {
    color: Resource.colors.white100,
    fontSize: 14 * Dimension.scale
  },
  areaHeaderText: {
    alignItems: 'center'
  },
  viewHeader: {
    alignItems: 'center',
    paddingVertical: 25
  },
  viewLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  flatlist: {
    flex: 1,
    backgroundColor: Resource.colors.white100
  },
  textTitle: {
    fontWeight: 'bold'
  },
  textContent: {
    fontWeight: 'normal'
  },
  areaText: {
    height: 100,
    alignItems: 'center',
    marginTop: 20
  },
  viewRemain: {
    backgroundColor: Resource.colors.white100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  numberStyle: {
    height: 85 * Dimension.scale,
    fontSize: 80 * Dimension.scale,
    fontWeight: 'bold',
    color: Resource.colors.white100
  },
  textStyle: {
    fontSize: 13 * Dimension.scale,
    paddingBottom: 15,
    fontWeight: '700',
    color: Resource.colors.white100
  },
  title1Style: {
    color: Resource.colors.red
  },
  titleResultStyle: {
    color: Resource.colors.greenColorApp
  },
  textContent1: {
    color: Resource.colors.red,
    fontSize: 12 * Dimension.scale,
    fontWeight: 'normal',
    textAlign: 'center'
  },
  viewNumber: {
    width: '100%',
    height: 100 * Dimension.scale,
    backgroundColor: '#41A335',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  iconTree: {
    width: 60 * Dimension.scale,
    height: 120 * Dimension.scale
  },
  borderStyle: {
    width: Dimension.widthParent / 2,
    height: 0.5,
    backgroundColor: '#B3DAAF',
    position: 'absolute',
    bottom: 0
  },
  socialButtonStyle: {
    width: Dimension.widthParent - 40,
    height: 35 * Dimension.scale,
    justifyContent: 'space-between',
    borderRadius: 10,
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    elevation: 1
  },
  textButtonStyle: {
    flex: 1,
    textAlign: 'center',
    marginRight: 50 * Dimension.scale
  }
});

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
  dataListBooking: state.bookingKaiwaReducer.dataListBooking,
  dataBookingRemain: state.bookingKaiwaReducer.dataBookingRemain,
  showModalBooking: state.bookingKaiwaReducer.showModalBookingKaiwa,
  showModalCancel: state.bookingKaiwaReducer.showModalCancelKaiwa,
  language: state.languageReducer.language
});
const mapDispatchToProps = { onUpdateUser };
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookingKaiwaScreen);
