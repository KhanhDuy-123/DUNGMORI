import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import Header from 'common/components/base/Header';
import LoadingModal from 'common/components/base/LoadingModal';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import NavigationService from 'common/services/NavigationService';
import Const from 'consts/Const';
import CourseConst from 'consts/CourseConst';
import ScreenNames from 'consts/ScreenName';
import React, { Component } from 'react';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import ItemMyCourse from './containers/ItemMyCourse';
const width = Dimension.widthParent;

const fontSizeTextName = 12 * Dimension.scale;
const courseAdditionList = [CourseConst.N4_ADDITIONAL.ID, CourseConst.N3_ADDITIONAL.ID, CourseConst.N2_ADDITIONAL.ID];
const courseHasAdditionList = [CourseConst.N3.ID, CourseConst.N2.ID, CourseConst.N1.ID];
export default class MyCourseScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ishowItem: false,
      multipleSelect: true,
      activeSections: [],
      loading: true
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentWillUnmount() {
    clearTimeout(this.timeScrollHeader);
  }

  getData = async () => {
    LoadingModal.show();
    const myCource = await Fetch.get(Const.API.USER.GET_MY_COURSE, null, true);
    LoadingModal.hide();
    if (myCource.status === Fetch.Status.SUCCESS) {
      let listMyCource = myCource.data;

      // Cập nhật thời hạn khóa học bổ sung
      listMyCource = listMyCource.map((e) => {
        for (let i = 0; i < courseAdditionList.length; i += 1) {
          if (e.course_id === courseAdditionList[i]) {
            let find = listMyCource.find((e1) => e1.course_id === courseHasAdditionList[i]);
            if (find && e.watch_expired_day < find.watch_expired_day) e.watch_expired_day = find.watch_expired_day;
            e = { ...e, price: 1, price_option: 1 };
          }
        }

        return e;
      });
      this.setState({ listMyCource, loading: false });
    }
  };

  onPressLoadMoreCourse = () => {
    this.setState({});
  };

  updateSections = (activeSections) => {
    this.setState({ activeSections });
  };

  onPressLearnNow = () => {
    NavigationService.replace(ScreenNames.HomeScreen, { type: 'typeLearnNow' });
  };

  onScrollTopHeader = () => {
    this.timeScrollHeader = setTimeout(() => {
      this.flatListRef.scrollTo(0);
    }, 50);
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => {
    return <ItemMyCourse item={item} />;
  };

  render() {
    const { listMyCource, loading } = this.state;
    const showListMyCource = listMyCource && listMyCource.length === 0;
    return (
      <Container>
        <Header
          left
          onBackPress={() => NavigationService.pop()}
          text={Lang.profile.text_my_course}
          headerStyle={styles.headerStyle}
          titleStyle={styles.titleStyle}
          colorBackButton={Resource.colors.black1}
          titleArea={{ alignItems: null }}
          onScrollTopHeader={this.onScrollTopHeader}
        />
        {showListMyCource ? (
          <View style={styles.content}>
            <FastImage source={Resource.images.noBuyCoursegif} style={styles.logoStyle} resizeMode={FastImage.resizeMode.contain} />
            <BaseText style={styles.textNoBuyCourse}>{Lang.profile.text_no_buy_course}</BaseText>
            <BaseText style={styles.textReferCourse}>{Lang.profile.text_refer_course}</BaseText>
            <View style={styles.viewButton}>
              <TouchableOpacity style={styles.btnLearn} onPress={this.onPressLearnNow}>
                <BaseText style={styles.textButton}>{Lang.profile.button_learn_try_now}</BaseText>
              </TouchableOpacity>
            </View>
          </View>
        ) : !loading ? (
          <ScrollView ref={(ref) => (this.flatListRef = ref)} contentContainerStyle={styles.container}>
            <FlatList style={styles.flastList} keyExtractor={this.keyExtractor} data={listMyCource} renderItem={this.renderItem} />
          </ScrollView>
        ) : null}
        <LoadingModal ref={(refs) => (this.LoadingModal = refs)} />
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: Resource.colors.white100,
    paddingHorizontal: 5 * Dimension.scale
  },
  titleStyle: {
    color: Resource.colors.black1,
    fontStyle: 'italic'
  },
  contain: {
    paddingBottom: 20
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30
  },
  viewButton: {
    marginTop: 30,
    justifyContent: 'center'
  },
  btnLearn: {
    width: width / 2,
    height: 35 * Dimension.scale,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Resource.colors.greenColorApp,
    borderRadius: 20 * Dimension.scale
  },
  textNoBuyCourse: {
    fontSize: 14 * Dimension.scale,
    fontWeight: '600',
    fontStyle: 'italic',
    marginBottom: 10,
    color: Resource.colors.red700
  },
  textReferCourse: {
    fontSize: 14 * Dimension.scale,
    lineHeight: 20,
    textAlign: 'center',
    color: Resource.colors.black1
  },
  textButton: {
    fontSize: fontSizeTextName,
    fontWeight: '600',
    color: Resource.colors.white100
  },
  container: {
    paddingVertical: 15,
    backgroundColor: Resource.colors.white100
  },
  logoStyle: {
    width: 220 * Dimension.scale,
    height: 220 * Dimension.scale
  },
  seenMoreBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 40
  },
  seenMore: {
    borderBottomWidth: 1,
    borderBottomColor: Resource.colors.red700
  },
  titleSeenMore: {
    fontSize: fontSizeTextName,
    fontStyle: 'italic',
    textAlign: 'right',
    color: Resource.colors.red700
  }
});
