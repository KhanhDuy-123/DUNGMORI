import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import Header from 'common/components/base/Header';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import NavigationService from 'common/services/NavigationService';
import Time from 'common/helpers/Time';
import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import BankTransferVn from 'screens/course/myCourse/containers/BankTransferVn';
import PaymentOffice from 'screens/course/myCourse/containers/PaymentOffice';
import Const from 'consts/Const';
import ItemPaymentHistory from './containers/ItemPaymentHistory';
const width = Dimension.widthParent;

export default class DetailPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const idPayment = this.props.navigation.getParam('idPayment');
    let response = await Fetch.get(Const.API.PROFILE.GET_INFOR_PAYMENT, { id: idPayment }, true);
    if (response.status == Fetch.Status.SUCCESS) {
      let data = response.data;
      try {
        const infor_contact = JSON.parse(data.info_contact);
        data.info_contact = infor_contact;
      } catch (error) {
        item.info_contact = {};
      }
      this.setState({ data: data });
    }
  };

  renderContent() {
    const { data } = this.state;
    if (data.payment_method_id === 3) {
      return (
        <View>
          <BaseText style={styles.textStyle}>{Lang.profile.text_payment_content1}</BaseText>
          <PaymentOffice
            showContent
            containerStyle={styles.containerStyle}
            textTitle={styles.textStyle}
            textInfo={styles.textStyle}
            textAdress={styles.textStyle}
          />
          <BaseText style={styles.textStyle}>{Lang.profile.text_payment_content2}</BaseText>
        </View>
      );
    } else if (data.payment_method_id === 2) {
      return <BankTransferVn showContent containerStyle={styles.containerStyle} />;
    } else if (data.payment_method_id === 5) {
      const arrInfoBank = [
        {
          title: Lang.buyCourse.text_bank_jp,
          content: Lang.buyCourse.text_name_bank_jp
        },
        {
          title: Lang.buyCourse.text_account_holder_jp,
          content: Lang.buyCourse.text_name_account_jp
        },
        {
          title: Lang.buyCourse.text_account_balance_jp,
          content: Lang.buyCourse.text_account_number_jp
        },
        {
          title: Lang.buyCourse.text_account_branch_jp,
          content: Lang.buyCourse.text_account_branch
        }
      ];
      return (
        <View>
          {arrInfoBank.map((item, index) => {
            return (
              <View key={index} style={styles.viewTitleItem}>
                <BaseText style={styles.textSumary}>
                  {item.title}
                  {':'}
                </BaseText>
                <BaseText style={{ ...styles.textTitle, marginLeft: 7, fontWeight: index == 2 ? '600' : null }}>{item.content}</BaseText>
              </View>
            );
          })}
          <BaseText style={styles.textStyle}>{Lang.profile.text_payment_content4}</BaseText>
        </View>
      );
    } else if (data.payment_method_id === 4) {
      return (
        <View>
          <BaseText style={styles.textStyle}>{Lang.profile.text_payment_content5}</BaseText>
          <BaseText style={{ ...styles.textStyle, paddingVertical: 15 }}>{Lang.profile.text_payment_content6}</BaseText>
        </View>
      );
    }
  }

  render() {
    const { data } = this.state;
    let dayFormat = Time.format(data.created_at, 'DD-MM-YYYY');
    let isPay = data.payment_status == 'unpaid';
    return (
      <Container>
        <Header
          left
          onBackPress={() => NavigationService.pop()}
          text={Lang.profile.text_detail_payment_header}
          headerStyle={styles.headerStyle}
          titleStyle={styles.titleStyle}
          colorBackButton="black"
          titleArea={{ alignItems: null }}
        />
        <ScrollView>
          <View style={styles.conatainer}>
            <View style={styles.viewHeader}>
              <View style={{ flexDirection: 'row' }}>
                <BaseText style={styles.textTitleTest} numberOfLines={2}>
                  {Lang.profile.text_code}
                  {': '}
                </BaseText>
                <BaseText style={styles.textTitleTest} numberOfLines={2}>
                  {data.id}
                </BaseText>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <BaseText style={styles.textTitleTest} numberOfLines={2}>
                  {Lang.profile.text_course}
                  {': '}
                </BaseText>
                <BaseText style={styles.textTitleTest} numberOfLines={2}>
                  {data.product_name}
                </BaseText>
              </View>
            </View>
            <View style={styles.viewHeaders}>
              <BaseText style={styles.textStatus} numberOfLines={2}>
                {Lang.profile.text_status}
              </BaseText>
              <Text
                style={{
                  ...styles.textStatus,
                  color: data.payment_status && isPay ? Resource.colors.red700 : Resource.colors.greenColorApp
                }}>
                {data.payment_status && isPay ? Lang.profile.text_unpaid : Lang.profile.text_paid}
              </Text>
            </View>
            <ItemPaymentHistory title={Lang.profile.text_date_created} content={dayFormat} />
            <ItemPaymentHistory title={Lang.profile.text_full_name} content={data.info_contact ? data.info_contact.name : null} />
            <ItemPaymentHistory title={Lang.profile.text_number_phone} content={data.info_contact ? data.info_contact.phone : null} />
            <ItemPaymentHistory title={Lang.profile.text_email} content={data.info_contact ? data.info_contact.email : null} />
            <ItemPaymentHistory title={Lang.profile.text_adress} content={data.info_contact ? data.info_contact.address : null} />
            <ItemPaymentHistory title={Lang.profile.text_code_orders} content={data.uuid} />
            <ItemPaymentHistory
              title={Lang.profile.text_total_money}
              content={Funcs.convertPrice(parseInt(data.price))}
              contentCopper={Lang.profile.text_copper}
              styleTextColor={{ color: Resource.colors.red700 }}
            />
            <ItemPaymentHistory title={Lang.profile.text_payments + ':'} content={data.payment_method_name} />
            {this.renderContent()}
          </View>
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  conatainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 20
  },
  headerStyle: {
    backgroundColor: 'white',
    paddingHorizontal: 7 * Dimension.scale
  },
  titleStyle: {
    color: 'black',
    fontStyle: 'italic'
  },
  viewHeader: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    width: width - 40
  },
  viewHeaders: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  textTitleTest: {
    fontSize: 14 * Dimension.scale,
    fontWeight: '500'
  },
  textTitleTests: {
    flex: 1,
    fontSize: 14 * Dimension.scale,
    fontWeight: '500'
  },
  textTitleCourse: {
    flex: 1,
    marginLeft: 5,
    fontSize: 13 * Dimension.scale,
    fontWeight: '600'
  },
  textStatus: {
    fontSize: 11 * Dimension.scale,
    color: Resource.colors.black1,
    fontWeight: '500'
  },
  iconDot: {
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  textPayMethod: {
    fontSize: 11 * Dimension.scale,
    color: Resource.colors.black1,
    marginHorizontal: 20
  },
  containerStyle: {
    paddingHorizontal: 0,
    paddingBottom: 0
  },
  textStyle: {
    fontSize: 15,
    lineHeight: 20
  },
  viewTitleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3
  },
  viewTitle: {
    flexDirection: 'row',
    paddingVertical: 10
  },
  textSumary: {
    fontSize: 13,
    lineHeight: 25,
    fontWeight: '600',
    color: Resource.colors.black1
  }
});
