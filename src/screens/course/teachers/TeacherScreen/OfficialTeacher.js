import Images from 'assets/Images';
import Lang from 'assets/Lang';
import BaseImage from 'common/components/base/BaseImage';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import Const from 'consts/Const';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const avatarRatio = 729 / 993;
const backgroundRatio = 375 / 582;
export default class OfficialTeacher extends Component {
  constructor(props) {
    super(props);
    let listTeacher = props.listTeacher.filter((e) => e.type === 2);
    this.state = { listTeacher };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.listTeacher !== this.props.listTeacher) {
      let listTeacher = nextProps.listTeacher.filter((e) => e.type === 2);
      this.setState({ listTeacher });
    }
    return nextState !== this.state;
  }

  onPressViewInfo = (item) => (event) => {
    const pageX = event.nativeEvent.pageX;
    const pageY = event.nativeEvent.pageY;
    this.props.onPressShowInfo(item, pageX, pageY);
  };

  onPressLinkYoutube = (item) => () => {
    const indexV = item.youtube_intro.indexOf('v=');
    const lastIndex = item.youtube_intro.indexOf('&');
    let videoID = item.youtube_intro.substring(indexV + 2);
    if (lastIndex !== -1) {
      videoID = item.youtube_intro.substring(indexV + 2, lastIndex);
    }
    this.props.onPressViewVideoInfo(videoID);
  };

  renderItem = (item, index) => {
    let information = item?.information?.split('<br>');
    let level = information[0];
    let experiend = information[1];
    return (
      <View style={styles.wrapperContent} key={item.id}>
        <View style={styles.avatar}>
          <BaseImage source={Images.imgClass} style={styles.imgBackgound} />
          <BaseImage source={{ uri: Const.RESOURCE_URL.TEACHER.DEFAULT + item.avatar_name }} style={styles.avatarImg} />
        </View>
        <View style={styles.wrapperInfo}>
          <BaseText style={styles.textName}>{item.name}</BaseText>
          <BaseText style={{ width: '95%' }}>
            <BaseText style={styles.textTitle}>{Lang.teacher.level} </BaseText>
            <BaseText style={styles.textDescription}>{level}</BaseText>
          </BaseText>
          <BaseText style={{ width: '95%', marginTop: 10 }}>
            <BaseText style={styles.textTitle}>{Lang.teacher.experiend} </BaseText>
            <BaseText style={styles.textDescription}>{experiend}</BaseText>
          </BaseText>
          <View style={styles.viewInfo}>
            <TouchableOpacity style={styles.buttonViewMore} onPress={this.onPressViewInfo(item)}>
              <BaseText style={styles.textButton}>{Lang.teacher.view_infor}</BaseText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonVideo} onPress={this.onPressLinkYoutube(item)}>
              <AntDesign name="playcircleo" color="#379C3C" size={18} />
              <BaseText style={styles.textButtonVideo}>{Lang.teacher.view_video_infor}</BaseText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const { listTeacher } = this.state;
    return <View style={styles.container}>{listTeacher.map(this.renderItem)}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  wrapperContent: {
    width: Dimension.widthParent - 20,
    minHeight: 125 * Dimension.scale,
    backgroundColor: '#FFFFFF',
    marginBottom: 15,
    borderRadius: 15,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row'
  },
  avatar: {
    width: 110 * Dimension.scale,
    height: '100%',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    alignItems: 'center',
    overflow: 'hidden'
  },
  wrapperInfo: {
    paddingLeft: 10,
    flex: 1,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    paddingVertical: 15
  },
  textName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#379C3C',
    marginBottom: 10
  },
  textTitle: {
    fontWeight: '600',
    fontSize: 11,
    letterSpacing: -0.2
  },
  textDescription: {
    fontSize: 11,
    fontWeight: '200'
  },
  viewInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    flex: 1,
    alignItems: 'flex-end',
    marginTop: 10
  },
  buttonViewMore: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#379C3C'
  },
  textButton: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600'
  },
  buttonVideo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textButtonVideo: {
    fontSize: 10,
    color: '#379C3C',
    marginLeft: 5
  },
  avatarImg: {
    width: 90 * Dimension.scale,
    height: (90 * Dimension.scale) / avatarRatio,
    position: 'absolute',
    bottom: 0
  },
  imgBackgound: {
    width: 125 * Dimension.scale,
    height: (125 * Dimension.scale) / backgroundRatio,
    position: 'absolute'
  }
});
