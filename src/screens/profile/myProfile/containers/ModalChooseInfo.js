import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import React, { Component } from 'react';
import { Animated, Easing, FlatList, Modal, PanResponder, StatusBar, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View, Image } from 'react-native';
const height = Dimension.heightParent;
const width = Dimension.widthParent;

export default class ModalChooseInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      title: '',
      data: [],
      sectionSelected: {},
      value: this.props.value
    };
    this.animatedHeight = new Animated.ValueXY({ x: 0, y: height });
    this.animatedProgress = new Animated.Value(-width);
    this.opacityView = new Animated.Value(1);

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (event, gestureState) => {
        this.animatedHeight.setOffset({ x: this.animatedHeight.x._value, y: 0 });
        this.animatedHeight.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (event, gestureState) => {
        if (gestureState.dy > 0) {
          this.animatedHeight.setValue({ x: 0, y: gestureState.dy });
        }
      },
      onPanResponderRelease: (event, gestureState) => {
        this.animatedHeight.flattenOffset();
        if (gestureState.dy < 90) {
          Animated.timing(this.animatedHeight.y, {
            toValue: 0,
            duration: 150,
            easing: Easing.linear,
            useNativeDriver: true
          }).start();
        } else {
          this.onMoveTapDown();
        }
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.data !== this.props.data) {
      let data = nextProps.data.map((e) => {
        e.choose = false;
        return e;
      });
      this.setState({ data: data });
    }
    return nextState !== this.state;
  }

  componentWillUnmount() {
    clearTimeout(this.timeHide);
  }

  onMoveUp = () => {
    Animated.timing(this.animatedHeight.y, {
      toValue: 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  };

  onMoveTapDown = () => {
    Animated.timing(this.animatedHeight.y, {
      toValue: height,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      this.hideModal();
    });
  };

  showModal = (data) => {
    if (!data) data = this.props.data;
    this.setState({ visible: true, data }, this.onMoveUp);
  };

  hideModal = () => {
    this.timeHide = setTimeout(() => {
      this.setState({ visible: false });
    }, 100);
  };

  setValue = (value) => {
    this.setState({ value });
  };

  onPressChoose = (item) => () => {
    let sectionSelected = {};
    let value = this.state;
    let data = this.state.data.map((e) => {
      if (e.name == item.name) {
        e.choose = true;
        sectionSelected = e;
        value = e.name;
      } else {
        e.choose = false;
        value = value;
      }
      return e;
    });
    this.setState({ data, sectionSelected, value });
    if (this.props.onChangeOption) this.props.onChangeOption(item);
    this.hideModal();
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.buttonItem} onPress={this.onPressChoose(item)}>
        {item.icon && <Image source={{ uri: item.icon }} style={{ width: 20, height: 20, marginRight: 5 }} resizeMode={'contain'} />}
        <BaseText style={item.choose || this.props.changeLanguage ? styles.textUnChooseItem : styles.textUnChooseItems}>{item.name || item.title}</BaseText>
      </TouchableOpacity>
    );
  };

  onPressChooseGender = () => {
    this.showModal();
  };

  renderModal() {
    const { data } = this.state;
    return (
      <Modal transparent={true} visible={this.state.visible} animationType="fade">
        <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" />
        <TouchableWithoutFeedback onPress={this.onMoveTapDown}>
          <View style={styles.container}>
            <Animated.View {...this.panResponder.panHandlers} style={[styles.headerPan, { transform: [{ translateY: this.animatedHeight.y }] }]}>
              <View style={styles.contentPan} />
            </Animated.View>
            <Animated.View style={[styles.content, { transform: [{ translateY: this.animatedHeight.y }] }]}>
              {this.props.title ? (
                <View style={styles.wraperHeader}>
                  <BaseText style={styles.textTitle}>{this.props.title}</BaseText>
                </View>
              ) : null}
              <FlatList
                style={styles.flatList}
                ref={(refs) => (this.FlatList = refs)}
                data={data}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
                extraData={this.state}
                contentContainerStyle={{ paddingBottom: 10 }}
                onContentSizeChange={this.onScrollToLastItem}
              />
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  render() {
    const { value } = this.state;
    if (this.props.scheduleKaiwa || this.props.changeLanguage || this.props.noView) {
      return this.renderModal();
    } else {
      return (
        <View style={{ flex: 1 }}>
          {this.props.title ? (
            <TouchableOpacity style={styles.viewSelect} onPress={this.onPressChooseGender}>
              <BaseText style={[styles.textSlect, this.props.titleStyle]}>{value}</BaseText>
            </TouchableOpacity>
          ) : null}
          {this.renderModal()}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  content: {
    width: width,
    borderTopLeftRadius: 15 * Dimension.scale,
    borderTopRightRadius: 15 * Dimension.scale,
    backgroundColor: '#ffffff',
    overflow: 'hidden'
  },
  flatList: {
    maxHeight: 350,
    paddingBottom: 15
  },
  wraperHeader: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Resource.colors.borderWidth,
    borderBottomWidth: 1,
    paddingVertical: 15
  },
  headerPan: {
    width,
    height: 30,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentPan: {
    width: '30%',
    height: 5,
    borderRadius: 5,
    backgroundColor: '#FFFFFF'
  },
  textTitle: {
    fontSize: 16 * Dimension.scale,
    color: Resource.colors.black3,
    textAlign: 'center',
    fontWeight: '500'
  },
  buttonItem: {
    paddingVertical: 15,
    justifyContent: 'center',
    flexDirection: 'row'
  },
  textUnChooseItem: {
    fontSize: 15 * Dimension.scale,
    color: Resource.colors.black1,
    textAlign: 'center'
  },
  textUnChooseItems: {
    fontSize: 15 * Dimension.scale,
    color: Resource.colors.black9,
    textAlign: 'center'
  },
  viewSelect: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: 10
  },
  textSlect: {
    fontSize: 13 * Dimension.scale,
    color: Resource.colors.black1,
    fontWeight: '500'
  }
});
