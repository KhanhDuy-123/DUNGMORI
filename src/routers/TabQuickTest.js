import Colors from 'assets/Colors';
import Images from 'assets/Images';
import BaseText from 'common/components/base/BaseText';
import Header from 'common/components/base/Header';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { getStatusBarHeight } from 'common/helpers/IPhoneXHelper';
import { createAppContainer, createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import EventService from 'common/services/EventService';
import Dimension from 'common/helpers/Dimension';
import CommentLesson from 'screens/course/lession/containers/containers/CommentLesson';
import QuickTestScreen from 'screens/course/lession/containers/QuickTestScreen';
import Lang from 'assets/Lang';
import Const from 'consts/Const';
const statusBarHeight = getStatusBarHeight();

const StackQuickTest = createStackNavigator(
  {
    QuickTestScreen: { screen: QuickTestScreen }
  },
  {
    headerMode: 'none'
  }
);

var BottomMenu = null;
export default class TabQuickTest extends React.Component {
  constructor(props) {
    super(props);
    this.dataReply = null;
    this.refresh = false;
    this.TabQuickTest = createBottomTabNavigator(
      {
        Test: {
          screen: StackQuickTest,
          navigationOptions: () => ({
            tabBarLabel: Lang.quick_test.test,
            tabBarIcon: ({ focused, tintColor }) => <FastImage source={focused ? Images.imTestb : Images.imTesta} style={styles.iconFocus} />
          })
        },
        Comment: {
          screen: (prop) => <CommentLesson {...prop} reply={this.dataReply} refresh={this.refresh} screenProps={this.props.screenProps} />,
          navigationOptions: () => ({
            tabBarLabel: Lang.quick_test.comment,
            tabBarIcon: ({ focused, tintColor }) => <FastImage source={focused ? Images.imCommentb : Images.imCommenta} style={styles.iconFocus} />
          })
        }
      },
      {
        lazy: true,
        tabBarOptions: {
          scrollEnabled: false,
          keyboardHidesTabBar: true,
          tabStyle: { alignItems: 'center' },
          activeTintColor: Colors.greenColorApp,
          inactiveTintColor: '#000000'
        }
      }
    );
    BottomMenu = createAppContainer(this.TabQuickTest);
    this.state = { createBottom: this.TabQuickTest };
  }

  componentDidMount() {
    EventService.add(Const.EVENT.PRESS_NOTIFY_GO_TO_LESSON, (params) => {
      this.dataReply = params;
      this.refresh = true;
      this.setState({ createBottom: this.TabQuickTest });
    });
  }

  componentWillMount() {
    EventService.remove(Const.EVENT.PRESS_NOTIFY_GO_TO_LESSON);
  }

  onFocusInputComment = () => {};

  onBlurInputComment = () => {};

  onBackPress = () => {
    this.props.screenProps.onBackPress();
  };

  render() {
    const { params, nameCourse } = this.props.screenProps;
    let headerTitle = `${nameCourse} (${params?.item?.name})`;
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.wrapperHeader}>
          <View style={styles.viewHeader} />
          <Header
            left
            text={headerTitle}
            onBackPress={this.onBackPress}
            titleArea={styles.title}
            titleStyle={styles.textTitle}
            headerStyle={{ backgroundColor: Colors.greenColorApp }}
            colorBackButton={'#FFFFFF'}
          />
        </View>
        <View style={{ flex: 1, zIndex: 0 }}>
          <BottomMenu />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textFocus: {
    fontSize: 12,
    color: Colors.greenColorApp
  },
  textUnfocus: {
    fontSize: 12,
    color: '#525252'
  },
  iconFocus: {
    width: 20,
    height: 20
  },
  title: {
    marginLeft: 35
  },
  textTitle: {
    fontSize: 20,
    fontStyle: 'italic',
    color: '#FFFFFF',
    alignSelf: 'flex-start'
  },
  wrapperHeader: {
    shadowColor: 'grey',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 15,
    borderColor: 'transparent',
    zIndex: 1
  },
  viewHeader: {
    height: statusBarHeight,
    backgroundColor: Colors.greenColorApp,
    width: Dimension.widthParent
  }
});
