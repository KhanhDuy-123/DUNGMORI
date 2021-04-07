import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import moment from 'moment';
import React from 'react';
import { FlatList, Modal, Platform, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

class ModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      pageY: 0,
      pageX: 0,
      content: '',
      title: ''
    };
  }

  componentDidMount() {
    this.setContent();
  }

  setContent = () => {
    let content = '';
    if (!this.props.isExam) {
      content = this.props.content;
    }
    this.setState({ content: content, title: this.props.title });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.content !== this.props.content) {
      if (!nextProps.isExam || !this.props.isExam) {
        this.setState({ content: nextProps.content });
      }
    }
    if (nextProps.title !== this.props.title) {
      this.setState({ title: nextProps.title });
    }
    return nextState !== this.state;
  }

  show = () => {
    if (this.View) {
      this.View.measure((x, y, w, h, px, py) => {
        this.setState({ pageY: py, pageX: px, visible: true });
      });
    }
  };

  hide = () => {
    this.setState({ visible: false });
  };

  onPressChooseItem = (item) => () => {
    this.props.onPressChooseItem(item);
    let content = '';
    let title = this.state.title;
    if (!this.props.isExam) {
      content = item;
    } else {
      const date = moment(item.created_at).format('DD');
      title = `${Lang.try_do_test.day} ${date}`;
      content = '';
    }
    this.setState({ content, title });
  };

  onPressShowMenu = () => {
    this.props.onPress();
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, index }) => {
    if (!this.props.isExam) {
      return (
        <View style={styles.wraper}>
          <TouchableOpacity style={{ padding: 10 }} onPress={this.onPressChooseItem(item)}>
            <BaseText style={styles.name}>{item}</BaseText>
          </TouchableOpacity>
        </View>
      );
    } else {
      const date = moment(item.created_at).format('DD');
      const content = `${date}`;
      return (
        <View style={styles.wraper}>
          <TouchableOpacity style={{ padding: 10 }} onPress={this.onPressChooseItem(item)}>
            <BaseText style={styles.name}>{content}</BaseText>
          </TouchableOpacity>
        </View>
      );
    }
  };

  render() {
    const { dataList } = this.props;
    const { content } = this.state;
    let { pageY, pageX } = this.state;
    if (!pageY) pageY = 0;
    if (!pageX) pageX = 0;
    let top = pageY;
    let left = pageX;
    if (Platform.OS == 'ios') {
      top = pageY + 30;
      left = pageX;
    } else {
      top = pageY;
      left = pageX - 10 * Dimension.scaleWidth;
    }
    return (
      <View style={styles.wraper} ref={(refs) => (this.View = refs)} collapsable={false}>
        <TouchableOpacity style={styles.wraper} onPress={this.onPressShowMenu}>
          <BaseText style={styles.title}>{`${this.state.title}${' '}${content}${' '}`}</BaseText>
          <AntDesign name="caretdown" size={16} color={Resource.colors.greenColorApp} />
        </TouchableOpacity>
        <Modal transparent={true} visible={this.state.visible}>
          <TouchableWithoutFeedback onPress={this.hide}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}>
              <View style={[styles.content, { top, left }, this.props.styleContent]}>
                <FlatList data={dataList} renderItem={this.renderItem} keyExtractor={this.keyExtractor} showsVerticalScrollIndicator={false} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 150
  },
  wraper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: 'black'
  },
  title: {
    fontSize: 13,
    color: Resource.colors.greenColorApp,
    fontWeight: 'bold'
  },
  content: {
    position: 'absolute',
    width: 80,
    height: 200,
    backgroundColor: 'white',
    shadowColor: 'grey',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 1
  }
});

export default ModalContent;
