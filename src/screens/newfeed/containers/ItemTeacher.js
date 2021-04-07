import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import NavigationService from 'common/services/NavigationService';
import React, { PureComponent } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import HTML from 'react-native-render-html';
import Const from 'consts/Const';
const { width, height } = Dimensions.get('window');

export default class ItemTeacher extends PureComponent {
  onPressDetailTeacher = data => () => {
    NavigationService.navigate('DetailTeacherScreen', { data });
  };

  render() {
    const { item, activeLike } = this.props;
    const userName = item.name;
    const imageTeacher = Const.RESOURCE_URL.TEACHER.SMALL;
    return (
      <View style={styles.container}>
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          style={styles.imagesPost}
          source={{ uri: imageTeacher + item.avatar_name }}
        />
        <View style={styles.info}>
          <BaseText style={styles.titleAvata}>{item.name}</BaseText>
          <HTML
            style={styles.textInfo}
            html={item.information}
            ignoredStyles={['font-family']}
            imagesMaxWidth={Dimensions.get('window').width}
          />
          <View style={styles.viewButton}>
            <TouchableOpacity onPress={this.onPressDetailTeacher(item)} style={styles.button}>
              <BaseText style={styles.textButton}>Xem chi tiết</BaseText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Resource.colors.white100
  },
  imagesPost: {
    width: 110,
    height: 110,
    borderRadius: 70,
    borderWidth: 1,
    padding: 10,
    borderColor: Resource.colors.border
  },
  info: {
    flex: 1,
    marginLeft: 10
  },
  titleAvata: {
    fontWeight: '500',
    marginBottom: 10,
    color: Resource.colors.greenColorApp,
    fontSize: 14
  },
  textInfo: {
    color: Resource.colors.black1,
    fontSize: 13
  },
  viewButton: {
    paddingVertical: 25,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Resource.colors.greenColorApp
  },
  textButton: {
    fontWeight: '600',
    color: Resource.colors.white100,
    fontSize: 13
  }
});
