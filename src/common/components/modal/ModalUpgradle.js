import Colors from 'assets/Colors';
import Lang from 'assets/Lang';
import BaseButton from 'common/components/base/BaseButton';
import BaseText from 'common/components/base/BaseText';
import AppConst from 'consts/AppConst';
import React, { PureComponent } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';

const width = Dimension.widthParent > 350 ? 350 : Dimension.widthParen - 20;
const height = Dimension.heightParent > 350 ? 350 : Dimension.heightParent - 20;

class ModalUpgradle extends PureComponent {
  state = {
    isVisible: true
  };

  onPressUpgrade = () => {
    const url = Platform.select({
      ios: 'itms-apps://itunes.apple.com/us/app/id1486123836?time=' + Date.now(),
      android: 'https://play.google.com/store/apps/details?id=com.dungmori.dungmoriapp&time=' + Date.now()
    });
    Funcs.openStore(url);
    if (this.forceUpdate) return;
    this.setState({
      isVisible: false
    });
  };

  onPressLater = () => {
    this.setState({
      isVisible: false
    });
  };

  render() {
    const { setting } = this.props;
    const { isVisible } = this.state;
    const settingVersion = setting && setting[`${Platform.OS}_version`];
    let visible = setting && setting[`${Platform.OS}_active`] == 1 && settingVersion != AppConst.VERSION;
    try {
      if (visible && parseInt(settingVersion.replace('.', '')) < parseInt(AppConst.VERSION.replace('.', ''))) visible = false;
    } catch (err) {
      console.log('ERROR', err);
    }
    if (!visible) return null;
    const changeLogs = setting[`${Platform.OS}_change_log`];
    this.forceUpdate = setting[`${Platform.OS}_force_update`] == 1;
    return (
      <Modal transparent={true} animationType={'slide'} style={{ position: 'absolute' }} visible={visible && isVisible}>
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <BaseText style={styles.textTitle}>{Lang.upgrade.has_new_version}</BaseText>
            <BaseText style={styles.textTitleChange}>{Lang.upgrade.changelog + ' ' + settingVersion}</BaseText>
            <View style={styles.containerNewFeature}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {changeLogs.map((item, index) => (
                  <BaseText key={index.toString()}>{`- ${item}`}</BaseText>
                ))}
              </ScrollView>
            </View>
            <View style={styles.containerButton}>
              <BaseButton style={styles.button} onPress={this.onPressUpgrade}>
                <BaseText>{Lang.upgrade.upgrade_now}</BaseText>
              </BaseButton>
              {!this.forceUpdate && (
                <BaseButton style={styles.button} onPress={this.onPressLater}>
                  <BaseText>{Lang.upgrade.later}</BaseText>
                </BaseButton>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const mapStateToProp = (state) => ({
  setting: state.homeReducer.setting
});

export default connect(mapStateToProp)(ModalUpgradle);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentContainer: {
    backgroundColor: 'white',
    width,
    height,
    borderRadius: 10
  },
  containerNewFeature: {
    flex: 1,
    borderColor: Colors.gray,
    borderWidth: 0.7,
    marginTop: 0,
    margin: 10,
    padding: 10,
    borderRadius: 10
  },
  textTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20
  },
  textTitleChange: {
    marginLeft: 10,
    marginBottom: 5
  },
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 10,
    paddingHorizontal: 10
  },
  button: {
    borderWidth: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    borderColor: Colors.gray,
    minWidth: 100
  }
});
