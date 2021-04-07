import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import DropAlert from 'common/components/base/DropAlert';
import LoadingModal from 'common/components/base/LoadingModal';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import StorageService from 'common/services/StorageService';
import IapService from 'common/services/IapService';
import NavigationService from 'common/services/NavigationService';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React, { PureComponent } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import DetailListBanner from 'screens/course/lession/DetailListBanner';
import PaymentActionCreator from 'states/redux/actionCreators/PaymentActionCreator';
import { onUpdateUser } from 'states/redux/actions';
import Configs from 'utils/Configs';
import Utils from 'utils/Utils';
import BankTransferJp from './BankTransferJp';
import BankTransferVn from './BankTransferVn';
import ExpressDelivery from './ExpressDelivery';
import PaymentOffice from './PaymentOffice';
import Strings from 'common/helpers/Strings';

const width = Dimension.widthParent;

class Payments extends PureComponent {
  constructor(props) {
    super(props);
    let isLocalSensitive = Utils.location.toLowerCase() !== 'vn' && Utils.location.toLowerCase() !== 'jp';
    this.choosePayment = null;
    this.disableAllMethod = isLocalSensitive || !Configs.enabledFeature.purchase;
  }
  state = {
    purchaseMethodList: [],
    activeSections: [],
    multipleSelect: true
  };

  async componentDidMount() {
    if (this.disableAllMethod) return;
    LoadingModal.show();
    let res = await Fetch.get(Const.API.SETTING.GET_PAYMENT_METHOD, null, true);
    LoadingModal.hide();
    if (res.status === Fetch.Status.SUCCESS) {
      let purchaseMethodList = res.data;

      // Remove iap
      purchaseMethodList = purchaseMethodList.filter((item) => item.id != 6);

      // Remove paypal
      purchaseMethodList = purchaseMethodList.filter((item) => item.id != 1);
      this.setState({ purchaseMethodList });
    }
  }

  updateSections = (activeSections) => {
    const data = this.state.purchaseMethodList;
    data.find((e, index) => {
      if (activeSections == index) {
        this.choosePayment = e;
      }
      if (activeSections.length == 0) {
        this.choosePayment = null;
      }
    });
    this.setState({ activeSections });
  };

  inappPurchase = (buyCourse, contactInfo) => {
    const { email, name, phone } = this.props;
    const { productType, productId } = contactInfo;
    let invoiceInfo = {
      email,
      name,
      phone,
      productType,
      productId
    };
    let sku = 'com.dungmoriapp.course.' + buyCourse.name.toLowerCase() + '.sub';
    if (buyCourse.services && buyCourse.services.courses && buyCourse.services.courses.length > 1) {
      sku = 'com.dungmoriapp.combo.' + buyCourse.name.toLowerCase() + '.sub';
      sku = sku.split('+').join('');
      sku = sku.split(' ').join('');
    }
    sku = Strings.replaceAll(sku, ' ', '');
    sku = Strings.replaceAll(sku, '-', '');
    sku = Strings.replaceAscent(sku, ' ', '');
    LoadingModal.show();
    if (!Configs.enabledFeature.purchase) sku = sku + '.n';
    IapService.subscription(sku, async (isOk, data) => {
      if (!isOk) {
        LoadingModal.hide();
        DropAlert.error('', data);
        return;
      }

      // Verify
      try {
        LoadingModal.show();
        if (data.transactionId) {
          // Flow khi purchase xong -> verify -> nếu lỗi do mạng(lưu vào local storage) -> send lại khi vào lại app
          const params = {
            transactionId: data.transactionId,
            receipt: data.transactionReceipt,
            productId: data.productId,
            platform: Platform.OS,
            invoiceInfo: JSON.stringify(invoiceInfo)
          };
          StorageService.save('IAP_PURCHASE_DATA', params);
          PaymentActionCreator.createIapInvoice(params, this.onPaySuccees, this.onPayFailed);
        }
      } catch (err) {
        Funcs.log(err);
      }
    });
  };

  onPaySuccees = () => {
    DropAlert.success('', Lang.alert.text_alert_succes_buy_Course);
    StorageService.save('IAP_PURCHASE_DATA', '');
    NavigationService.replace(ScreenNames.HomeScreen);
  };

  onPayFailed = (message) => {
    DropAlert.success('', message);
  };

  onPressBack = () => {
    NavigationService.pop();
  };

