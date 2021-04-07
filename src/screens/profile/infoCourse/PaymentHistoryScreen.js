import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import Header from 'common/components/base/Header';
import LoadingModal from 'common/components/base/LoadingModal';
import Fetch from 'common/helpers/Fetch';
import NavigationService from 'common/services/NavigationService';
import React, { PureComponent } from 'react';
import { Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Octicons from 'react-native-vector-icons/Octicons';
import ScreenNames from 'consts/ScreenName';
import Const from 'consts/Const';
import Dimension from 'common/helpers/Dimension';

const width = Dimension.widthParent;
export default class PaymentHistoryScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      listPay: [],
      activeSections: []
    };
  }
  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    LoadingModal.show();
    var res = await Fetch.get(Const.API.PROFILE.GET_LIST_PAYMENT, { page: this.state.page }, true);
    LoadingModal.hide();
    if (res.status === Fetch.Status.SUCCESS) {
      var listPay = res.data.invoices;
      listPay = listPay.map(item => {
        try {
          let infoContact = item.info_contact;
          infoContact = JSON.parse(infoContact);
          item.info_contact = infoContact;
        } catch (err) {
          item.info_contact = {};
        }
        return item;
      });

      this.setState({ listPay });
    }
  };

  loadMoreData = async () => {
    if (!this.onMomentumScrollBegin) {
      var res = await Fetch.get(Const.API.PROFILE.GET_LIST_PAYMENT, { page: this.state.page + 1 }, true);
      if (res.status === Fetch.Status.SUCCESS && res.data.invoices.length !== 0) {
        var listPay = res.data.invoices;
        listPay = listPay.map(item => {
          try {
            let infoContact = item.info_contact;
            infoContact = JSON.parse(infoContact);
            item.info_contact = infoContact;
          } catch (err) {
            item.info_contact = {};
          }
          return item;
        });

        this.setState({
          listPay: this.state.listPay.concat(listPay),
          page: this.state.page + 1
        });
      }
      this.onMomentumScrollBegin = true;
    }
  };

  onPressGoDetail = item => () => {
    NavigationService.navigate(ScreenNames.DetailPayment, { idPayment: item.id });
  };

  renderHeader = section => {
    const isPay = section.item.payment_status == 'unpaid';
    return (
      <TouchableOpacity style={styles.containerHeader} onPress={this.onPressGoDetail(section.item)}>
        <View style={styles.viewHeader}>
          <BaseText style={styles.textTitleTest}>
            {Lang.profile.text_code}
            {': '}
          </BaseText>
          <BaseText style={styles.textTitleTest}>{section.item.id}</BaseText>
          <Octicons style={styles.iconDot} name={'primitive-dot'} color={Resource.colors.black1} size={10} />
          <BaseText style={styles.textTitleTest}>{Lang.profile.text_course}</BaseText>
          <BaseText style={styles.textTitleTestCourse} numberOfLines={1}>
            {section.item.product_name}
          </BaseText>
        </View>
        <View style={styles.viewHeaders}>
          <BaseText style={styles.textStatus} numberOfLines={2}>
            {Lang.profile.text_status}
          </BaseText>
          <BaseText
            style={{
              ...styles.textStatus,
              color: section.item && isPay ? Resource.colors.red700 : Resource.colors.greenColorApp
            }}
            numberOfLines={2}>
            {section.item && isPay ? Lang.profile.text_unpaid : Lang.profile.text_paid}
          </BaseText>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { listPay } = this.state;
    const showListPay = listPay && listPay.length > 0;
    return (
      <Container>
        <Header
          left
          onBackPress={() => NavigationService.pop()}
          text={Lang.profile.text_payment_history}
          headerStyle={styles.headerStyle}
          titleStyle={styles.titleStyle}
          colorBackButton={Resource.colors.black1}
          titleArea={{ alignItems: null }}
        />
        {showListPay ? (
          <FlatList
            data={listPay}
            renderItem={this.renderHeader}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 10 }}
            onMomentumScrollBegin={() => (this.onMomentumScrollBegin = false)}
            onEndReached={this.loadMoreData}
            onEndReachedThreshold={0.5}
          />
        ) : this.LoadingModal ? (
          <View style={styles.content}>
            <FastImage
              source={Resource.images.noBuyCoursegif}
              style={styles.logoStyle}
              resizeMode={FastImage.resizeMode.contain}
            />
            <BaseText style={styles.textNoBuyCourse}>{Lang.profile.text_no_payment}</BaseText>
            <BaseText style={styles.textReferCourse}>{Lang.profile.text_refer_course}</BaseText>
          </View>
        ) : null}
        <LoadingModal ref={refs => (this.LoadingModal = refs)} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: Resource.colors.white100
  },
  titleStyle: {
    color: Resource.colors.black1,
    fontStyle: 'italic'
  },
  container: {
    paddingBottom: 20,
    backgroundColor: Resource.colors.white100
  },
  containerHeader: {
    height: 60 * Dimension.scale,
    justifyContent: 'center',
    backgroundColor: Resource.colors.white100,
    shadowColor: Resource.colors.grey600,
    shadowOffset: { width: 0, height: 1 },
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: '#ddd',
    width: width - 40,
    alignSelf: 'center',
    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 5,
    shadowRadius: Platform.OS === 'ios' ? 5 : 4,
    elevation: Platform.OS === 'ios' ? 1.2 : 5
  },
  sectionContainerStyle: {
    backgroundColor: Resource.colors.white100,
    shadowColor: Resource.colors.grey600,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderRadius: 5,
    marginTop: 20,
    elevation: 1.2
  },
  viewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    width: width - 40,
    paddingHorizontal: 20
  },
  viewHeaders: {
    marginTop: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  textTitleTest: {
    fontSize: 13 * Dimension.scale,
    fontWeight: '500'
  },
  textTitleTestCourse: {
    flex: 1,
    marginLeft: 5,
    fontSize: 12 * Dimension.scale,
    fontWeight: '600'
  },
  textStatus: {
    fontSize: 11 * Dimension.scale,
    color: Resource.colors.black1
  },
  iconDot: {
    paddingHorizontal: 10
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30
  },
  logoStyle: {
    width: 220 * Dimension.scale,
    height: 220 * Dimension.scale
  },
  textNoBuyCourse: {
    fontSize: 14 * Dimension.scale,
    fontWeight: '600',
    fontStyle: 'italic',
    marginBottom: 10,
    color: Resource.colors.red700
  },
  textReferCourse: {
    fontSize: 14 * Dimension.scale,
    lineHeight: 20,
    textAlign: 'center',
    color: Resource.colors.black1
  }
});
