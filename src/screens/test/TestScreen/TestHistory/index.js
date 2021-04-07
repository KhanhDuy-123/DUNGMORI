import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseEmpty from 'common/components/base/BaseEmpty';
import BaseText from 'common/components/base/BaseText';
import LoginRequire from 'common/components/base/LoginRequire';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import NavigationService from 'common/services/NavigationService';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import UrlConst from 'consts/UrlConst';
import React, { PureComponent } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import Utils from 'utils/Utils';
import ItemHistoryTestJLPT from './ItemHistoryTestJLPT';
import ModalTestingResult from '../../components/ModalTestingResult';

class TestHistory extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    this.setState({ loading: true });
    const listCourse = this.props.listCourse;
    const userId = Utils.user.id;
    let certificateInfo = null;
    let data = [];
    let response = await Fetch.get(UrlConst.API_RANKING + `/${Const.API.TRY_DO_TEST.GET_HISTORY_TEST}` + `/${userId}`, null, null, null, true);
    if (response.status == Fetch.Status.SUCCESS) {
      data = response.data.myResults.map((item) => {
        for (let j = 0; j < listCourse.length; j++) {
          if (listCourse[j].name == item.course_name) {
            item.owned = true;
          }
        }
        item.certificate_info = Funcs.jsonParse(item.certificate_info);
        if (item.certificate_info) {
          certificateInfo = item.certificate_info;
        }
        return item;
      });
    }

    // Update all certificate if null
    data = data.map((e) => {
      if (!e.certificate_info || !e.certificate_info.fullname) e.certificate_info = certificateInfo;
      return e;
    });
    this.setState({ data, loading: false });
  };

  onPressShowResults = (item) => {
    const { certificate_info = {}, exam_id, score_1, score_2, score_3, course, total_score, created_at } = item;
    ModalTestingResult.showModal(certificate_info, { id: exam_id, score_1, score_2, score_3, course, total_score, created_at });
  };

  onPressShowTest = (item) => () => {
    NavigationService.navigate(ScreenNames.ShowAnswersScreen, { item: { ...item } });
  };

  onPressGoEditInfor = (item) => {
    NavigationService.navigate(ScreenNames.UpdateProfileCertificateScreen, item);
  };

  checkPass = (course, score1, score2, score3, totalScore) => {
    if (score1 < 19 || score2 < 19 || score3 < 19) return false;
    if (course == 'N5' && totalScore >= 80) {
      return true;
    } else if (course == 'N4' && totalScore >= 90) {
      return true;
    } else if (course == 'N3' && totalScore >= 95) {
      return true;
    } else if (course == 'N2' && totalScore >= 90) {
      return true;
    } else if (course == 'N1' && totalScore >= 100) {
      return true;
    }
  };

  keyExtractor = (item, index) => index.toString();

  ListHeaderComponent = () => {
    return (
      <View style={styles.header}>
        <View style={{ flex: 0.5 }}>
          <BaseText style={styles.levelHeaderStyle}>{Lang.testScreen.hint_text_level_result}</BaseText>
        </View>
        <View style={{ flex: 1 }}>
          <BaseText style={styles.titleNameStyle}>{Lang.testScreen.hint_text_count_point}</BaseText>
        </View>
        <View style={{ flex: 1 }}>
          <BaseText style={styles.titleNameStyle}>{Lang.testScreen.hint_text_date_test}</BaseText>
        </View>
      </View>
    );
  };

  renderItem = ({ item, index }) => {
    return <ItemHistoryTestJLPT item={item} onPressShowResults={this.onPressShowResults} onPressGoEditInfor={this.onPressGoEditInfor} />;
  };

  render() {
    if (Utils.token.length == 0) {
      return <LoginRequire />;
    } else {
      if (this.state.data.length == 0) {
        return <BaseEmpty />;
      } else {
        return (
          <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={this.state.loading} onRefresh={this.getData} />}>
            <BaseText style={styles.title}>{Lang.testScreen.hint_text_result_test}</BaseText>
            <FlatList
              data={this.state.data}
              keyExtractor={this.keyExtractor}
              extraData={this.state}
              renderItem={this.renderItem}
              ListHeaderComponent={this.ListHeaderComponent}
            />
          </ScrollView>
        );
      }
    }
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
    textAlign: 'center',
    paddingBottom: 25
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    color: Resource.colors.greenColorApp,
    paddingRight: 5,
    paddingTop: 10
  },
  content: {
    fontSize: 15,
    fontWeight: '700',
    color: Resource.colors.greenColorApp,
    paddingTop: 10,
    paddingRight: 5
  },
  viewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingTop: 10,
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0
  },
  button: {
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  viewModal: {
    width: 60,
    height: 150,
    position: 'absolute',
    top: 35,
    left: 35,
    borderRadius: 5,
    backgroundColor: Resource.colors.white100,
    borderWidth: 0.5,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 1,
    zIndex: 2000
  },
  userNot: {
    fontSize: 15,
    fontStyle: 'italic',
    color: Resource.colors.red900,
    paddingLeft: 25,
    paddingTop: 80,
    paddingBottom: 20
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimension.widthParent
  },
  textStyle: {
    flex: 1,
    textAlign: 'center'
  },
  levelHeaderStyle: {
    textAlign: 'center'
  },
  titleNameStyle: {
    textAlign: 'center'
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20
  },
  topStyle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15
  },
  levelStyle: {
    flex: 1.2,
    textAlign: 'center',
    fontSize: 15
  },
  viewName: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10
  },
  dateStyle: {
    flex: 3,
    fontSize: 15,
    textAlign: 'center'
  },
  avatarStyle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    flex: 1
  },
  nameStyle: {
    paddingLeft: 4,
    fontSize: 12
  },
  textPoint: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  viewTitle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textButton: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600'
  },
  buttonView: {
    borderRadius: 25,
    backgroundColor: Resource.colors.greenColorApp,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    height: 20,
    marginLeft: 5,
    marginTop: 5
  },
  textContent: {
    fontSize: 14
  },
  item: {
    flex: 1,
    alignItems: 'center'
  }
});

const mapStateToProps = (state) => ({
  listCourse: state.listOwnCourseReducer.listCourse
});

export default connect(
  mapStateToProps,
  null
)(TestHistory);
