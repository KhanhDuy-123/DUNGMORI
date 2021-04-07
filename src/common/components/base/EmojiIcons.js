import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import React, { PureComponent } from 'react';
import { Animated, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Const from 'consts/Const';

const width = Dimension.widthParent;
const gridSize = (width - 40) / 8;

class ItemEmoji extends PureComponent {
  onPress = () => {
    this.props.onSelected(this.props.item);
  };

  render() {
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={this.onPress} style={styles.emojiGrid}>
        <BaseText style={styles.emojiSize}>{this.props.item}</BaseText>
      </TouchableOpacity>
    );
  }
}

export default class EmojiIcons extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      emojiList: Const.EMOJI_LIST.split(',')
    };
    this.containerHeight = new Animated.Value(0);
  }

  isShow = () => {
    return this.state.isVisible;
  };

  toogleShow = () => {
    this.setState({
      isVisible: !this.state.isVisible
    });
  };

  startSequenceAnimated = (animations) => {
    if (this.animated) this.animated.stop();
    this.animated = Animated.sequence(animations);
    this.animated.start();
  };

  show = () => {
    this.setState(
      {
        isVisible: true
      },
      () => {
        this.startSequenceAnimated([
          Animated.timing(this.containerHeight, {
            toValue: 220,
            duration: 300
          })
        ]);
      }
    );
  };

  hide = async () => {
    this.startSequenceAnimated([
      Animated.timing(this.containerHeight, {
        toValue: 0,
        duration: 300
      })
    ]);
    await Funcs.delay(400);
    this.setState({
      isVisible: false
    });
  };

  onSelected = (item) => {
    if (this.props.onSelected) this.props.onSelected(item);
  };

  renderItem = ({ item, index }) => <ItemEmoji item={item} onSelected={this.onSelected} />;

  render() {
    if (!this.state.isVisible) return null;
    return (
      <Animated.View style={[styles.emojiContainer, { height: this.containerHeight }]}>
        <FlatList
          style={styles.flatListStyle}
          data={this.state.emojiList}
          renderItem={this.renderItem}
          horizontal={false}
          numColumns={8}
          ref={(scrollview) => (this.scrollview = scrollview)}
          keyExtractor={(item, index) => index.toString()}
        />
      </Animated.View>
    );
  }
}
const styles = StyleSheet.create({
  emojiContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#DDD',
    borderRadius: 10
  },
  flatListStyle: {
    padding: 8
  },
  emojiGrid: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emojiSize: {
    fontSize: gridSize - 10
  }
});
