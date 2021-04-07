import Images from 'assets/Images';
import BaseImage from 'common/components/base/BaseImage';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import Const from 'consts/Const';
import React, { Component, PureComponent } from 'react';
import { FlatList, ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Lang from 'assets/Lang';
import Colors from 'assets/Colors';
import FastImage from 'react-native-fast-image';

const COLOR_TEACHER = '#D9E6ED';
class ItemTeacherCollaborate extends PureComponent {
  onPressShowInfo = (event) => {
    const pageX = event.nativeEvent.pageX;
    const pageY = event.nativeEvent.pageY;
    this.props.onPressShowInfo(this.props.item, pageX, pageY);
  };

  render() {
    const { item } = this.props;
    let information = item.information.replace(new RegExp('<br>', 'g'), '\n');
    information = information.replace(new RegExp('<br/>', 'g'), '\n');
    information = information.split('\n');
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={this.onPressShowInfo} ref={(refs) => (this.ImageBackground = refs)}>
        <View style={styles.containerItem}>
          <View>
            <View style={styles.viewImage} />
            <BaseImage source={{ uri: Const.RESOURCE_URL.TEACHER.DEFAULT_DETAIL + item?.avartar_detail }} resizeMode={'contain'} style={styles.viewAvatar} />
          </View>
          <BaseText style={styles.nameStyle}>{item.name}</BaseText>

          <View style={{ paddingTop: 40 * Dimension.scale }}>
            <View style={styles.viewText}>
              <FastImage source={Images.icPlus} style={{ width: 10, height: 10, marginLeft: 5 }} resizeMode={FastImage.resizeMode.contain} />
              <BaseText style={styles.contentStyle} numberOfLines={1}>
                {information[2]}
              </BaseText>
            </View>
            <View style={styles.viewText}>
              <FastImage source={Images.icPlus} style={{ width: 10, height: 10, marginLeft: 5 }} resizeMode={FastImage.resizeMode.contain} />
              <BaseText style={styles.contentStyle} numberOfLines={1}>
                {information[0]}
              </BaseText>
            </View>
            <FastImage source={Images.icDot} style={{ width: 60, height: 30, marginLeft: 50 }} resizeMode={FastImage.resizeMode.contain} />
            <FastImage source={Images.icTeacherText} style={{ width: 120, height: 20, marginLeft: 5 }} resizeMode={FastImage.resizeMode.contain} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default class TeacherCollaborate extends Component {
  constructor(props) {
    super(props);
    let listTeacher = props.listTeacher?.filter((e) => e.type === 3);
    this.state = { listTeacher };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.listTeacher !== this.props.listTeacher) {
      let listTeacher = nextProps.listTeacher?.filter((e) => e.type === 3);
      this.setState({ listTeacher });
    }
    return nextState !== this.state;
  }

  onPressShowInfo = (item, pageX, pageY) => {
    this.props.onPressShowInfo(item, pageX, pageY);
  };

  keyExtractor = (item, index) => item.id.toString();

  renderItem = ({ item, index }) => {
    return <ItemTeacherCollaborate item={item} onPressShowInfo={this.onPressShowInfo} />;
  };

  render() {
    const { listTeacher } = this.state;
    return (
      <FlatList
        data={listTeacher}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        style={{ marginVertical: 15 }}
      />
    );
  }
}

const styles = StyleSheet.create({
  containerItem: {
    width: 210 * Dimension.scale,
    height: 120 * Dimension.scale,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'grey',
    shadowColor: Colors.black1,
    shadowOffset: { x: 5, y: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: Colors.white100,
    flexDirection: 'row'
  },
  viewImage: {
    width: 85 * Dimension.scale,
    height: 110 * Dimension.scale,
    backgroundColor: COLOR_TEACHER,
    marginTop: 9 * Dimension.scale,
    marginLeft: 12
  },
  viewAvatar: {
    width: 80 * Dimension.scale,
    height: 100 * Dimension.scale,
    position: 'absolute',
    left: 12,
    bottom: 0
  },
  viewText: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5
  },
  nameStyle: {
    position: 'absolute',
    top: 20 * Dimension.scale,
    left: 75 * Dimension.scale,
    fontSize: 10 * Dimension.scale,
    fontWeight: 'bold'
  },
  contentStyle: {
    width: 100 * Dimension.scale,
    fontSize: 9 * Dimension.scale,
    paddingLeft: 5
  }
});
