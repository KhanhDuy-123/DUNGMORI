import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import Dimension from 'common/helpers/Dimension';
import NavigationService from 'common/services/NavigationService';
import React, { PureComponent } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import ScreenNames from 'consts/ScreenName';
import BaseButton from './BaseButton';
import BaseText from './BaseText';

export default class LoginRequire extends PureComponent {
  onPress = () => {
    NavigationService.navigate(ScreenNames.ParentAuthenticateScreen);
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar translucent={true} backgroundColor={'transparent'} />
        <View style={styles.container}>
          <FastImage source={Resource.images.gifLogin} style={styles.icon} resizeMode={FastImage.resizeMode.contain} />
          <BaseText style={styles.content}>{Lang.login.login_require}</BaseText>
          <BaseButton onPress={this.onPress} style={styles.button}>
            <BaseText style={styles.textStyle}>{Lang.login.login_now}</BaseText>
          </BaseButton>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    width: 200,
    height: 180,
    marginBottom: 20
  },
  textStyle: {
    fontSize: 12 * Dimension.scale,
    fontWeight: '600',
    color: 'white'
  },
  content: {
    fontSize: 15
  },
  button: {
    padding: 10,
    paddingHorizontal: 15,
    margin: 5,
    backgroundColor: Resource.colors.greenColorApp,
    borderRadius: 25,
    marginTop: 15
  },
  textHint: {
    marginHorizontal: 15
  }
});
