import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import ScreenNames from 'consts/ScreenName';
import React, { PureComponent } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import NavigationService from 'common/services/NavigationService';
import Dimension from 'common/helpers/Dimension';
import BaseButton from './BaseButton';
import BaseText from './BaseText';
import Configs from 'utils/Configs';

export default class BaseNoInternet extends PureComponent {
  onPress = () => {
    NavigationService.navigate(ScreenNames.CourseOfflineScreen);
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar translucent={true} backgroundColor={'transparent'} />
        <View style={styles.container}>
          <FastImage source={Resource.images.icNoInternet} style={styles.icon} resizeMode={FastImage.resizeMode.contain} />
          <BaseText style={styles.content}>{Lang.login.hint_no_internet}</BaseText>
          {Configs.enabledFeature.downloadVideo ? (
            <View>
              <BaseText style={styles.des}>{Lang.login.hint_des_no_internet}</BaseText>
              <BaseButton onPress={this.onPress} style={styles.button}>
                <BaseText style={styles.textStyle}>{Lang.login.hint_button_video_download}</BaseText>
              </BaseButton>
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40 * Dimension.scale
  },
  icon: {
    width: 200,
    height: 180,
    marginBottom: 20
  },
  textStyle: {
    fontSize: 11 * Dimension.scale,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center'
  },
  content: {
    fontSize: 17,
    fontWeight: '700'
  },
  des: {
    fontSize: 14,
    color: Resource.colors.grey500,
    textAlign: 'center',
    paddingTop: 5
  },
  button: {
    padding: 10,
    paddingHorizontal: 15,
    margin: 5,
    backgroundColor: Resource.colors.greenColorApp,
    borderRadius: 10,
    marginTop: 15
  },
  textHint: {
    marginHorizontal: 15
  }
});