  onPressRules = () => {
    const data = {
      id: 1,
      name: Lang.buyCourse.text_sprovision,
      link: 'https://dungmori.com/trang/dieu-khoan-su-dung'
    };
    this.DetailListBanner.showModal(data);
  };

  onPressSecurity = () => {
    const data = {
      id: 1,
      name: Lang.buyCourse.text_privacy_policy,
      link: 'https://dungmori.com/trang/chinh-sach-bao-mat'
    };
    this.DetailListBanner.showModal(data);
  };

  onPressBuyCourse = async () => {
    const { user, email } = this.props;
    if (user.email && user.email.length > 0) {
      this.onBuyCourse();
    } else {
      if (!Funcs.validateEmail(email)) {
        return;
      }
      let res = await Fetch.post(Const.API.USER.CHECK_ACCOUNT_EXIST, { email });
      if (res.status === Fetch.Status.SUCCESS) {
        DropAlert.warn('', Lang.buyCourse.text_email_already_exists);
      } else if (res.status === Fetch.Status.NOT_FOUND) {
        this.onBuyCourse();
      }
    }
  };

  onBuyCourse = async () => {
    const { buyCourse, user, email, phone, name } = this.props;
    let contactInfo = {};
    if (this.ExpressRef) {
      const { userName, numberPhone, address } = this.ExpressRef.state;
      if (this.choosePayment === null) {
        DropAlert.warn('', Lang.alert.text_alert_select);
        return;
      }
      if (this.choosePayment.id == 4) {
        if (userName == '') {
          DropAlert.warn('', Lang.alert.text_alert_input_userName);
          return;
        } else if (numberPhone == '') {
          DropAlert.warn('', Lang.alert.text_alert_input_numberPhone);
          return;
        } else if (address == '') {
          DropAlert.warn('', Lang.alert.text_alert_input_adress);
          return;
        }
      }

      contactInfo = {
        name: name ? name : userName && userName.length > 0 ? userName : '' || user.name,
        phone: phone ? phone : numberPhone && numberPhone.length > 0 ? numberPhone : '' || user.phone,
        address,
        email: email ? email : user.email
      };
    }
    let data = {
      productId: buyCourse.services && buyCourse.services.courses.length == 1 ? buyCourse.services.courses[0] : buyCourse.id,
      productType: buyCourse.services && buyCourse.services.courses.length > 1 ? 'combo' : 'course',
      contactInfo: JSON.stringify(contactInfo),
      paymentMethodId: this.choosePayment ? this.choosePayment.id : -1
    };

    // Inapp purchase
    if (this.disableAllMethod || this.choosePayment.id == 6) {
      this.inappPurchase(buyCourse, data);
      return;
    }

    // LoadingModal.show();
    let res = await Fetch.post(Const.API.INVOICE.CREATE_INVOICE, data, true);
    // LoadingModal.hide();
    if (res.status === Fetch.Status.SUCCESS) {
      this.props.onUpdateUser({ ...user, email });
      DropAlert.success('', Lang.alert.text_alert_succes_buy_Course);
      NavigationService.pop();
    } else {
      DropAlert.error('', res.data.message);
    }
  };

  renderHeader = (item, index, isActive) => {
    return (
      <View style={index === 0 ? styles.menuDropdowns : styles.menuDropdown}>
        <BaseText numberOfLine={2} style={styles.textHeader}>
          {item.name}
        </BaseText>
        <Ionicons
          style={styles.icon}
          name={isActive ? 'ios-radio-button-on' : 'ios-radio-button-off'}
          size={16 * Dimension.scale}
          color={Resource.colors.greenColorApp}
        />
      </View>
    );
  };

  renderContent = (item, index) => {
    if (item.id === 2) {
      return <BankTransferVn />;
    } else if (item.id === 3) {
      return <PaymentOffice />;
    } else if (item.id === 4) {
      return <ExpressDelivery user={this.props.user} ref={(ref) => (this.ExpressRef = ref)} />;
    } else if (item.id === 5) {
      return <BankTransferJp />;
    } else if (item.id === 6) {
      return <BaseText style={styles.textIapDetail}>{item.description}</BaseText>;
    }
  };

