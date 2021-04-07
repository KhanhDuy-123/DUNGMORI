import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import Header from 'common/components/base/Header';
import LoadingModal from 'common/components/base/LoadingModal';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import NavigationService from 'common/services/NavigationService';
import React, { Component } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import FastImage from 'react-native-fast-image';
import ScreenNames from 'consts/ScreenName';
import Const from 'consts/Const';
import ItemHistoryTest from './containers/ItemHistoryTest';
import Funcs from 'common/helpers/Funcs';
const width = Dimension.widthParent;

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 10;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

export default class HistoryTestScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSections: [],
      page: 1,
      dataList: [],
      loadMore: false
    };
    this.heightHeader = 0;
  }

  componentDidMount() {
    this.getData();
  }

  componentWillUnmount() {
    clearTimeout(this.timeScroll);
  }

  getData = async () => {
    LoadingModal.show();
    let result = await Fetch.get(Const.API.PROFILE.GET_LIST_TEST, { page: this.state.page }, true);
    LoadingModal.hide();
    if (result.status == Fetch.Status.SUCCESS) {
      let data = result.data.result;
      try {
        data.map((e) => {
          e.results = Funcs.jsonParse(e.results);
          e.results = e.results.reverse();
          return e;
        });
        this.setState({ dataList: data });
      } catch (error) {
        Funcs.log(`ERRORR`, error);
      }
    }
  };

  onPressTestOld = (section) => (item) => {
    NavigationService.navigate(ScreenNames.HistoryTestLessonResultScreen, { section, item });
  };

  loadMoreData = () => {
    this.setState({ page: this.state.page + 1, loadMore: true }, this.onLoadMore);
  };

  onLoadMore = async () => {
    let result = await Fetch.get(Const.API.PROFILE.GET_LIST_TEST, { page: this.state.page }, true);
    if (result.status == Fetch.Status.SUCCESS && result.data.result.length !== 0) {
      this.setState((prevState) => {
        let dataList = prevState.dataList;
        const loadMore = false;
        try {
          let data = result.data.result;
          data.map((e) => {
            e.results = JSON.parse(e.results);
            return e;
          });
          dataList = dataList.concat(result.data.result);
        } catch (error) {
          Funcs.log(`ERRERROR LOAD MOREORR`, error);
        }
        return { dataList, loadMore };
      });
    }
  };

  updateSections = (activeSections) => {
    var pos = activeSections.length > 0 && activeSections[0] * (this.heightHeader + 10);
    if (pos) this.ScrollView.scrollTo({ y: pos, x: 0, animated: true });
    this.timeScroll = setTimeout(() => {
      this.setState({ activeSections });
    }, 0);
  };

  onPressDeleteTest = async (item) => {
    //xoa bai test
    this.LoadingModal.showLoading();
    let response = await Fetch.post(Const.API.LESSON.DELETE_TEST, { resultId: item.id }, true);
    this.LoadingModal.hideLoading();
    if (response.status == Fetch.Status.SUCCESS) {
      let dataList = this.state.dataList;
      let activeSections = this.state.activeSections;
      for (let i = 0; i < dataList.length; i++) {
        let content = { ...dataList[i] };
        if (content.id == item.idSection) {
          let results = [...content.results];
          for (let j = 0; j < results.length; j++) {
            if (results[j].id == item.id) {
              results.splice(j, 1);
              break;
            }
          }
          content.results = results;
          dataList[i] = content;
          if (results.length == 0) {
            dataList.splice(i, 1);
            activeSections = [];
          }
        }
      }
      this.setState({ dataList: dataList, activeSections });
    }
  };

  getHeight = (event) => {
    this.heightHeader = Math.round(event.nativeEvent.layout.height);
  };

  renderHeader = (section, index, isActive) => {
    return (
      <View style={styles.containerHeaders} ref={(refs) => (this.Header = refs)} key={section.id} onLayout={this.getHeight}>
        <BaseText style={styles.textTitleTest} numberOfLines={2}>
          {section.name}
        </BaseText>
      </View>
    );
  };

  renderContent = (section, index, isActive) => {
    if (isActive) {
      return (
        <ItemHistoryTest
          results={section.results}
          section={section}
          idSection={section.id}
          onPressTestOld={this.onPressTestOld(section)}
          onPressDeleteTest={this.onPressDeleteTest}
        />
      );
    } else {
      return null;
    }
  };

  render() {
    const { dataList, loadMore } = this.state;
    const showDataList = dataList && dataList.length > 0;
    return (
      <Container backgroundColor={Resource.colors.white100} statusBarColor={Resource.colors.white100} barStyle={'dark-content'}>
        <Header
          headerStyle={styles.headerStyle}
          titleArea={styles.titleArea}
          titleStyle={styles.titleStyle}
          left
          onBackPress={() => NavigationService.pop()}
          text={Lang.historyOfTest.text_header}
        />
        {showDataList ? (
          <ScrollView
            contentContainerStyle={styles.container}
            scrollEventThrottle={1}
            onMomentumScrollEnd={({ nativeEvent }) => {
              if (isCloseToBottom(nativeEvent)) this.loadMoreData();
            }}
            ref={(refs) => (this.ScrollView = refs)}>
            <Accordion
              sections={dataList}
              activeSections={this.state.activeSections}
              renderHeader={this.renderHeader}
              renderContent={this.renderContent}
              onChange={this.updateSections}
              containerStyle={{ alignItems: 'center' }}
              underlayColor={'transparent'}
              sectionContainerStyle={styles.sectionContainerStyle}
            />
          </ScrollView>
        ) : this.LoadingModal ? (
          <View style={styles.content}>
            <FastImage source={Resource.images.noBuyCoursegif} style={styles.logoStyle} resizeMode={FastImage.resizeMode.contain} />
            <BaseText style={styles.textNoBuyCourse}>{Lang.profile.text_no_test_history}</BaseText>
            <BaseText style={styles.textReferCourse}>{Lang.profile.text_refer_course}</BaseText>
          </View>
        ) : null}
        <LoadingModal ref={(refs) => (this.LoadingModal = refs)} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: Resource.colors.white100
  },
  titleArea: {
    alignItems: 'flex-start'
  },
  titleStyle: {
    fontStyle: 'italic'
  },
  container: {
    backgroundColor: Resource.colors.white100
  },
  sectionContainerStyle: {
    backgroundColor: Resource.colors.white100,
    shadowColor: Resource.colors.grey600,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 5,
    shadowRadius: Platform.OS === 'ios' ? 4 : 4,
    elevation: Platform.OS === 'ios' ? 0.3 : 5,
    borderRadius: 5 * Dimension.scale,
    marginTop: 10,
    marginBottom: 5,
    borderWidth: 0.5,
    borderColor: '#ddd'
  },
  containerHeaders: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    height: 47 * Dimension.scale,
    justifyContent: 'center',
    width: width - 40,
    paddingHorizontal: 20
  },
  textTitleTest: {
    fontSize: 13 * Dimension.scale,
    fontWeight: '500',
    color: Resource.colors.black1
  },
  containerContent: {
    justifyContent: 'center',
    width: width - 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3
  },
  textTitleTime: {
    fontSize: 12 * Dimension.scale
  },
  textDetailValue: {
    fontSize: 12 * Dimension.scale,
    fontWeight: Platform.OS == 'ios' ? '500' : '600'
  },
  buttonArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    alignItems: 'center',
    marginTop: 20
  },
  buttonDelete: {
    width: 110 * Dimension.scale,
    height: 32 * Dimension.scale,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Resource.colors.black1,
    backgroundColor: Resource.colors.white100
  },
  buttonViewTest: {
    width: 110 * Dimension.scale,
    height: 32 * Dimension.scale,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Resource.colors.greenColorApp
  },
  textButtonDelete: {
    fontSize: 13 * Dimension.scale,
    fontWeight: '600',
    color: Resource.colors.black1
  },
  textButtonViewTest: {
    fontSize: 13 * Dimension.scale,
    fontWeight: '600',
    color: Resource.colors.white100
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30
  },
  logoStyle: {
    width: 220 * Dimension.scale,
    height: 220 * Dimension.scale
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
  }
});
