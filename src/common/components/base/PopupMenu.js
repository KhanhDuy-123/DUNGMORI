import Lang from 'assets/Lang';
import React from 'react';
import { Animated, Dimensions, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View, StatusBar } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BaseText from './BaseText';
const { height, width } = Dimensions.get('window');

export default class PopupMenu extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      item: {}
    };
    this.heightMove = new Animated.Value(0);
  }

  componentWillUnmount() {
    clearTimeout(this.timeHide);
  }

  show = (item) => {
    this.setState({ visible: true, item }, this.onMoveMenu);
  };

  onMoveMenu = () => {
    Animated.timing(this.heightMove, {
      toValue: 1,
      duration: 250
    }).start();
  };

  onMoveMenuDown = () => {
    Animated.timing(this.heightMove, {
      toValue: 0,
      duration: 200
    }).start(() => {
      this.hide();
    });
  };

  hide = () => {
    this.timeHide = setTimeout(() => {
      this.setState({ visible: false });
    }, 100);
  };

  onPressCopy = () => {
    this.props.onPressCopy(this.state.item);
  };

  onPressEdit = () => {
    this.props.onPressEdit(this.state.item);
  };

  onPressDelete = () => {
    this.props.onPressDelete(this.state.item);
  };

  render() {
    const translate = this.heightMove.interpolate({
      inputRange: [0, 1],
      outputRange: [340, 0]
    });
    return (
      <Modal visible={this.state.visible} transparent={true}>
        <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" />
        <TouchableWithoutFeedback onPress={this.onMoveMenuDown}>
          <View style={styles.container}>
            <Animated.View style={[styles.viewOption, { transform: [{ translateY: translate }] }]}>
              <TouchableOpacity onPress={this.onPressCopy}>
                <View style={styles.option}>
                  <MaterialIcons name="content-copy" size={24} color="#000000" />
                  <BaseText style={styles.textOption}>{Lang.popupMenu.text_copy}</BaseText>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.onPressDelete}>
                <View style={styles.option}>
                  <MaterialIcons name="delete" size={24} color="#000000" />
                  <BaseText style={styles.textOption}>{Lang.popupMenu.text_delete}</BaseText>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.onPressEdit}>
                <View style={styles.option}>
                  <AntDesign name="edit" size={24} color="#000000" />
                  <BaseText style={styles.textOption}>{Lang.popupMenu.text_edit}</BaseText>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    flex: 1
  },
  viewOption: {
    width,
    height: 170,
    backgroundColor: '#FFFFFF'
  },
  option: {
    flexDirection: 'row',
    padding: 15,
    width: width - 80,
    alignItems: 'center'
  },
  textOption: {
    marginLeft: 15,
    fontWeight: '400'
  }
});
