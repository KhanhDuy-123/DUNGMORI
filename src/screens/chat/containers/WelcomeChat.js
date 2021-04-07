import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import Time from 'common/helpers/Time';
import React, { PureComponent } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Const from 'consts/Const';

const itemWidth = 210 * Dimension.scale;
export default class WelcomeChat extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  async componentDidMount() {
    let res = await Fetch.get(Const.API.CONVERSATION.GET_TEMPLATE_MESSAGE);
    if (res.status === Fetch.Status.SUCCESS) {
      this.setState({ data: res.data.message });
    }
  }

  render() {
    const { user } = this.props;
    let date = Time.format(Date.now(), 'HH:mm');
    return (
      <View style={styles.container}>
        <FastImage source={Resource.images.welcomeGif} style={styles.welcomeGif} resizeMode={FastImage.resizeMode.contain} />
        <View style={styles.box}>
          <View style={styles.welcomeTextbox}>
            <BaseText numberOfline={2} style={styles.welcomeText}>
              {Lang.chat.text_hello} {user.name}
              <BaseText>{Lang.chat.text_help_you}</BaseText>
            </BaseText>
            {this.renderListQuestion()}
          </View>
          <BaseText style={styles.time}>{date} PM</BaseText>
        </View>
      </View>
    );
  }

  renderListQuestion() {
    return <FlatList data={this.state.data} extraData={this.state} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />;
  }
  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={this.props.onPress(item)} style={index === 2 ? styles.viewVelcomeTexts : styles.viewVelcomeText}>
        <BaseText style={styles.welcomeTexts}>{item.title}</BaseText>
        <FastImage source={Resource.images.iconSend} style={styles.iconStyle} />
      </TouchableOpacity>
    );
  };
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  itemChat: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  welcomeChat: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  box: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  welcomeTextbox: {
    width: itemWidth,
    borderRadius: 15 * Dimension.scale,
    borderWidth: 1,
    overflow: 'hidden',
    borderColor: Resource.colors.border
  },
  time: {
    fontSize: 11 * Dimension.scale,
    marginLeft: 10,
    marginRight: 5,
    color: Resource.colors.black3
  },
  iconAvata: {
    width: 30,
    height: 30,
    borderRadius: 15
  },
  welcomeGif: {
    width: 150 * Dimension.scale,
    height: 150 * Dimension.scale,
    marginLeft: 20
  },
  welcomeText: {
    fontSize: 12 * Dimension.scale,
    paddingHorizontal: 10 * Dimension.scale,
    paddingVertical: 12 * Dimension.scale,
    fontWeight: '400',
    color: Resource.colors.black1,
    backgroundColor: Resource.colors.borderWidth
  },
  viewVelcomeText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 13 * Dimension.scale,
    paddingVertical: 10 * Dimension.scale,
    borderBottomWidth: 1,
    borderBottomColor: Resource.colors.border
  },
  viewVelcomeTexts: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 13 * Dimension.scale,
    paddingVertical: 10 * Dimension.scale
  },
  welcomeTexts: {
    flex: 1,
    fontSize: 12 * Dimension.scale,
    color: Resource.colors.black3
  },
  iconStyle: {
    width: 18 * Dimension.scale,
    height: 18 * Dimension.scale,
    color: Resource.colors.greenColorApp
  }
});
