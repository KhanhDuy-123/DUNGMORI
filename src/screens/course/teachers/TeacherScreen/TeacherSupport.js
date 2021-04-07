import Images from 'assets/Images';
import BaseImage from 'common/components/base/BaseImage';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import Const from 'consts/Const';
import React, { Component } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const avatarRatio = 500 / 866;
const backgroundRatio = 375 / 582;
export default class TeacherSupport extends Component {
  constructor(props) {
    super(props);
    let listTeacher = props.listTeacher.filter((e) => e.type === 1);
    this.state = { listTeacher };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.listTeacher !== this.props.listTeacher) {
      let listTeacher = nextProps.listTeacher.filter((e) => e.type === 1);
      this.setState({ listTeacher });
    }
    return nextState !== this.state;
  }

  onPressShowInfo = (item) => (event) => {
    const pageX = event.nativeEvent.pageX;
    const pageY = event.nativeEvent.pageY;
    this.props.onPressShowInfo(item, pageX, pageY);
  };

  keyExtractor = (item, index) => item.id.toString();

  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity style={styles.wrapperContent} onPress={this.onPressShowInfo(item)}>
        <View style={{ flex: 1, overflow: 'hidden', borderRadius: 15 }}>
          <BaseImage source={Images.imgClass} style={styles.imgBackground} />
          <BaseImage source={{ uri: Const.RESOURCE_URL.TEACHER.DEFAULT + item.avatar_name }} style={styles.avatarImg} />
          <View style={styles.viewName}>
            <LinearGradient colors={['rgba(0, 0, 0, 0.005)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.8)']} style={styles.wrapperName}>
              <BaseText style={styles.textName}>{item.name}</BaseText>
            </LinearGradient>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { listTeacher } = this.state;
    return (
      <View style={{ alignItems: 'center' }}>
        <FlatList data={listTeacher} keyExtractor={this.keyExtractor} renderItem={this.renderItem} numColumns={2} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  wrapperContent: {
    width: 125 * Dimension.scale,
    height: 145 * Dimension.scale,
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#6AD36C',
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  viewName: {
    position: 'absolute',
    bottom: 0,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    width: '100%',
    height: 45 * Dimension.scale
  },
  wrapperName: {
    flex: 1,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  textName: {
    marginBottom: 10 * Dimension.scale,
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700'
  },
  avatarImg: {
    width: 75 * Dimension.scale,
    height: (75 * Dimension.scale) / avatarRatio,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0
  },
  imgBackground: {
    width: 125 * Dimension.scale,
    height: (125 * Dimension.scale) / backgroundRatio,
    position: 'absolute'
  }
});
