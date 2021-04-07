import Resource from 'assets/Resource';
import Dimension from 'common/helpers/Dimension';
import React, { PureComponent } from 'react';
import { Easing, Image, NativeModules, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const width = Dimension.widthParent;
const gridSize = (width - 16) / 4;

class ItemPhotoSelect extends PureComponent {
  state = {
    thumbnail: null,
    selected: false
  };

  async componentDidMount() {
    if (this.refs.Animated) {
      this.refs.Animated.start([
        {
          type: 'opacity',
          duration: 150,
          value: 1,
          easing: Easing.linear()
        }
      ]);
    }

    // Get real path
    const { item } = this.props;
    let thumbnail = null;
    if (Platform.OS === 'android' && item && item.uri && item.type != 'camera') {
      let res = await NativeModules.CustomModule.getRealPathFromURI(item.uri);
      if (!res || !res.path) return;
      thumbnail = 'file://' + res.path;
      this.setState({ thumbnail });
    }
  }

  uncheck = () => {
    this.setState({
      selected: false
    });
  };

  onPressPhoto = () => {
    const { item } = this.props;
    var { selected } = this.state;
    selected = !selected;
    this.setState({
      selected
    });
    this.props.onSelected({
      selected,
      item
    });
  };

  render() {
    const { item } = this.props;
    const { selected } = this.state;

    // Render camera icon
    if (item.key === 'camera') {
      return (
        <TouchableOpacity activeOpacity={0.8} onPress={this.props.onPressCamera}>
          <View style={[styles.image, styles.iconImage]}>
            <Icon name="ios-camera" size={40} color="grey" />
          </View>
        </TouchableOpacity>
      );
    }

    // Render image photo
    let uri = this.state.thumbnail ? this.state.thumbnail : item.uri;
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={this.onPressPhoto}>
        <View style={styles.image}>
          <Image source={{ uri }} style={styles.image} />
          <Icon name="ios-radio-button-off" size={20} color="white" style={styles.selectedIcon} />
          {selected ? (
            <View style={styles.cover}>
              <View style={[styles.coverContainer, styles.cover]} />
              <Icon style={styles.selectedIcon} name="ios-checkmark-circle" size={20} color={Resource.colors.blue800} />
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    margin: 2,
    width: gridSize,
    height: gridSize,
    backgroundColor: '#DDDDDD'
  },
  iconImage: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectedIcon: {
    position: 'absolute',
    right: 8,
    top: 8
  },
  cover: {
    position: 'absolute',
    width: gridSize,
    height: gridSize,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  coverContainer: {
    opacity: 0.4,
    flex: 1,
    backgroundColor: 'black',
    margin: 2
  }
});

export default ItemPhotoSelect;
