import Colors from 'assets/Colors';
import BaseText from 'common/components/base/BaseText';
import React, { Component } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Dimension from 'common/helpers/Dimension';
import Time from 'common/helpers/Time';
import AnimatedLoadMore from './AnimatedLoadMore';

export default class ChooseSeri extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loadMore: false
    };
  }

  onPressItem = (item) => () => {
    this.props.onPress(item);
  };

  onLoadMoreEnd = () => {
    this.setState({ loadMore: false });
  };

  onEndReached = () => {
    if (!this.onMomentumScrollBegin) {
      this.setState({ loadMore: true });
      this.props.onEndReached();
      this.onMomentumScrollBegin = true;
    }
  };

  onPressGoToTop = () => {
    if (this.FlatList) this.FlatList.scrollToOffset({ offset: 0, animated: true });
  };

  onMomentumScrollEnd = (event) => {
    this.onMomentumScrollBegin = false;
  };

  keyExtractor = (item, index) => index.toString();

  renderFooterComponent = () => {
    if (!this.state.loadMore) return null;
    return <AnimatedLoadMore />;
  };

  renderItemChooseTime = ({ item, index }) => {
    const time = Time.fromNow(item.updated_at);
    return (
      <TouchableOpacity style={styles.wrapperTime} onPress={this.onPressItem(item)}>
        <View style={styles.wrapperDot}>
          <View style={styles.dot} />
        </View>
        <View style={{ flex: 1 }}>
          {/* <BaseText style={styles.textTitle} numberOfLines={1}>
            {item.name.toUpperCase()}
          </BaseText> */}
          <BaseText style={{ marginLeft: 5 }}>{time}</BaseText>
          <View style={styles.wrapperContent}>
            <BaseText style={styles.textModai} numberOfLines={1}>
              {item.title}
            </BaseText>
            <BaseText style={styles.textContent} numberOfLines={4}>
              {item.intro}
            </BaseText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { dataList } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          scrollEventThrottle={16}
          ref={(refs) => (this.FlatList = refs)}
          data={dataList}
          renderItem={this.renderItemChooseTime}
          keyExtractor={this.keyExtractor}
          refreshing={this.state.loading}
          onRefresh={this.props.onRefresh}
          onMomentumScrollBegin={() => (this.onMomentumScrollBegin = false)}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
          onEndReachedThreshold={0.5}
          onEndReached={this.onEndReached}
          style={{ marginTop: 10 }}
          removeClippedSubviews={true}
          ListFooterComponent={this.renderFooterComponent}
        />
        <TouchableOpacity style={styles.buttonGoToTop} onPress={this.onPressGoToTop}>
          <AntDesign name="arrowup" size={20} color={'white'} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperTime: {
    // height: 120 * Dimension.scale,
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1,
    marginVertical: 10,
    paddingBottom: 15
  },
  textlabel: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 15,
    marginTop: 10
  },
  textContent: {
    marginHorizontal: 5,
    marginTop: 8,
    fontSize: 13
  },
  image: {
    width: 112.5 * Dimension.scale,
    height: 95 * Dimension.scale,
    borderRadius: 5
  },
  textDate: {
    fontSize: 12,
    color: '#797979'
  },
  textTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10
  },
  wrapperDot: {
    width: 30,
    // backgroundColor: 'yellow',
    alignItems: 'flex-end',
    paddingTop: 5
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: Colors.greenColorApp,
    borderRadius: 10
  },
  wrapperContent: {
    width: '92%'
  },
  textModai: {
    marginLeft: 5,
    fontWeight: '500',
    marginTop: 10,
    fontSize: 15
  },
  buttonGoToTop: {
    width: 40,
    height: 40,
    backgroundColor: Colors.greenColorApp,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    bottom: 30,
    borderRadius: 100
  }
});
