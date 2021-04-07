import Lang from 'assets/Lang';
import Styles from 'assets/Styles';
import AppConst from 'consts/AppConst';
import Const from 'consts/Const';
import React, { PureComponent } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import PdfView from 'react-native-view-pdf';
import { WebView } from 'react-native-webview';
import Dimension from 'common/helpers/Dimension';
import BaseText from './BaseText';

const width = Dimension.widthParent;
const height = Dimension.heightParent;
export default class PDFViews extends PureComponent {
  constructor(props) {
    super(props);
    const { value } = this.props;

    this.state = {
      value: value,
      loading: true,
      enabled: AppConst.IS_IOS
    };
  }

  async componentDidMount() {
    if (AppConst.IS_ANDROID) {
      const apiLevel = await DeviceInfo.getApiLevel();
      this.setState({
        enabled: apiLevel >= 21
      });
    }
  }

  onLoadEnd = () => {
    this.setState({
      loading: false
    });
  };

  onError = (error) => {
    console.log(`ERROR`, error);
  };

  render() {
    const { value, loading, enabled } = this.state;
    let url = Const.RESOURCE_URL.DOCUMENT.PDF + encodeURI(value);
    if (!enabled) {
      return (
        <View style={[Styles.flex, Styles.center]}>
          <BaseText>{Lang.chooseLession.text_document_not_available_for_device}</BaseText>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.viewContainer}>
          {Platform.OS == 'ios' ? (
            <WebView
              bounces={false}
              source={{
                uri: url
              }}
              onLoadEnd={this.onLoadEnd}
            />
          ) : (
            <PdfView resource={url} resourceType="url" style={{ flex: 1, width, height }} onLoad={this.onLoadEnd} onError={this.onError} />
          )}
        </View>
        {loading ? (
          <View style={styles.viewLoading}>
            <ActivityIndicator style={styles.iconLoading} />
          </View>
        ) : null}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconLoading: {
    color: '#000'
  },
  viewLoading: {
    position: 'absolute'
  },
  viewContainer: {
    flex: 1,
    width,
    height
  },
  viewPDF: {
    flex: 1,
    width: width
  }
});
