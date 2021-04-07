import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import LoginRequire from 'common/components/base/LoginRequire';
import StaticFlatlist from 'common/components/base/StaticFlatlist';
import Dimension from 'common/helpers/Dimension';
import SocketOnlineService from 'common/services/SocketOnlineService';
import UrlConst from 'consts/UrlConst';
import moment from 'moment';
import React, { Component } from 'react';
import { AppState, Dimensions, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import { connect } from 'react-redux';
import { getTestingRoom, updateTestingRoom } from 'states/redux/actions/TestingAction';
import Utils from 'utils/Utils';
import TextCountNext from '../../components/TextCountNext';
import ItemTestRoom from './ItemTestRoom';

const { width } = Dimensions.get('screen');

class TestRoomView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      online: 0
    };
  }

  async componentDidMount() {
    AppState.addEventListener('change', this.onListenAppState);
    if (Utils.token.length == 0) {
      this.props.jumpTo('TestRankView');
    }
    SocketOnlineService.disconnect();
    SocketOnlineService.init({
      url: UrlConst.SOCKET_COUNT_ONLINE + '?type=N0',
      onUpdate: (countData) => {
        let totalOnline = 0;
        let { testingInfoData, loading } = this.props;
        if (loading) return;
        testingInfoData = testingInfoData.map((e) => {
          const online = countData[e.course];
          if (e.online !== online) {
            e = { ...e, online };
          }
          return e;
        });

        // In lobby
        Object.keys(countData).map((e) => {
          if (countData[e] > 0) totalOnline += countData[e];
        });

        // UI
        this.setState({ online: totalOnline });
        this.props.updateTestingRoom(testingInfoData);
      }
    });
    this.onLoadData();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.isFocused && nextProps.isFocused !== this.props.isFocused) {
      this.onLoadData();
    }
    return this.state !== nextState;
  }

  componentWillUnmount() {
    SocketOnlineService.disconnect();
    clearInterval(this.countTime);
    AppState.removeEventListener('change', this.onListenAppState);
  }

  onListenAppState = (state) => {
    if (state === 'active') {
      this.getExamInfo();
    }
  };

  onLoadData = () => {
    this.setState({ loading: true });
    this.getExamInfo();
  };

  getExamInfo = async () => {
    this.props.getTestingRoom(() => {
      this.setState({ loading: false });
    });
  };

  jumpToRank = () => {
    this.props.jumpTo('TestRankView');
  };

  renderHeader = () => {
    return (
      <View style={styles.title}>
        <BaseText style={{ textAlign: 'center' }}>
          <BaseText style={{ fontSize: 15 }}>{Lang.try_do_test.test_calendar}</BaseText>{' '}
          <BaseText style={styles.textVietname}>{`(${Lang.try_do_test.hour_vn})`}</BaseText>
        </BaseText>
        <View style={styles.areaTime}>
          <View style={styles.showTime}>
            <BaseText style={styles.textTime}>{`${Lang.try_do_test.morning}: 9h-11h30`}</BaseText>
          </View>
          <View style={[styles.showTime, { marginLeft: 25 }]}>
            <BaseText style={styles.textTime}>{`${Lang.try_do_test.night}: 19h-21h30`}</BaseText>
          </View>
        </View>
      </View>
    );
  };

  renderItem = ({ item, index }) => {
    return <ItemTestRoom item={item} jumpToRank={this.jumpToRank} />;
  };

  renderContent = () => {
    const { testingInfoData } = this.props;
    return <StaticFlatlist data={testingInfoData} renderItem={this.renderItem} />;
  };

  renderFooter = () => {
    const { currentTime } = this.props;
    return (
      <View style={styles.viewFooter}>
        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-evenly' }}>
          <BaseText>{`${Lang.try_do_test.online}`}</BaseText>
        </View>
        <View style={styles.viewOnline}>
          <View style={styles.animatedCircle} />
          <BaseText style={{ fontSize: 14, fontWeight: 'bold' }}>{this.state.online}</BaseText>
        </View>
        {currentTime !== 0 && (
          <View style={{ flex: 2, alignItems: 'center' }}>
            <BaseText>{`${Lang.try_do_test.now}`}</BaseText>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
              <View style={styles.viewWrappVn}>
                <TextCountNext time={currentTime} textStyle={{ color: 'white', ...styles.textTimeStart }} />
              </View>
              <BaseText>{moment().format('DD/MM')}</BaseText>
            </View>
          </View>
        )}
      </View>
    );
  };

  render() {
    if (!Utils.user.id) {
      return <LoginRequire />;
    } else {
      return (
        <ScrollView refreshControl={<RefreshControl refreshing={this.state.loading} onRefresh={this.onLoadData} />}>
          <View style={styles.container}>
            {/* {this.renderHeader()} */}
            {this.renderContent()}
            {this.renderFooter()}
          </View>
        </ScrollView>
      );
    }
  }
}

const mapDispatchToProps = { getTestingRoom, updateTestingRoom };
const mapStateToProps = (state) => ({
  testingInfoData: state.testingReducer?.testingInfoData || Utils.listTestingRoom,
  currentTime: state.testingReducer?.currentTime
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(withNavigationFocus(TestRoomView));

const styles = StyleSheet.create({
  flexible: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    paddingBottom: 30,
    backgroundColor: 'white'
  },
  title: {
    width: 290 * Dimension.scale,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15
  },
  textVietname: {
    fontWeight: '700',
    fontSize: 14
  },
  areaTime: {
    flexDirection: 'row',
    marginTop: 10
  },
  showTime: {
    height: 30 * Dimension.scale,
    paddingHorizontal: 5,
    width: 125 * Dimension.scale,
    borderRadius: 5,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#345086',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textTime: {
    fontWeight: '600',
    color: '#345086',
    fontSize: 15
  },
  areaContent: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 30,
    alignItems: 'center'
  },
  content: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000'
  },
  frameName: {
    width: 70,
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  areaGoTest: {
    width: 150,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    backgroundColor: Resource.colors.greenColorApp,
    marginVertical: 5,
    height: 40
  },
  textGoTest: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600'
  },
  textTesting: {
    fontSize: 13,
    color: Resource.colors.greenColorApp
  },
  textTimeStart: {
    fontSize: 14
  },
  viewWrappVn: {
    paddingHorizontal: 5,
    borderRadius: 5,
    backgroundColor: 'green',
    paddingVertical: 3,
    marginRight: 5
  },
  areaTest: {
    flex: 1,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E7E8E9'
  },
  viewWrappTimeEnd: {
    backgroundColor: '#676767',
    padding: 5,
    borderRadius: 5,
    marginVertical: 3
  },
  animatedCircle: {
    width: 10,
    height: 10,
    backgroundColor: Resource.colors.greenColorApp,
    borderRadius: 50,
    marginRight: 10
  },
  viewFooter: {
    width: width,
    height: 80,
    alignItems: 'center',
    backgroundColor: '#EEF7FE',
    marginTop: 30,
    flexDirection: 'row'
  },
  viewOnline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  contentNew: {
    flex: 1,
    paddingRight: 15,
    justifyContent: 'center'
  },
  textOnline: {
    fontSize: 14,
    fontWeight: 'bold'
  }
});
