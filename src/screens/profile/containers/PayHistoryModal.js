import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import ModalScreen from 'common/components/base/ModalScreen';
import React, { Component, PureComponent } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';

class MenuItem extends Component {
  render() {
    return (
      <View style={styles.summary}>
        <BaseText style={styles.textItem}>{this.props.title}:</BaseText>
        <BaseText style={styles.textsummary}>{this.props.text}</BaseText>
      </View>
    );
  }
}

export default class PayHistoryModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderModalContent = () => {
    const { item } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.props.onCloseModalPress} style={styles.buttonClose}>
          <Ionicons name="md-close" size={26} color={Resource.colors.red700} />
        </TouchableOpacity>
        <View style={styles.viewCode}>
          <Octicons name="primitive-dot" size={20} color={Resource.colors.greenColorApp} />
          <BaseText style={styles.textCode}>{Lang.profile.text_code}:</BaseText>
          <BaseText style={styles.textCode}>{item.code}</BaseText>
        </View>
        <MenuItem title={Lang.profile.text_course} text={item.level} />
        <View style={styles.summary}>
          <BaseText style={styles.textItem}>{Lang.profile.text_status}:</BaseText>
          <View style={styles.status}>
            <BaseText style={styles.textStatus}>{item.status}</BaseText>
          </View>
        </View>
        <View style={styles.summary}>
          <BaseText style={styles.textItem}>{Lang.profile.text_date_created}:</BaseText>
          <View style={styles.summarys}>
            <BaseText style={styles.textsummary}>{item.time}</BaseText>
            <BaseText style={styles.textHour}>{item.hour}</BaseText>
          </View>
        </View>
        <MenuItem title={Lang.profile.text_full_name} text={item.status} />
        <MenuItem title={Lang.profile.text_date_created} text={item.time} />
        <MenuItem title={Lang.profile.text_email} text={item.status} />
        <MenuItem title={Lang.profile.text_adress} text={item.status} />
        <MenuItem title={Lang.profile.text_code_orders} text={item.status} />
        <MenuItem title={Lang.profile.text_total_money} text={item.status} />
        <MenuItem title={Lang.profile.text_payments} text={item.status} />
      </View>
    );
  };

  render() {
    const { isVisible } = this.props;
    return (
      <TouchableOpacity style={styles.containerBox}>
        <ModalScreen isVisible={isVisible} onPress={this.props.onCloseModalPress}>
          {this.renderModalContent()}
        </ModalScreen>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  containerBox: {
    flex: 1
  },
  container: {
    paddingHorizontal: 7,
    paddingVertical: 15,
    borderRadius: 5,
    backgroundColor: Resource.colors.white100
  },
  item: {
    flex: 1,
    backgroundColor: Resource.colors.white100
  },
  viewCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10
  },
  summarys: {
    flexDirection: 'row'
  },
  textCode: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '600',
    color: Resource.colors.greenColorApp
  },
  textItem: {
    fontSize: 16,
    color: Resource.colors.black3
  },
  textsummary: {
    fontSize: 16,
    color: Resource.colors.black1
  },
  status: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: Resource.colors.greenColorApp
  },
  textStatus: {
    fontSize: 16,
    color: Resource.colors.white100
  },
  textHour: {
    fontSize: 16,
    marginLeft: 10,
    color: Resource.colors.black1
  },
  buttonClose: {
    position: 'absolute',
    padding: 5,
    top: -5,
    right: 0
  }
});
