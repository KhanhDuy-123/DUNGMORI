import Resource from 'assets/Resource';
import React, { PureComponent } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';

const statusBarHeight = StatusBar.currentHeight;
export class Container extends PureComponent {
  static defaultProps = {
    barStyle: 'dark-content',
    hiddenStatusBar: false,
    translucent: true
  };
  render() {
    return (
      <SafeAreaView style={{ flex: 1, ...this.props.containerStyles }}>
        <View style={[styles.container, this.props.style]}>
          <StatusBar
            backgroundColor={this.props.statusBarColor}
            barStyle={this.props.barStyle}
            hidden={this.props.hiddenStatusBar}
            translucent={this.props.translucent}
          />
          {this.props.children}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Resource.colors.white100,
    paddingTop: Platform.OS === 'android' ? statusBarHeight : 0
  }
});

export default Container;
