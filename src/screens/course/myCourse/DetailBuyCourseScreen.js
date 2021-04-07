import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import Header from 'common/components/base/Header';
import KeyboardHandle from 'common/components/base/KeyboardHandle';
import Dimension from 'common/helpers/Dimension';
import NavigationService from 'common/services/NavigationService';
import React, { PureComponent } from 'react';
import { Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { connect } from 'react-redux';
import Configs from 'utils/Configs';
import Utils from 'utils/Utils';
import InforOrder from './containers/InforOrder';
import Payments from './containers/Payments';

class InputView extends PureComponent {
  render() {
    return (
      <View style={styles.viewInput}>
        <View style={styles.viewTitle}>
          <BaseText style={styles.textInput}>{this.props.title}</BaseText>
        </View>
        <TextInput
          style={styles.viewInputStyle}
          editable={this.props.disibleInput}
          placeholder={this.props.placeholder}
          placeholderTextColor={Resource.colors.red700}
          value={this.props.value}
          maxLength={this.props.maxLength}
          onChangeText={this.props.onChangeText}
          keyboardType={this.props.keyboardType}
          allowFontScaling={false}
        />
      </View>
    );
  }
}
class DetailBuyCourseScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      nameUser: this.props.user && this.props.user.name ? this.props.user.name : '',
      email: this.props.user && this.props.user.email ? this.props.user.email : '',
      numberPhone: this.props.user && this.props.user.phone ? this.props.user.phone : ''
    };
  }

  componentWillUnmount() {
    clearTimeout(this.timeScrollHeader);
  }

  onChangeUserName = (nameUser) => {
    this.setState({
      nameUser
    });
  };

  onChangeNumberPhone = (numberPhone) => {
    this.setState({
      numberPhone
    });
  };

  onChangeEmail = (email) => {
    this.setState({
      email
    });
  };

  onScrollTopHeader = () => {
    this.timeScrollHeader = setTimeout(() => {
      this.flatListRef.scrollTo(0);
    }, 50);
  };

  renderInfoCustomer = () => {
    // Ẩn yêu cầu thông tin khi chờ App duyệt app
    let isLocalSensitive = Utils.location.toLowerCase() !== 'vn' && Utils.location.toLowerCase() !== 'jp';
    if (isLocalSensitive || !Configs.enabledFeature.purchase) return null;
    const { nameUser, email, numberPhone } = this.state;
    const { user } = this.props;
    return (
      <View style={styles.infoCustomer}>
        <BaseText style={styles.title}>{Lang.buyCourse.text_title_customer_infor}</BaseText>
        <InputView
          title={Lang.buyCourse.text_full_name}
          placeholder={Lang.buyCourse.text_placeholder_full_name}
          value={nameUser}
          maxLength={25}
          onChangeText={this.onChangeUserName}
        />
        <InputView
          title={Lang.buyCourse.text_number_phone}
          placeholder={Lang.buyCourse.text_placeholder_number_phone}
          value={numberPhone}
          maxLength={11}
          onChangeText={this.onChangeNumberPhone}
          keyboardType="number-pad"
        />
        <InputView
          title={Lang.buyCourse.text_email}
          placeholder={Lang.buyCourse.text_placeholder_email}
          disibleInput={user.email && user.email.length > 0 ? false : true}
          value={email}
          onChangeText={this.onChangeEmail}
        />
      </View>
    );
  };

  render() {
    const { buyCourse, type } = this.props.navigation.state.params;
    const { nameUser, email, numberPhone } = this.state;
    let disablePurchaseButton = nameUser == '' || email == '' || numberPhone == '';

    // Nếu ko bật purchase thì mặc định sẽ hiển thị nút này
    if (Platform.OS === 'ios' && !Configs.enabledFeature.purchase) disablePurchaseButton = false;
    return (
      <KeyboardHandle>
        <Container style={styles.styleContainer}>
          <Header
            left
            onBackPress={() => NavigationService.pop()}
            text={Lang.saleLesson.text_buy_course}
            headerStyle={styles.headerStyle}
            titleStyle={styles.titleStyle}
            titleArea={styles.areaHeaderText}
            colorBackButton={Resource.colors.black1}
            onScrollTopHeader={this.onScrollTopHeader}
          />
          <ScrollView ref={(ref) => (this.flatListRef = ref)} contentContainerStyle={styles.container}>
            <View style={{ flex: 1 }}>
              <InforOrder buyCourse={buyCourse} />
              {this.renderInfoCustomer()}
              <View style={styles.payments}>
                <Payments
                  disablePurchaseButton={disablePurchaseButton}
                  user={this.props.user}
                  buyCourse={buyCourse}
                  type={type}
                  name={nameUser}
                  email={email.toLowerCase()}
                  phone={numberPhone}
                />
              </View>
            </View>
          </ScrollView>
        </Container>
      </KeyboardHandle>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.userReducer.user
});
export default connect(
  mapStateToProps,
  null
)(DetailBuyCourseScreen);

const styles = StyleSheet.create({
  styleContainer: {
    backgroundColor: Resource.colors.white100
  },
  headerStyle: {
    backgroundColor: Resource.colors.white100,
    paddingHorizontal: 5 * Dimension.scale,
    paddingVertical: 5 * Dimension.scale
  },
  titleStyle: {
    color: Resource.colors.black1,
    fontStyle: 'italic',
    fontWeight: '600',
    fontSize: 20 * Dimension.scale
  },
  areaHeaderText: {
    alignItems: 'flex-start'
  },
  container: {
    backgroundColor: Resource.colors.grey100
  },
  infoCustomer: {
    marginTop: 10,
    backgroundColor: Resource.colors.white100,
    paddingVertical: 20,
    paddingHorizontal: 20
  },
  viewTitle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 14 * Dimension.scale,
    color: Resource.colors.black1,
    fontWeight: '600'
  },
  textInput: {
    fontSize: 13 * Dimension.scale,
    color: Resource.colors.black1
  },
  viewInput: {
    height: 45,
    marginTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  viewInputStyle: {
    flex: 1,
    fontSize: 13 * Dimension.scale,
    color: Resource.colors.black1,
    textAlign: 'right',
    backgroundColor: Resource.colors.white100
  },
  iconText: {},
  payments: {
    marginTop: 10,
    backgroundColor: Resource.colors.white100
  }
});
