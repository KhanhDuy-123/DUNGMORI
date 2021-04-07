import React, { PureComponent } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, TextInput, Platform } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import Resource from 'assets/Resource';
import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import Const from 'consts/Const';
import Dimension from 'common/helpers/Dimension';
const height = Dimension.heightParent;

export class ItemInput extends PureComponent {
  render() {
    return (
      <View style={styles.containers}>
        <View style={styles.viewInput}>
          <BaseText style={styles.textStyle}>{this.props.text}</BaseText>
          <TextInput
            {...this.props}
            style={styles.viewInputStyle}
            onChangeText={this.props.onChangeText}
            value={this.props.value}
            multiline={this.props.multiline}
            placeholder={this.props.placeholder}
            maxLength={this.props.maxLength}
            allowFontScaling={false}
          />
        </View>
      </View>
    );
  }
}

export default class ExpressDelivery extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userName: this.props.user && this.props.user.name ? this.props.user.name : null,
      numberPhone: this.props.user && this.props.user.phone ? this.props.user.phone : null,
      address: ''
    };
  }

  onChangeUsername = (userName) => {
    this.setState({
      userName
    });
  };

  onChangeNumberPhone = (numberPhone) => {
    this.setState({
      numberPhone
    });
  };

  onChangeAdress = (address) => {
    this.setState({
      address
    });
  };

  render() {
    const { userName, numberPhone, address } = this.state;
    return (
      <View contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <BaseText style={styles.textItemSummary}>{Lang.buyCourse.text_attention}:</BaseText>
          <View style={styles.item}>
            <View style={styles.itemAttention}>
              <Octicons style={styles.icon} name={'primitive-dot'} size={12 * Dimension.scale} color={Resource.colors.greenColorApp} />
              <BaseText style={styles.textAttention}>{Lang.buyCourse.text_delivery_location}</BaseText>
            </View>
            <View style={styles.itemAttention}>
              <Octicons style={styles.icon} name={'primitive-dot'} size={12 * Dimension.scale} color={Resource.colors.greenColorApp} />
              <BaseText style={styles.textAttention}>{Lang.buyCourse.text_contact_phone_number}</BaseText>
            </View>
            <View style={styles.itemAttention}>
              <Octicons style={styles.icon} name={'primitive-dot'} size={12 * Dimension.scale} color={Resource.colors.greenColorApp} />
              <BaseText style={styles.textAttention}>{Lang.buyCourse.text_express_delivery_form}</BaseText>
            </View>
          </View>
        </View>
        <View style={styles.infoCustomer}>
          <ItemInput
            text={Lang.buyCourse.text_recipient_snamel}
            placeholder={Lang.buyCourse.text_placeholder_full_name}
            value={userName}
            onChangeText={this.onChangeUsername}
            multiline={true}
          />
          <ItemInput
            text={Lang.buyCourse.text_number_phone}
            maxLength={11}
            keyboardType="number-pad"
            placeholder={Lang.buyCourse.text_placeholder_number_phone}
            value={numberPhone}
            onChangeText={this.onChangeNumberPhone}
          />
          <ItemInput
            text={Lang.buyCourse.text_adress}
            placeholder={Lang.buyCourse.text_input_adress}
            value={address}
            onChangeText={this.onChangeAdress}
            multiline={true}
          />
          <BaseText style={styles.textAttentionInfo}>{Lang.buyCourse.text_please_complete_information}</BaseText>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    maxHeight: height
  },
  content: {
    flexDirection: 'row',
    paddingHorizontal: 25
  },
  item: {
    flex: 1,
    marginTop: 2 * Dimension.scale
  },
  itemAttention: {
    flexDirection: 'row',
    marginBottom: 10
  },
  textItemSummary: {
    fontSize: 14 * Dimension.scale,
    color: Resource.colors.black1
  },
  icon: {
    paddingLeft: 7 * Dimension.scale,
    paddingTop: 2 * Dimension.scale
  },
  textAttention: {
    flex: 1,
    fontSize: 13 * Dimension.scale,
    marginLeft: 7,
    color: Resource.colors.black1
  },
  textAttentionInfo: {
    fontSize: 12 * Dimension.scale,
    color: Resource.colors.black1
  },
  infoCustomer: {
    margin: 20,
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 50,
    borderRadius: 5,
    backgroundColor: Resource.colors.blueGrey50
  },
  containers: {
    paddingVertical: 5
  },
  textStyle: {
    fontSize: 12 * Dimension.scale,
    color: Resource.colors.black1
  },
  viewInput: {
    marginTop: 5 * Dimension.scale,
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxHeight: 90 * Dimension.scale
  },
  viewInputStyle: {
    flex: 1,
    maxHeight: 90 * Dimension.scale,
    paddingLeft: 10,
    fontSize: 12 * Dimension.scale,
    textAlign: 'right',
    paddingVertical: 0,
    paddingTop: 0,
    textAlignVertical: 'top'
  }
});
