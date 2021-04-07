import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import ChatScreen from 'screens/chat/ChatScreen';
import { NotifyScreen, ProfileScreen } from 'screens/profile';
import TestScreen from 'screens/test/TestScreen';
import Dimension from 'common/helpers/Dimension';
import BadgeIconTab from './BadgeIconTab';
import HomeScreen from 'screens/HomeScreen';
import { getBottomSpace, isIphone12 } from 'common/helpers/IPhoneXHelper';
var Bottom = null;
class TabHome extends React.Component {
  constructor(props) {
    super(props);
    this.tabBottom = createBottomTabNavigator(
      {
        Learncreen: {
          screen: HomeScreen,
          navigationOptions: () => ({
            tabBarLabel: ({ focused, tintColor }) => <BaseText style={focused ? styles.labelStyle : styles.labelStyles}>{Lang.navigation.text_learn}</BaseText>,
            tabBarIcon: ({ focused, tintColor }) => (
              <View style={styles.contain}>
                <FastImage
                  source={focused ? Resource.images.icHeart2 : Resource.images.icHeart}
                  style={styles.imageTab}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
            ),
            tabBarOnPress: (event) => {
              const { navigation } = event;
              event.defaultHandler();
              if (navigation.state.params && navigation.state.params.scrollToTop && navigation.isFocused()) {
                navigation.state.params.scrollToTop();
              }
            }
          })
        },

        ChatScreen: {
          screen: ChatScreen,
          navigationOptions: ({ navigation }) => ({
            tabBarLabel: ({ focused, tintColor }) => <BaseText style={focused ? styles.labelStyle : styles.labelStyles}>{Lang.navigation.text_chat}</BaseText>,
            tabBarIcon: ({ focused, tintColor }) => (
              <BadgeIconTab
                focused={focused}
                img1={Resource.images.icChat2}
                img2={Resource.images.icChat}
                label={'Nhắn tin'}
                badgeType={'chat'}
                navigation={navigation}
              />
            )
          })
        },

        // NewfeedScreen: {
        //   screen: NewfeedScreen,
        //   navigationOptions: () => ({
        //     tabBarLabel: 'Diễn đàn',
        //     tabBarIcon: ({ tintColor }) => <Ionicons name="ios-globe" size={20} color={tintColor} />
        //   })
        // },

        TestScreen: {
          screen: TestScreen,
          navigationOptions: () => ({
            tabBarLabel: ({ focused, tintColor }) => <BaseText style={focused ? styles.labelStyle : styles.labelStyles}>{Lang.navigation.text_test}</BaseText>,
            tabBarIcon: ({ focused, tintColor }) => (
              <View style={styles.contain}>
                <FastImage
                  source={focused ? Resource.images.icTest2 : Resource.images.icTest}
                  style={styles.imageTab}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
            )
          })
        },

        Notify: {
          screen: NotifyScreen,
          navigationOptions: ({ navigation }) => ({
            tabBarLabel: ({ focused, tintColor }) => <BaseText style={focused ? styles.labelStyle : styles.labelStyles}>{Lang.navigation.text_noti}</BaseText>,
            tabBarIcon: ({ focused }) => (
              <BadgeIconTab
                focused={focused}
                img1={Resource.images.icActiveNoti}
                img2={Resource.images.icInActiveNoti}
                label={'Thông báo'}
                badgeType={'notify'}
                navigation={navigation}
              />
            )
          })
        },

        ProfileScreen: {
          screen: ProfileScreen,
          navigationOptions: {
            tabBarLabel: ({ focused, tintColor }) => (
              <BaseText style={focused ? styles.labelStyle : styles.labelStyles}>{Lang.navigation.text_profile}</BaseText>
            ),
            tabBarIcon: ({ focused, tintColor }) => (
              <View style={styles.contain}>
                <FastImage
                  source={focused ? Resource.images.icPerson2 : Resource.images.icPerson}
                  style={styles.imageTab}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
            )
          }
        }
      },
      {
        tabBarOptions: {
          showLabel: true,
          labelPosition: 'below-icon',
          style: {
            alignItems: 'center',
            borderTopWidth: 0.25,
            borderTopColor: 'grey',
            height: 45 * Dimension.scale
          },
          keyboardHidesTabBar: Platform.OS == 'android' ? true : false,
          tabStyle: { justifyContent: 'space-between', flexDirection: 'column', alignItems: 'center' }
        },
        swipeEnabled: false,
        tabBarPosition: 'bottom'
      }
    );
    Bottom = createAppContainer(this.tabBottom);
    this.state = {
      createTabBottom: this.tabBottom
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.language !== this.props.language) {
      this.setState({ createTabBottom: this.tabBottom });
    }
    return nextState !== this.state;
  }

  render() {
    return (
      <View style={[styles.container, { paddingBottom: isIphone12 ? getBottomSpace() : 0 }]}>
        <Bottom />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    language: state.languageReducer.language
  };
}

export default connect(
  mapStateToProps,
  null
)(TabHome);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contain: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  labelStyle: {
    fontSize: 9 * Dimension.scale,
    fontWeight: '600',
    color: Resource.colors.black1,
    marginBottom: 3
  },
  labelStyles: {
    fontSize: 9 * Dimension.scale,
    fontWeight: '500',
    color: Resource.colors.black3,
    marginBottom: 3
  },
  imageTab: {
    width: 18 * Dimension.scale,
    height: 18 * Dimension.scale
  }
});
