import Dimension from 'common/helpers/Dimension';
import React, { PureComponent } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
const width = Dimension.widthParent;
const height = Dimension.heightParent;

export default class Swiper extends PureComponent {
  constructor(props) {
    super(props);
    this.width = width;
    this.height = height;
    this.itemStyle = { maxWidth: this.width, maxHeight: this.height };
    this.state = {
      index: 0,
      data: []
    };
  }

  renderItem = ({ item, index }) => {
    return <View style={this.itemStyle}>{this.props.renderItem(item, index)}</View>;
  };

  keyExtractor = (item, index) => 'swiper_item_' + index.toString();

  onMomentumScrollEnd = e => {
    let index = Math.round(e.nativeEvent.contentOffset.x / this.width);
    if (this.props.onChangeIndex) this.props.onChangeIndex(index);
    this.setState({
      index
    });
  };

  getCurrentIndex = () => {
    return this.state.index;
  };

  scrollToIndex = index => {
    this.refs.FlatList.scrollToIndex({
      index,
      viewPosition: 0.5
    });
    if (this.props.onChangeIndex) this.props.onChangeIndex(index);
    this.setState({
      index
    });
  };

  scrollByIndex = offset => {
    this.scrollToIndex(this.state.index + offset);
  };

  onLayout = e => {
    this.width = e.nativeEvent.layout.width;
    this.height = e.nativeEvent.layout.height;
    this.itemStyle = { maxWidth: this.width, maxHeight: this.height };
  };

  render() {
    let { index } = this.state;
    let { showIndex } = this.props;
    return (
      <View style={[styles.container, this.props.style]}>
        <FlatList
          ref="FlatList"
          removeClippedSubviews={true}
          onLayout={this.onLayout}
          nestedScrollEnabled={true}
          keyExtractor={this.keyExtractor}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          {...this.props}
          pagingEnabled={true}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
          style={styles.container}
          renderItem={this.renderItem}
        />
        {showIndex ? (
          <View style={styles.textContainer}>
            <Text style={styles.text}>{`${index + 1}/${this.props.data.length}`}</Text>
          </View>
        ) : null}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    color: 'white'
  },
  textContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 10,
    paddingVertical: 5,
    borderRadius: 8
  }
});
