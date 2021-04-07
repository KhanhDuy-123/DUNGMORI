import CameraRoll from '@react-native-community/cameraroll';
import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Camera from 'common/components/base/Camera';
import DropAlert from 'common/components/base/DropAlert';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import React, { PureComponent } from 'react';
import { Animated, FlatList, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import ItemPhotoSelect from './ItemPhotoSelect';

const width = Dimension.widthParent;

const TouchablePhoto = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <BaseText style={styles.textButton}>{props.textButton}</BaseText>
    </TouchableOpacity>
  );
};
class PhotoSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeSections: [],
      photos: [{ type: 'camera', key: `camera` }],
      chooseSelectedImage: false,
      maxHeight: 0
    };
    this.listKeySelected = [];
    this.containerHeight = new Animated.Value(0);
    this.itemRefs = {};
  }

  static defaultProps = {
    containerHeight: 220
  };

  startSequenceAnimated = (animations) => {
    if (this.animated) this.animated.stop();
    this.animated = Animated.sequence(animations);
    this.animated.start();
  };

  hide() {
    this.setState({ maxHeight: 0 });

    // State
    this.isVisible = false;
  }

  async show() {
    this.setState({ maxHeight: this.props.containerHeight, photos: [{ type: 'camera', key: `camera` }], page_info: null }, async () => {
      // State
      this.isVisible = true;

      // Reset
      this.reset();

      // Get photo
      if (this.state.photos.length < 2) {
        await Funcs.delay(310);
        this.getPhotos();
      }
    });
  }

  reset() {
    // Reset all selected image
    for (var i = 0; i < this.listKeySelected.length; i += 1) {
      if (this.itemRefs[this.listKeySelected[i]]) this.itemRefs[this.listKeySelected[i]].uncheck();
    }
    this.listKeySelected = [];
  }

  onCaptureSuccess = (photo) => {
    // Send image
    if (this.props.onCaptureSuccess) this.props.onCaptureSuccess(photo);

    // Remove camera item
    var photos = this.state.photos.filter((item, index) => index != 0);

    // Add image to lib
    photos = [
      {
        type: 'camera',
        key: `camera`
      },
      {
        ...photo,
        type: 'camera',
        key: Date.now().toString() + `_camera`
      },
      ...photos
    ];
    this.setState({ photos });
  };

  onPressCamera = () => {
    if (this.refs.CameraCapture) {
      this.refs.CameraCapture.show();
    }
  };

  onSelected = ({ item, selected }) => {
    this.setState({ chooseSelectedImage: selected });
    // Remove or add
    if (!selected) {
      this.listKeySelected = this.listKeySelected.filter((key) => item.key != key);
    } else {
      // Check length
      if (this.listKeySelected.length >= 12) {
        this.itemRefs[item.key].uncheck();
        DropAlert.warn('', Lang.chat.text_limit_upload_image);
        return;
      }

      // Add
      this.listKeySelected.push(item.key);

      // Single selected
      if (this.props.isSingleSelected) {
        this.listKeySelected = this.listKeySelected.filter((key) => {
          let isOk = key === item.key;
          if (!isOk) this.itemRefs[key].uncheck();
          return isOk;
        });
      }
    }

    // List item selected
    var listItemSelected = this.listKeySelected.map((key) => {
      for (var i = 0; i < this.state.photos.length; i += 1) {
        if (key === this.state.photos[i].key) return this.state.photos[i];
      }
      return null;
    });

    // Remove null item
    listItemSelected = listItemSelected.filter((item) => item != null);

    // Callback
    if (this.props.onPhotoSelected) this.props.onPhotoSelected(listItemSelected);
  };

  loadMore = () => {
    if (this.state.page_info && this.state.page_info.has_next_page) {
      this.getPhotos();
    }
  };

  async getPhotos() {
    //Check photo permission
    let checkPermissionPhoto = await Funcs.checkPermission('photo');
    if (!checkPermissionPhoto) return;

    //Get image from camera roll
    try {
      let params = {
        first: 16,
        assetType: 'Photos'
      };
      if (Platform.OS === 'ios') params.groupTypes = 'All';
      if (this.state.page_info && this.state.page_info.end_cursor) {
        params.after = this.state.page_info.end_cursor;
      }
      let data = await CameraRoll.getPhotos(params);
      let photos = this.state.photos;
      for (let i = 0; i < data.edges.length; i++) {
        let { uri, width, height, filename } = data.edges[i].node.image;
        let arr = filename?.split('.') || [];
        let type = 'image/' + (arr.length > 1 ? arr[arr.length - 1] : 'jpeg');
        photos.push({
          uri,
          width,
          height,
          filename,
          type,
          key: Date.now().toString() + `_${i}`
        });
      }
      this.setState({ photos, page_info: data.page_info });
    } catch (error) {
      return error;
    }
  }

  isShow() {
    return this.isVisible;
  }

  getSelected() {
    return this.selectedPhotos;
  }

  render() {
    const { chooseSelectedImage } = this.state;
    return (
      <Animated.View style={[styles.container, { height: this.state.maxHeight }]}>
        {this.props.showHeader ? (
          <View style={styles.headerStyle}>
            <TouchablePhoto textButton={Lang.popupMenu.text_come_back} onPress={this.props.onPressClose} />
            {chooseSelectedImage && <TouchablePhoto textButton={Lang.popupMenu.text_agree} onPress={this.props.onPressAgree} />}
          </View>
        ) : null}
        <FlatList
          style={styles.flatlistStyle}
          contentContainerStyle={{ paddingBottom: 20 }}
          data={this.state.photos}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          onEndReached={this.loadMore}
          onEndReachedThreshold={0.25}
          numColumns={4}
        />
        <Camera ref={'CameraCapture'} onCaptureSuccess={this.onCaptureSuccess} />
      </Animated.View>
    );
  }

  keyExtractor = (item, index) => item.key.toString();

  renderItem = ({ item, index }) => {
    return <ItemPhotoSelect item={item} onSelected={this.onSelected} onPressCamera={this.onPressCamera} ref={(ref) => (this.itemRefs[item.key] = ref)} />;
  };
}

const styles = StyleSheet.create({
  container: {
    width,
    height: 220
  },
  hide: {
    width: 0,
    height: 0
  },
  flatListStyle: {
    flex: 1
  },
  headerStyle: {
    width,
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15
  },
  textButton: {
    fontSize: 17,
    color: Resource.colors.colorButton,
    padding: 5
  }
});

export default PhotoSelect;
