import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseNoInternet from 'common/components/base/BaseNoInternet';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import UrlConst from 'consts/UrlConst';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { TabBar, TabView } from 'react-native-tab-view';
import { connect } from 'react-redux';
import AppContextView from 'states/context/views/AppContextView';
import Utils from 'utils/Utils';
import TestHistory from './TestHistory';
import TestRankView from './TestRankView';
import TestRoomView from './TestRoomView';

const width = Dimension.widthParent;
class TestScreen extends AppContextView {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [{ key: 'TestRoomView', title: '' }, { key: 'TestRankView', title: '' }, { key: 'TestHistory', title: '' }]
    };
  }

  async componentDidMount() {
    // Get career list
    const carres = await Fetch.get(UrlConst.API_JP_TEST + 'get-careers', null, false, null, true);
    if (carres.status === 200) {
      let listCareer = carres.data?.careers;
      listCareer = listCareer.map((e) => {
        e.name = e.title;
        return e;
      });
      if (listCareer?.length > 0) Utils.listCareer = listCareer;
    }
  }

  onIndexChange = (index) => {
    this.setState({ index });
  };

  renderHeader = () => {
    return (
      <View style={styles.headerStyle}>
        <BaseText style={styles.titleStyle}>{Lang.testScreen.text_header_testscreen}</BaseText>
      </View>
    );
  };

  renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'TestRoomView': {
        return <TestRoomView jumpTo={jumpTo} />;
      }
      case 'TestRankView': {
        return <TestRankView />;
      }
      case 'TestHistory': {
        return <TestHistory />;
      }
    }
  };

  renderIcon = ({ route, focused }) => {
    switch (route.key) {
      case 'TestRoomView': {
        return (
          <View style={[styles.containerTabBar, focused ? styles.tabBarFocus : null]}>
            <FastImage
              source={focused ? Resource.images.icThiThuFocus : Resource.images.icThiThu}
              style={styles.iconStyle}
              resizeMode={FastImage.resizeMode.contain}
            />
            <BaseText style={focused ? styles.textLabelFocus : styles.textLabel}>{Lang.try_do_test.try_test}</BaseText>
          </View>
        );
      }
      case 'TestRankView': {
        return (
          <View style={[styles.containerTabBar, focused ? styles.tabBarFocus : null]}>
            <FastImage
              source={focused ? Resource.images.icXepHangFocus : Resource.images.icRank}
              style={styles.iconStyle}
              resizeMode={FastImage.resizeMode.contain}
            />
            <BaseText style={focused ? styles.textLabelFocus : styles.textLabel}>{Lang.try_do_test.text_rank}</BaseText>
          </View>
        );
      }
      case 'TestHistory': {
        return (
          <View style={[styles.containerTabBar, focused ? styles.tabBarFocus : null]}>
            <FastImage
              source={focused ? Resource.images.icLichSuFocus : Resource.images.icLichSu}
              style={styles.iconStyle}
              resizeMode={FastImage.resizeMode.contain}
            />
            <BaseText style={focused ? styles.textLabelFocus : styles.textLabel}>{Lang.try_do_test.history_test}</BaseText>
          </View>
        );
      }
    }
  };

  render() {
    const { internet = true } = this.context || {};
    if (!internet) return <BaseNoInternet />;
    return (
      <Container style={{ backgroundColor: '#EEF0F2' }}>
        {this.renderHeader()}
        <TabView
          lazy={true}
          onIndexChange={this.onIndexChange}
          navigationState={this.state}
          renderScene={this.renderScene}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              getLabelText={({ route }) => route.title}
              style={styles.tabStyle}
              activeColor={Resource.colors.greenColorApp}
              inactiveColor="#9E9E9E"
              labelStyle={styles.labelStyle}
              renderIcon={this.renderIcon}
              renderIndicator={() => <View />}
            />
          )}
        />
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  listCourse: state.listOwnCourseReducer.listCourse,
  language: state.languageReducer.language
});

export default connect(
  mapStateToProps,
  null
)(TestScreen);

const styles = StyleSheet.create({
  headerStyle: {
    shadowRadius: 2,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50 * Dimension.scale,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    elevation: 1
  },
  titleStyle: {
    width: '100%',
    fontSize: 18 * Dimension.scale,
    fontWeight: '600',
    textAlign: 'center'
  },
  tabStyle: {
    height: 120,
    justifyContent: 'center',
    width: width,
    shadowColor: '#FFFFFF',
    elevation: 0,
    backgroundColor: '#FFFFFF'
  },
  labelStyle: {
    fontSize: 15,
    fontWeight: '600'
  },
  iconStyle: {
    width: 30,
    height: 30
  },
  containerTabBar: {
    width: 100,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 0.7,
    borderColor: 'grey'
  },
  textLabel: {
    color: '#C2C2C3',
    marginTop: 10,
    fontSize: 15
  },
  textLabelFocus: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 15,
    fontWeight: '500'
  },
  tabBarFocus: {
    backgroundColor: Resource.colors.greenColorApp,
    borderWidth: 0,
    elevation: 1,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  imgProceess: {
    textAlign: 'center',
    fontSize: 18,
    color: Resource.colors.greenColorApp,
    marginTop: 20
  },
  wrapperProcess: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white'
  },
  imageTesting: {
    width: Dimension.widthParent - 40,
    height: ((Dimension.widthParent - 40) * 2) / 3,
    marginBottom: 10
  }
});
