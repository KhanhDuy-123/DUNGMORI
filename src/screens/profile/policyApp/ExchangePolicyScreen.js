import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import Header from 'common/components/base/Header';
import LoadingModal from 'common/components/base/LoadingModal';
import Const from 'consts/Const';
import React, { PureComponent } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import HTML from 'react-native-render-html';
import NavigationService from 'common/services/NavigationService';
import Fetch from 'common/helpers/Fetch';

class ExchangePolicyScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      policy: {}
    };
  }

  async componentDidMount() {
    LoadingModal.show();
    let res = await Fetch.get(Const.API.PROFILE.GET_POLICY_APP, { filter: 'chinh-sach-doi-tra' });
    LoadingModal.hide();
    if (res.status == Fetch.Status.SUCCESS) {
      this.setState({ policy: res.data });
    }
  }

  onBackPress = () => {
    NavigationService.pop();
  };

  render() {
    const { policy } = this.state;
    return (
      <Container>
        <Header
          left={true}
          onBackPress={this.onBackPress}
          text={Lang.profile.text_exchange_policy}
          titleStyle={styles.titleStyle}
          titleArea={styles.areaHeaderText}
          headerStyle={styles.headerStyle}
        />
        <ScrollView>
          <View style={styles.container}>
            <BaseText style={styles.title}>{policy.title}</BaseText>
            <HTML html={policy.content} />
          </View>
        </ScrollView>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  titleStyle: {
    color: Resource.colors.black1,
    fontStyle: 'italic'
  },
  areaHeaderText: {
    alignItems: 'flex-start'
  },
  container: {
    flex: 1,
    paddingHorizontal: 10
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
export default ExchangePolicyScreen;
