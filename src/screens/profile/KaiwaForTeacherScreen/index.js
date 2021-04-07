import BaseButton from 'common/components/base/BaseButton';
import BaseText from 'common/components/base/BaseText';
import CheckBox from 'common/components/base/CheckBox';
import Container from 'common/components/base/Container';
import Header from 'common/components/base/Header';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import Time from 'common/helpers/Time';
import Const from 'consts/Const';
import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import ListComment from 'screens/components/comment/ListComment';
import AppAction from 'states/context/actions/AppAction';
import AppContextView from 'states/context/views/AppContextView';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BaseDatePicker from '../../../common/components/base/BaseDatePicker';

export default class KaiwaForTeacherScreen extends AppContextView {
  constructor(props) {
    super(props);
    this.data = [];
    this.state = { refreshing: false, timeFrom: null, timeTo: null };
    this.sortReaded = false;
  }

  async componentDidMount() {}

  getData = async (page = 1) => {
    const params = { page, sortReaded: this.sortReaded };
    if (this.state.timeFrom && this.state.timeTo) {
      params.timeFrom = Time.format(this.state.timeFrom);
      params.timeTo = Time.format(this.state.timeTo);
    }
    const res = await Fetch.get(Const.API.COMMENT.GET_ALL_COMMMENT_KAIWA, params, true);
    if (res.status === 200) {
      let { comment, itemsPerPage, unread } = res.data;
      let { data } = this;
      if (page === 1) data = [];
      data = [...data, ...comment];
      this.refs.ListComment.getListRef().setState({
        data,
        hasMoreComment: comment.length > 0 && comment.length >= itemsPerPage
      });
      this.data = data;
      AppAction.onUpdateTotalKaiwaUnread(unread);
    }
    this.refs.ListComment.getListRef().setState({
      loading: false
    });
  };

  onRefresh = async () => {
    this.setState({ refreshing: true });
    this.refs.ListComment.getListRef().setState({
      data: []
    });
    await Funcs.delay(500);
    this.setState({ refreshing: false, timeFrom: null, timeTo: null }, () => {
      this.getData(1);
    });
  };

  onChangeCheckbox = (value) => {
    this.sortReaded = value;
    this.getData();
  };

  onTimePicked = (date) => {
    if (this.isChoiceDateFrom) {
      this.setState({
        timeFrom: date,
        timeTo: !this.state.timeTo || this.state.timeTo < date ? date : this.state.timeTo
      });
    } else {
      this.setState({
        timeFrom: !this.state.timeFrom || this.state.timeFrom > date ? date : this.state.timeFrom,
        timeTo: date
      });
    }
  };

  onPressDateFrom = () => {
    this.isChoiceDateFrom = true;
    this.dateTimePicker.showDateTimePicker('Chọn ngày bắt đầu', this.state.timeFrom && Time.format(this.state.timeFrom, 'YYYY-MM-DD'));
  };

  onPressDateTo = () => {
    this.isChoiceDateFrom = false;
    this.dateTimePicker.showDateTimePicker('Chọn ngày kết thúc', this.state.timeTo && Time.format(this.state.timeTo, 'YYYY-MM-DD'));
  };

  onPressSearch = async () => {
    this.refs.ListComment.getListRef().setState({
      data: []
    });
    this.getData();
  };

  renderHeaderFilter = () => {
    const { timeFrom, timeTo } = this.state;
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons style={{ marginLeft: 5 }} name={'clock-outline'} size={14} color={'gray'} />
          <BaseButton style={styles.buttonTime} onPress={this.onPressDateFrom}>
            <BaseText style={styles.buttonTimeText}>{timeFrom ? Time.format(timeFrom, 'DD/MM/YYYY') : '__ /__ /__ '}</BaseText>
          </BaseButton>
          <BaseText>{' -'}</BaseText>
          <BaseButton style={styles.buttonTime} onPress={this.onPressDateTo}>
            <BaseText style={styles.buttonTimeText}>{timeTo ? Time.format(timeTo, 'DD/MM/YYYY') : '__ /__ /__ '}</BaseText>
          </BaseButton>
          <BaseButton style={[styles.buttonTime, { padding: 3, marginLeft: 5, width: undefined, paddingHorizontal: 10 }]} onPress={this.onPressSearch}>
            <MaterialIcons name={'search'} size={18} color={'gray'} />
          </BaseButton>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <CheckBox color={'red'} onChange={this.onChangeCheckbox} />
          <BaseText style={{ fontSize: 11, marginLeft: 3, color: 'red', marginRight: 5, width: 60 }}>{'Ưu tiên chưa xem'}</BaseText>
        </View>
      </View>
    );
  };

  render() {
    const { refreshing } = this.state;
    const { totalKaiwaUnread = 0 } = this.context || {};
    return (
      <Container style={{ flex: 1 }}>
        <Header text={'Kaiwa (' + totalKaiwaUnread + ' mới)'} left />
        {this.renderHeaderFilter()}
        <View style={{ flex: 1 }}>
          <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />}>
            <ListComment ref={'ListComment'} getData={this.getData} type={Const.COURSE_TYPE.KAIWA} isTeacherMode />
          </ScrollView>
        </View>
        <BaseDatePicker ref={(ref) => (this.dateTimePicker = ref)} dateStyle={styles.dateStyle} onPicked={this.onTimePicked} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  buttonTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderWidth: 0.7,
    borderColor: 'gray',
    borderRadius: 6,
    marginLeft: 2,
    width: 80
  },
  buttonTimeText: {
    fontSize: 11
  }
});
