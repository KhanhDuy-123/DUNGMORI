import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationService from 'common/services/NavigationService';
import Dimension from 'common/helpers/Dimension';
import StorageService from 'common/services/StorageService';

export class IntroAppScreen extends PureComponent {
  state = {
    list: [
      { id: '0', image: Resource.images.intro1 },
      { id: '1', image: Resource.images.intro2 },
      { id: '2', image: Resource.images.intro3 },
      { id: '3', image: Resource.images.intro4 }
    ]
  };

  onPressButton = () => {
    StorageService.save(Const.DATA.KEY_INTRODCUCING_APP, Const.DATA.SHOW_INTRO_APP);
    NavigationService.reset(ScreenNames.HomeScreen);
  };

  renderItem = ({ item }) => {
    return (
      <View style={styles.container}>
        <FastImage source={item.image} style={styles.imageStyle} resizeMode={FastImage.resizeMode.contain} />
      </View>
    );
  };

  renderDoneButton() {
    return (
      <View style={styles.buttonCircle}>
        <Icon name="md-checkmark" size={20} color={Resource.colors.white100} />
      </View>
    );
  }

  renderNextButton() {
    return (
      <View style={styles.buttonCircle}>
        <Icon name="md-arrow-round-forward" size={20} color={Resource.colors.white100} />
      </View>
    );
  }
  renderSkipButton() {
    return <BaseText style={{ color: Resource.colors.greenColorApp, fontSize: 17, paddingTop: 10 }}>Skip</BaseText>;
  }

  render() {
    return (
      <Container>
        <AppIntroSlider
          renderItem={this.renderItem}
          dotStyle={{ backgroundColor: Resource.colors.green200 }}
          activeDotStyle={{ backgroundColor: Resource.colors.greenColorApp, width: 30 }}
          showSkipButton={true}
          slides={this.state.list}
          onDone={this.onPressButton}
          onSkip={this.onPressButton}
          renderDoneButton={this.renderDoneButton}
          renderNextButton={this.renderNextButton}
          renderSkipButton={this.renderSkipButton}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Resource.colors.white100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageStyle: {
    width: 270 * Dimension.scale,
    height: 450 * Dimension.scale
  },
  buttonCircle: {
    width: 35 * Dimension.scale,
    height: 35 * Dimension.scale,
    backgroundColor: Resource.colors.greenColorApp,
    borderRadius: 20 * Dimension.scale,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 0.5
  }
});

export default IntroAppScreen;
