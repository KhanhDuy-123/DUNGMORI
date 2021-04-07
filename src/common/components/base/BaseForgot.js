import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseButtonOpacity from 'common/components/base/BaseButtonOpacity';
import BaseInput from 'common/components/base/BaseInput';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import Header from 'common/components/base/Header';
import Dimension from 'common/helpers/Dimension';
import NavigationService from 'common/services/NavigationService';
import React, { PureComponent } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SvgXml } from 'react-native-svg';

const width = Dimension.widthParent;

export class BaseForgot extends PureComponent {
  static defaultProps = {
    titleHeader: `${Lang.forgotPassword.hint_text_header}`
  };
  onPressBack = () => {
    NavigationService.pop();
  };

  render() {
    const { type, newPassword } = this.props;
    return (
      <Container style={{ backgroundColor: Resource.colors.white100 }} barStyle="dark-content">
        <Header
          left
          onBackPress={this.onPressBack}
          text={this.props.titleHeader}
          headerStyle={styles.headerStyle}
          titleArea={styles.titleArea}
          colorBackButton={Resource.colors.black1}
          titleStyle={styles.titleStyle}
        />
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.wrapper}>
            <View style={styles.boxImage}>
              <View style={styles.viewGif}>
                <FastImage source={this.props.source2} style={styles.logoStyle} resizeMode={FastImage.resizeMode.contain} />
              </View>
            </View>

            <BaseText style={{ ...styles.contentStyle, ...this.props.contentStyle }}>{this.props.textContent1}</BaseText>

            <View style={styles.viewImage}>
              <FastImage source={this.props.source} style={[styles.imageInput, this.props.imageInput]} resizeMode={FastImage.resizeMode.contain} />
              <View style={{ position: 'absolute' }}>
                <View style={{ paddingHorizontal: 5 }}>
                  <BaseInput
                    ref={(ref) => (this.inputRef1 = ref)}
                    viewInputStyle={[styles.viewInputStyle, this.props.viewInputStyle]}
                    textInputStyle={[styles.textInputStyle, this.props.textInputStyle]}
                    keyboardType={this.props.keyboardType}
                    secureTextEntry={this.props.secureTextEntry}
                    placeholder={this.props.placeholder}
                  />
                </View>
                {this.props.confirm ? (
                  <View style={styles.viewEnterCode}>
                    <BaseInput
                      ref={(ref) => (this.inputRef2 = ref)}
                      viewInputStyle={[styles.viewInputStyle, this.props.viewInputStyle]}
                      textInputStyle={[styles.textInputStyle, this.props.textInputStyle]}
                      maxLength={this.props.maxLength}
                      secureTextEntry={this.props.secureTextEntry}
                      placeholder={this.props.placeholder1}
                    />
                    {newPassword ? null : (
                      <View style={styles.enterCode}>
                        {this.props.captcha ? <SvgXml height="100%" width="100%" viewBox="18 0 100 55" xml={this.props.captcha} /> : null}
                      </View>
                    )}
                  </View>
                ) : null}
                {this.props.old ? (
                  <BaseInput
                    ref={(ref) => (this.inputRef3 = ref)}
                    viewInputStyle={[styles.viewInputStyle, this.props.viewInputStyle1]}
                    textInputStyle={styles.textInputStyle}
                    secureTextEntry={this.props.secureTextEntry}
                    placeholder={this.props.placeholder2}
                  />
                ) : null}
              </View>
            </View>

            {type !== 'confirmEmail' &&
              (this.props.numberCount === 0 ? (
                <TouchableOpacity onPress={this.props.onPressReSendCode}>
                  <BaseText style={styles.resendCode}>{Lang.forgotPassword.text_button_resend}</BaseText>
                </TouchableOpacity>
              ) : this.props.count ? (
                <BaseText style={styles.textCount}>{this.props.count}</BaseText>
              ) : null)}

            <BaseButtonOpacity
              text={this.props.textButton}
              socialButtonStyle={{ ...styles.socialButtonStyle, ...this.props.socialButtonStyle }}
              textStyle={styles.textStyle}
              onPress={this.props.onPress}
            />
          </View>
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Resource.colors.white100,
    paddingTop: 10,
    paddingBottom: 20
  },
  headerStyle: {
    backgroundColor: Resource.colors.white100,
    paddingHorizontal: 5 * Dimension.scale
  },
  titleStyle: {
    color: Resource.colors.black1,
    fontStyle: 'italic'
  },
  titleArea: {
    alignItems: null
  },
  wrapper: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center'
  },
  boxImage: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewGif: {
    width: 200 * Dimension.scale,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoStyle: {
    width: width / (2 * Dimension.scale),
    height: width / (2 * Dimension.scale)
  },
  imageContent: {
    width: 100 * Dimension.scale,
    height: 70 * Dimension.scale,
    padding: 10 * Dimension.scale,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -10 * Dimension.scale,
    right: -20 * Dimension.scale
  },
  viewImage: {
    width: width * Dimension.scale,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageInput: {
    width: 320 * Dimension.scale,
    height: 150 * Dimension.scale
  },
  hintUserStyle: {
    fontWeight: '700',
    fontStyle: 'italic',
    textAlign: 'center',
    fontSize: 11 * Dimension.scale,
    position: 'absolute',
    paddingLeft: 7
  },
  contentStyle: {
    width: 320 * Dimension.scale,
    paddingHorizontal: 70 * Dimension.scale,
    textAlign: 'center',
    color: Resource.colors.black2,
    fontSize: 12 * Dimension.scale
  },
  viewInputStyle: {
    backgroundColor: Resource.colors.white100,
    borderBottomWidth: 0.5,
    width: 250 * Dimension.scale,
    height: 55 * Dimension.scale,
    borderRadius: 0,
    borderBottomColor: Resource.colors.inactiveButton
  },
  textInputStyle: {
    paddingLeft: 0,
    paddingTop: 30,
    paddingVertical: 5,
    color: Resource.colors.black2
  },
  socialButtonStyle: {
    backgroundColor: Resource.colors.greenColorApp,
    width: 100 * Dimension.scale,
    height: 35 * Dimension.scale,
    marginTop: 25 * Dimension.scale,
    marginBottom: 25 * Dimension.scale,
    paddingHorizontal: 15,
    borderRadius: 20 * Dimension.scale
  },
  textCount: {
    color: Resource.colors.black1,
    paddingVertical: 10
  },
  textStyle: {
    color: Resource.colors.white100,
    fontWeight: '600',
    fontSize: 13 * Dimension.scale
  },
  resendCode: {
    fontSize: 16,
    textDecorationLine: 'underline',
    paddingVertical: 5,
    fontWeight: 'bold',
    color: Resource.colors.colorButton
  },
  viewEnterCode: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5
  },
  enterCode: {
    flex: 1
  }
});
export default BaseForgot;
