import Container from 'common/components/base/Container';
import Header from 'common/components/base/Header';
import Const from 'consts/Const';
import UrlConst from 'consts/UrlConst';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NavigationService from 'common/services/NavigationService';
import Fetch from 'common/helpers/Fetch';
import BaseText from 'common/components/base/BaseText';

export default class ShowAnswersScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    let response = await Fetch.get(UrlConst.API_JP_TEST + Const.API.TRY_DO_TEST.GET_EXAM_INFO, null, null, null, true);
  };

  onBackPress = () => {
    NavigationService.pop();
  };

  render() {
    return (
      <Container>
        <Header left text="Từ vựng - Chữ Hán" onBackPress={this.onBackPress} titleArea={styles.headerTitle} />
        <View style={styles.container}>
          <BaseText> ShowAnswersScreen </BaseText>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerTitle: {
    marginLeft: 25
  }
});
