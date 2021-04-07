import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, SafeAreaView, StatusBar } from 'react-native';
import Resource from 'assets/Resource';
import BaseText from './BaseText';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { WebView } from 'react-native-webview';
import NavigationService from 'common/services/NavigationService';
import Dimension from 'common/helpers/Dimension';
import Icon from 'react-native-vector-icons/Ionicons';

const height = Dimension.heightParent;
const width = Dimension.widthParent;

export default class WebViewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      title: ''
    };
    this.animatedProgress = new Animated.Value(-width);
    this.opacityView = new Animated.Value(1);
  }

  componentDidMount() {
    let data = this.props.navigation.state.params.data;
    this.setState({ data, title: data });
    StatusBar.setBarStyle('dark-content');
  }

  onLoad = () => {
    Animated.timing(this.animatedProgress, {
      toValue: -width / 2,
      duration: 1000,
      useNativeDriver: true
    }).start();
  };

  onEnd = () => {
    Animated.sequence([
      Animated.timing(this.animatedProgress, {
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
      this.setState({ title: 'dungmori.com' });
    });
  };

  onPressGoBack = () => {
    NavigationService.pop();
  };

  render() {
    const { data } = this.state;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.wraperHeader}>
            <Animated.View
              style={[
                styles.indicatorStyle,
                {
                  transform: [{ translateX: this.animatedProgress }],
                  opacity: this.opacityView
                }
              ]}
            />
            <View style={styles.buttonClose}>
              <TouchableOpacity onPress={this.onPressGoBack}>
                <Icon name="md-arrow-round-back" size={26} color={Resource.colors.black1} />
              </TouchableOpacity>
            </View>

            <View style={styles.header}>
              <View style={styles.headerContent}>
                <FontAwesome name="lock" size={20} color={Resource.colors.greenColorApp} />
                <BaseText numberOfLines={1} style={{ marginLeft: 10 }}>
                  {this.state.title}
                </BaseText>
              </View>
            </View>
          </View>

          <WebView
            source={{
              uri: data
            }}
            onLoadStart={this.onLoad}
            onLoadEnd={this.onEnd}
            onError={this.onEnd}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  wraperHeader: {
    width,
    height: 50,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  indicatorStyle: {
    width,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    position: 'absolute'
  },
  buttonClose: {
    top: 2,
    zIndex: 10,
    left: -5
  },
  header: {
    alignSelf: 'center',
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10
  },
  headerPan: {
    width,
    height: 30,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentPan: {
    width: '30%',
    height: 5,
    borderRadius: 5,
    backgroundColor: '#FFFFFF'
  }
});
