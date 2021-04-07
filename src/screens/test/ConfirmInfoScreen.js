import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import Header from 'common/components/base/Header';
import Dimension from 'common/helpers/Dimension';
import NavigationService from 'common/services/NavigationService';
import ScreenNames from 'consts/ScreenName';
import React, { Component } from 'react';
import { Animated, BackHandler, StyleSheet, TouchableOpacity, View } from 'react-native';
import SubmitSuccess from './components/SubmitSuccess';

export default class ConfirmInfoScreen extends Component {
  constructor(props) {
    super(props);
    let params = NavigationService.getParams('params');
    this.state = {
      success: false,
      data: params
    };
    this.animSpring = new Animated.Value(0);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onHardPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onHardPress);
  }

  onHardPress = () => {
    return true;
  };

  onPressContinue = async () => {};

  onPressGoHomePage = () => {
    NavigationService.reset(ScreenNames.HomeScreen);
  };

  onBackPress = () => {
    NavigationService.pop();
  };

  renderConfirm = () => {
    const { data } = this.state;
    return (
      <Container>
        <Header left text={Lang.try_do_test.confirm_info} titleStyle={styles.titleStyle} onBackPress={this.onBackPress} />
        <View style={styles.wrapperContent}>
          <View style={styles.label}>
            <BaseText style={styles.text}>{`${Lang.try_do_test.name}:`}</BaseText>
          </View>
          <View style={styles.content}>
            <BaseText style={styles.textContent}>{data.fullname}</BaseText>
          </View>
        </View>
        <View style={styles.wrapperContent}>
          <View style={styles.label}>
            <BaseText style={styles.text}>{`${Lang.try_do_test.date}:`}</BaseText>
          </View>
          <View style={styles.content}>
            <BaseText style={styles.textContent}>{data.dob}</BaseText>
          </View>
        </View>
        <View style={styles.wrapperContent}>
          <View style={styles.label}>
            <BaseText style={styles.text}>{`${Lang.try_do_test.phone}:`}</BaseText>
          </View>
          <View style={styles.content}>
            <BaseText style={styles.textContent}>{data.mobile}</BaseText>
          </View>
        </View>
        <View style={styles.wrapperContent}>
          <View style={styles.label}>
            <BaseText style={styles.text}>{`${Lang.try_do_test.places}:`}</BaseText>
          </View>
          <View style={styles.content}>
            <BaseText style={styles.textContent}>{data.address}</BaseText>
          </View>
        </View>
        <View style={styles.wrapperContent}>
          <View style={styles.label}>
            <BaseText style={styles.text}>{`${Lang.try_do_test.note}:`}</BaseText>
          </View>
          <View style={styles.content}>
            <BaseText style={styles.textContent}>{data.note}</BaseText>
          </View>
        </View>
        <View style={styles.areaButton}>
          <TouchableOpacity style={styles.button} onPress={this.onPressContinue}>
            <BaseText style={{ color: 'white' }}>{`${Lang.try_do_test.continue}`}</BaseText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: 'white', borderWidth: 0.5, marginTop: 10 }]} onPress={this.onBackPress}>
            <BaseText>{`${Lang.try_do_test.back}`}</BaseText>
          </TouchableOpacity>
        </View>
      </Container>
    );
  };

  renderSuccess = () => {
    return <SubmitSuccess params={this.state.certificateInfo} {...this.props} />;
  };

  render() {
    const { success } = this.state;
    if (!success) {
      return this.renderConfirm();
    } else {
      return this.renderSuccess();
    }
  }
}

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 18
  },
  wrapperContent: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    width: Dimension.widthParent,
    justifyContent: 'space-between',
    marginTop: 20
  },
  label: {
    width: 100
  },
  content: {
    width: '65%',
    alignItems: 'flex-end'
  },
  text: {
    fontSize: 15,
    color: '#616A71'
  },
  textContent: {
    fontSize: 15,
    textAlign: 'right'
  },
  areaButton: {
    height: 100,
    width: Dimension.widthParent,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 1,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    width: '80%',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Resource.colors.greenColorApp,
    borderRadius: 5
  },
  wrapperItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100
  },
  wrapperText: {
    width: 290,
    marginTop: 20,
    alignItems: 'center'
  }
});
