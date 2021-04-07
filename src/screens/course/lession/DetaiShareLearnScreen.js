import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import LoadingModal from 'common/components/base/LoadingModal';
import UrlConst from 'consts/UrlConst';
import React, { PureComponent } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';
import NavigationService from 'common/services/NavigationService';
import Dimension from 'common/helpers/Dimension';
const width = Dimension.widthParent;

export default class DetaiShareLearnScreen extends PureComponent {
  constructor(props) {
    super(props);
    const { data, dataUrl } = this.props.navigation.state.params;
    const textData = data ? UrlConst.NEWS + data.id + '-' + data.url : dataUrl.url;
    this.state = {
      text: textData
    };
    this.animatedView = new Animated.Value(-width);
    this.opacityView = new Animated.Value(1);
  }

  onPressClose = () => {
    NavigationService.pop();
  };

  onLoading = () => {
    Animated.timing(this.animatedView, {
      toValue: -width / 2,
      duration: 1000,
      useNativeDriver: true
    }).start();
  };

  onLoadingEnd = () => {
    Animated.sequence([
      Animated.timing(this.animatedView, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.delay(400),
      Animated.timing(this.opacityView, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      })
    ]).start(() => {
      this.setState({ text: 'dungmori.com' });
    });
  };

  showLoading = () => {
    this.LoadingModal.showLoading();
  };

  hideLoading = () => {
    this.LoadingModal.hideLoading();
  };

  render() {
    const { data, dataUrl } = this.props.navigation.state.params;
    return (
      <Container statusBarColor="#FFFFFF">
        <View style={styles.container}>
          <View style={styles.wraperHeader}>
            <Animated.View style={[styles.indicatorStyle, { transform: [{ translateX: this.animatedView }], opacity: this.opacityView }]} />
            <View style={styles.buttonClose}>
              <TouchableOpacity onPress={this.onPressClose}>
                <Icon name="ios-close" size={35} color={Resource.colors.black1} />
              </TouchableOpacity>
            </View>

            <View style={{ alignSelf: 'center', flex: 1, alignItems: 'center', marginHorizontal: 10 }}>
              <View style={{ flexDirection: 'row' }}>
                <FontAwesome name="lock" size={20} color={Resource.colors.greenColorApp} />
                <BaseText numberOfLines={1} style={{ marginLeft: 10 }}>
                  {this.state.text}
                </BaseText>
              </View>
            </View>
          </View>

          <WebView
            source={{
              uri: data ? UrlConst.NEWS + data.id + '-' + data.url : dataUrl.url
            }}
            onLoadStart={this.onLoading}
            onLoadEnd={this.onLoadingEnd}
            onError={this.onLoadingEnd}
          />
        </View>
        <LoadingModal ref={(refs) => (this.LoadingModal = refs)} />
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  headerStyle: {
    borderBottomWidth: 1,
    borderBottomColor: Resource.colors.borderWidth
  },
  titleStyle: {
    color: Resource.colors.black1
  },
  container: {
    flex: 1,
    paddingTop: 10
  },
  buttonClose: {
    // position: 'absolute',
    // top: -5,
    // right: 5
  },
  wraperHeader: {
    width,
    height: 40,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  indicatorStyle: {
    width,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    position: 'absolute'
  }
});
