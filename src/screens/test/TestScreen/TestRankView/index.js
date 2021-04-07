import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseEmpty from 'common/components/base/BaseEmpty';
import BaseText from 'common/components/base/BaseText';
import LoadingModal from 'common/components/base/LoadingModal';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import Const from 'consts/Const';
import UrlConst from 'consts/UrlConst';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import ModalTestingResult from 'screens/test/components/ModalTestingResult';
import Utils from 'utils/Utils';
import ItemRank from './ItemRank';
import ModalContent from './ModalContent';

const LEVEL = ['N1', 'N2', 'N3', 'N4', 'N5'];
const MONTH = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const YEAR = [2018, 2019, 2020];

class TestRankView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listDataRank: [],
      examInMonth: [],
      myRank: null,
      lastItem: {}
    };
    this.lastItem = {};
    this.exam = {};
    this.params = {};
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    LoadingModal.show();
    const url = UrlConst.API_RANKING + `/${Const.API.TRY_DO_TEST.GET_RANK_TEST}`;
    let respone = await Fetch.get(url, null, null, null, true);
    if (respone.status == Fetch.Status.SUCCESS) {
      this.lastItem = respone.data.lastItem;
      this.exam = respone.data.examsInMonth;
      this.params = {
        year: moment(this.lastItem.created_at).format('YYYY'),
        month: moment(this.lastItem.created_at).format('MM'),
        level: this.lastItem.course,
        exam_id: null
      };
      this.onSearchResults(false, this.params);
    }
  };

  onSearchResults = async (searching, params) => {
    const url = UrlConst.API_RANKING + `/${Const.API.TRY_DO_TEST.SEARCH_RANK_TEST}`;
    let data = {
      year: params.year,
      month: params.month,
      level: params.level
    };
    if (searching) data.exam_id = params.exam_id;
    let listUsers = [];
    let listRank = [];
    let listData = [];
    let examInMonth = [];
    let myRank = null;
    let respone = await Fetch.get(url, data, null, null, true);
    LoadingModal.hide();
    if (respone.status == Fetch.Status.SUCCESS) {
      examInMonth = respone.data.examInMonth ? respone.data.examInMonth : [];
      listRank = respone.data.ranking;
      listUsers = respone.data.listUsers;
      if (!listRank && !listUsers && examInMonth.length == 0) {
        listData = [];
      } else {
        for (let i = 0; i < listRank.length; i++) {
          let rankItem = { ...listRank[i] };
          if (Utils.user.id == rankItem.user_id) myRank = i + 1;
          for (let j = 0; j < listUsers.length; j++) {
            let userItem = { ...listUsers[j] };
            if (rankItem.user_id == userItem.id) {
              rankItem.user_name = userItem.name;
              rankItem.avatar = userItem.avatar;
              listData.push(rankItem);
              break;
            }
          }
        }
      }
    }
    this.setState({ listDataRank: listData, examInMonth, myRank, lastItem: this.lastItem });
  };

  onPressTest = () => {
    this.ModalCourse.show();
  };

  onPressMonth = () => {
    // this.ModalMonth.show();
  };

  onPressYear = () => {
    // this.ModalYear.show();
  };

  onPressExamInMonth = () => {
    this.ModalExamMonth.show();
  };

  onPressChooseCourse = (item) => {
    this.params.level = item;
    LoadingModal.show();
    this.onSearchResults(false, this.params);
    this.ModalCourse.hide();
  };

  onPressChooseMonth = (item) => {
    this.params.month = item;
    LoadingModal.show();
    this.onSearchResults(false, this.params);
    this.ModalMonth.hide();
  };

  onPressChooseYear = (item) => {
    this.params.year = item;
    LoadingModal.show();
    this.onSearchResults(false, this.params);
    this.ModalYear.hide();
  };

  onPressChooseExam = (item) => {
    this.params.exam_id = item.exam_id;
    LoadingModal.show();
    this.onSearchResults(true, this.params);
    this.ModalExamMonth.hide();
  };

  onPressModalResult = (item) => {};

  keyExtractor = (item, index) => index.toString();

  ListHeaderComponent = () => {
    return (
      <View style={styles.header}>
        <BaseText style={styles.textStyle}>{Lang.testScreen.hint_text_top}</BaseText>
        <BaseText style={styles.titleNameStyle}>{Lang.testScreen.hint_text_name}</BaseText>
        <BaseText style={styles.textStyle}>{Lang.testScreen.hint_text_point}</BaseText>
        <BaseText style={styles.textStyle}>{Lang.testScreen.hint_text_level}</BaseText>
        <BaseText style={styles.textStyle}>合格</BaseText>
      </View>
    );
  };

  renderItem = ({ item, index }) => {
    return <ItemRank item={item} index={index} onPressShowResult={this.onPressModalResult} />;
  };

  render() {
    const { examInMonth, myRank, lastItem, listDataRank } = this.state;
    let title = '';
    if (examInMonth.length > 0) {
      const date = moment(examInMonth[0].created_at).format('DD');
      title = `${Lang.try_do_test.day} ${date}`;
    }
    return (
      <ScrollView style={styles.container} removeClippedSubviews={true}>
        <BaseText style={styles.title}>{Lang.testScreen.hint_text_title_rank}</BaseText>
        <View style={styles.viewMenu}>
          <ModalContent
            title={''}
            dataList={LEVEL}
            onPress={this.onPressTest}
            ref={(refs) => (this.ModalCourse = refs)}
            onPressChooseItem={this.onPressChooseCourse}
            content={lastItem.course || 'N5'}
          />
          <ModalContent
            title={Lang.try_do_test.month}
            dataList={MONTH}
            onPress={this.onPressMonth}
            ref={(refs) => (this.ModalMonth = refs)}
            onPressChooseItem={this.onPressChooseMonth}
            content={moment(lastItem.created_at).format('MM')}
          />
          {examInMonth.length >= 2 && (
            <ModalContent
              title={title}
              dataList={examInMonth}
              onPress={this.onPressExamInMonth}
              ref={(refs) => (this.ModalExamMonth = refs)}
              onPressChooseItem={this.onPressChooseExam}
              styleContent={{ height: 100 }}
              content={moment(lastItem.created_at).format('YYYY')}
              isExam={true}
            />
          )}
          <ModalContent
            title={Lang.try_do_test.year}
            dataList={YEAR}
            onPress={this.onPressYear}
            ref={(refs) => (this.ModalYear = refs)}
            styleContent={{ height: 120 }}
            onPressChooseItem={this.onPressChooseYear}
            content={moment(lastItem.created_at).format('YYYY')}
          />
        </View>
        {listDataRank.length == 0 ? (
          <BaseEmpty text={Lang.try_do_test.text_wait_rank} />
        ) : (
          <View style={{ flex: 1 }}>
            {Utils.token.length == 0 ? null : !myRank ? (
              <BaseText style={styles.userNot}>{Lang.testScreen.hint_text_not_my_name_rank}</BaseText>
            ) : (
              <BaseText style={styles.myRank}>{`${Lang.try_do_test.my_rank} #${myRank}`}</BaseText>
            )}
            <FlatList
              data={this.state.listDataRank}
              keyExtractor={this.keyExtractor}
              extraData={this.state}
              renderItem={this.renderItem}
              ListHeaderComponent={this.ListHeaderComponent}
              style={{ marginTop: 20 }}
            />
          </View>
        )}
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Resource.colors.white100
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Resource.colors.greenColorApp,
    textAlign: 'center'
  },
  userNot: {
    fontSize: 16,
    fontStyle: 'italic',
    color: Resource.colors.red900,
    paddingLeft: 25,
    paddingTop: 10,
    paddingBottom: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10
  },
  textStyle: {
    flex: 1,
    textAlign: 'center'
  },
  titleNameStyle: {
    flex: 3,
    textAlign: 'center'
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  topStyle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13
  },
  viewName: {
    flex: 2.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 5
  },
  avatarStyle: {
    width: 24,
    height: 24,
    borderRadius: 100
  },
  nameStyle: {
    paddingLeft: 7,
    fontSize: 13,
    flex: 4
  },
  pointStyle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13
  },
  doneStyle: {
    flex: 1,
    width: 13,
    height: 13
  },
  iconStyle: {
    width: 26,
    height: 26
  },
  viewMenu: {
    flexDirection: 'row',
    width: Dimension.widthParent,
    justifyContent: 'space-around',
    marginTop: 10
  },
  viewExamInMonth: {
    marginLeft: 20,
    alignSelf: 'flex-start',
    marginTop: 10
  },
  myRank: {
    fontSize: 16,
    color: Resource.colors.red900,
    paddingLeft: 25,
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: 'bold'
  },
  contentMyRank: {
    left: 20,
    width: 125,
    height: 150
  }
});
export default TestRankView;
