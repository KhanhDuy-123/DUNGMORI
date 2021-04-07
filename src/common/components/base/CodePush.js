import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import Funcs from 'common/helpers/Funcs';
import React, { PureComponent } from 'react';
import { AppState, StyleSheet, Text, View } from 'react-native';
import RNCodePush from 'react-native-code-push';
import Spinner from 'react-native-spinkit';

const color = Resource.colors.primaryColor;
export default class CodePush extends PureComponent {
  state = {
    updating: false,
    downloadProgress: 0
  };

  componentDidMount() {
    this.check();
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    if (this.loadingTimeout) clearTimeout(this.loadingTimeout);
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      this.check();
    }
  };

  check = () => {
    if (__DEV__) return;
    try {
      RNCodePush.allowRestart();
      RNCodePush.sync(
        {
          updateDialog: false,
          installMode: RNCodePush.InstallMode.IMMEDIATE
        },
        (status) => {
          switch (status) {
            case RNCodePush.SyncStatus.DOWNLOADING_PACKAGE:
              this.setState({
                updating: true
              });

              // Timeout auto hide in 30s
              this.loadingTimeout = setTimeout(() => {
                this.setState({ updating: false });
              }, 30 * 1000);
              break;
            case RNCodePush.SyncStatus.INSTALLING_UPDATE:
              break;
            case RNCodePush.SyncStatus.UPDATE_INSTALLED:
              RNCodePush.restartApp();
              break;
            case RNCodePush.SyncStatus.UPDATE_IGNORED:
            case RNCodePush.SyncStatus.UNKNOWN_ERROR:
              this.setState({
                updating: false
              });
              if (this.loadingTimeout) clearTimeout(this.loadingTimeout);
              break;
            default:
              break;
          }
        },
        ({ receivedBytes, totalBytes }) => {
          var downloadProgress = parseInt((receivedBytes * 100) / totalBytes);
          this.setState({
            updating: true,
            downloadProgress
          });
        }
      );
    } catch (error) {
      Funcs.log('Codepush error', error);
    }
  };

  render() {
    var { downloadProgress, updating } = this.state;
    if (!updating) return null;
    return (
      <View style={styles.container}>
        <View style={styles.container1}>
          <Text style={styles.title}>{Lang.codePush.hint_text_upgrade}</Text>
          <Spinner isVisible={true} size={30} type={'Wave'} color={color} />
          <Text style={styles.text}>{downloadProgress + '%'}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container1: {
    maxWidth: 300,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    padding: 20
  },
  title: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: 22,
    fontWeight: '500',
    marginBottom: 20,
    color
  },
  text: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: 18,
    fontWeight: '500',
    color
  }
});
