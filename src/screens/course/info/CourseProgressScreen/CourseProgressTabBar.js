import Colors from 'assets/Colors';
import Styles from 'assets/Styles';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TabBar } from 'react-native-tab-view';

const TabBarIcon = ({ route, focused }) => {
  let color = focused ? Colors.greenColorApp : '#A6A6A6';
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ ...styles.viewStyle, backgroundColor: color }} />
        <View style={{ ...styles.viewStyle, backgroundColor: color }} />
        <View style={{ ...styles.viewStyle, backgroundColor: color }} />
        <View style={{ ...styles.viewStyle, backgroundColor: color }} />
      </View>
      <View style={{ ...styles.wrapper, borderColor: color }}>
        <View style={{ ...styles.vetiStyle, backgroundColor: color }} />
        <BaseText style={{ ...styles.numberColor, color }}>{route.key + 1}</BaseText>
      </View>
      <BaseText style={[focused ? styles.labelSelectedStyle : styles.labelStyle]}>{route.title}</BaseText>
    </View>
  );
};

export default (props) => (
  <TabBar
    {...props}
    activeColor="black"
    getLabelText={({ route }) => null}
    inactiveColor="black"
    lazy={true}
    style={styles.styleTabBar}
    indicatorStyle={styles.indicatorStyle}
    upperCaseLabel={false}
    pressColor="#FFFFFF"
    contentContainerStyle={Styles.center}
    renderIcon={TabBarIcon}
  />
);

const styles = StyleSheet.create({
  styleTabBar: {
    backgroundColor: Colors.white100,
    shadowOffset: { x: 2, y: 2 },
    shadowColor: 'grey',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2
  },
  labelStyle: {
    color: 'rgba(51, 51, 51, 0.8)',
    fontSize: 10 * Dimension.scale,
    paddingTop: 3
  },
  labelSelectedStyle: {
    color: Colors.greenColorApp,
    fontSize: 10 * Dimension.scale,
    paddingTop: 3
  },
  iconStyle: {
    width: 17 * Dimension.scale,
    height: 17 * Dimension.scale,
    marginTop: 3
  },
  indicatorStyle: {
    width: 0,
    height: 0
  },
  wrapper: {
    width: 16 * Dimension.scale,
    height: 16 * Dimension.scale,
    borderWidth: 1,
    borderColor: '#A6A6A6',
    ...Styles.center
  },
  numberColor: {
    fontSize: 7 * Dimension.scale,
    fontWeight: 'bold',
    color: '#A6A6A6',
    paddingTop: 3 * Dimension.scale
  },
  viewStyle: {
    width: 1 * Dimension.scale,
    height: 1.5 * Dimension.scale,
    backgroundColor: '#A6A6A6',
    marginHorizontal: 1,
    borderRadius: 1
  },
  vetiStyle: {
    width: 16,
    height: 1,
    backgroundColor: '#A6A6A6',
    position: 'absolute',
    top: 3
  }
});