  renderPurchaseMethod = () => {
    const { purchaseMethodList, activeSections } = this.state;
    if (this.disableAllMethod) return null;
    return (
      <View>
        <BaseText style={styles.title}>{Lang.buyCourse.text_title_payments}</BaseText>
        <Accordion
          sections={purchaseMethodList}
          activeSections={activeSections}
          touchableComponent={TouchableOpacity}
          renderHeader={this.renderHeader}
          renderContent={this.renderContent}
          onChange={this.updateSections}
          underlayColor={Resource.colors.white100}
        />
        <View style={styles.provision}>
          <BaseText style={styles.titleProvision}>
            {Lang.buyCourse.text_intro_sprovision_1}{' '}
            <BaseText onPress={this.onPressRules} style={styles.titleClolor}>
              {Lang.buyCourse.text_sprovision}
            </BaseText>{' '}
            {Lang.buyCourse.text_and}{' '}
            <BaseText onPress={this.onPressSecurity} style={styles.titleClolor}>
              {Lang.buyCourse.text_privacy_policy}
            </BaseText>{' '}
            {Lang.buyCourse.text_intro_sprovision_2}
          </BaseText>
        </View>
      </View>
    );
  };

  render() {
    const { disablePurchaseButton } = this.props;
    return (
      <View style={styles.container}>
        {this.renderPurchaseMethod()}
        <View style={styles.viewButton}>
          <View style={styles.viewButtonBuy}>
            <TouchableOpacity onPress={this.onPressBack} style={styles.buttonBack}>
              <BaseText style={styles.titleButtonBack}>{Lang.buyCourse.text_button_back}</BaseText>
            </TouchableOpacity>
          </View>
          <View style={styles.viewButtonBuy}>
            <TouchableOpacity
              disabled={disablePurchaseButton ? true : null}
              onPress={this.onPressBuyCourse}
              style={disablePurchaseButton ? styles.buttonBuys : styles.buttonBuy}>
              {/* style={styles.buttonBuy}> */}
              <BaseText style={styles.titleButtonBuy}>{Lang.buyCourse.text_button_buycourse}</BaseText>
            </TouchableOpacity>
          </View>
        </View>
        <DetailListBanner ref={(refs) => (this.DetailListBanner = refs)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: Resource.colors.white100,
    paddingVertical: 20,
    flex: 1
  },
  menuDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopColor: Resource.colors.border,
    borderTopWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 20
  },
  menuDropdowns: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20
  },
  textHeader: {
    width: width - 100,
    fontSize: 13 * Dimension.scale,
    color: Resource.colors.black1
  },
  title: {
    fontSize: 14 * Dimension.scale,
    paddingLeft: 20,
    color: Resource.colors.black1,
    fontWeight: '600'
  },
  provision: {
    paddingVertical: 20,
    paddingHorizontal: 30
  },
  titleProvision: {
    fontSize: 11 * Dimension.scale,
    lineHeight: 20,
    textAlign: 'center',
    color: Resource.colors.black1
  },
  titleClolor: {
    fontSize: 11 * Dimension.scale,
    fontStyle: 'italic',
    fontWeight: '500',
    color: Resource.colors.red700
  },
  viewButton: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15
  },
  viewButtonBuy: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonBack: {
    width: 130 * Dimension.scale,
    height: 32 * Dimension.scale,
    borderRadius: 20 * Dimension.scale,
    justifyContent: 'center',
    marginHorizontal: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Resource.colors.black1
  },
  titleButtonBack: {
    fontSize: 13 * Dimension.scale,
    fontWeight: '600',
    color: Resource.colors.black1
  },
  buttonBuys: {
    width: 130 * Dimension.scale,
    height: 32 * Dimension.scale,
    borderRadius: 20 * Dimension.scale,
    marginHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Resource.colors.border
  },
  buttonBuy: {
    width: 130 * Dimension.scale,
    height: 32 * Dimension.scale,
    borderRadius: 20 * Dimension.scale,
    justifyContent: 'center',
    marginHorizontal: 15,
    alignItems: 'center',
    backgroundColor: Resource.colors.greenColorApp
  },
  titleButtonBuy: {
    fontSize: 13 * Dimension.scale,
    fontWeight: '600',
    color: Resource.colors.white100
  },
  textIapDetail: {
    flex: 1,
    fontSize: 13 * Dimension.scale,
    margin: 15
  }
});

const mapDispatchToProps = { onUpdateUser };
export default connect(
  null,
  mapDispatchToProps
)(Payments);
