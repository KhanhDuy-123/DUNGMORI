import Colors from 'assets/Colors';
import Funcs from 'common/helpers/Funcs';
import React from 'react';
import { ActivityIndicator, FlatList, FlatListProps, Platform, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BaseText from './BaseText';

const itemsPerPage = 10;
export default class StaticFlatlist extends React.Component<FlatListProps> {
  static defaultProps = {
    emptyText: '',
    data: []
  };

  constructor(props) {
    super(props);
    this.page = 0;
    this.state = { data: [] };
  }

  async componentDidMount() {
    this.page = 0;
    this.endOfList = false;
    this.loadMore();
    if (Platform.OS === 'android') {
      await Funcs.delay(1000);
      this.loadMore();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.data && this.props.data !== nextProps.data) {
      this.page = 0;
      this.endOfList = false;
      this.loadMore(nextProps.data);
    }
    return this.state.data !== nextState.data || this.props.refreshing !== nextProps.refreshing;
  }

  loadMore = (data) => {
    if (!data) data = this.props.data;
    if (!data) return;
    const length = data.length;
    let totalPage = length / itemsPerPage;
    Funcs.log('Total page', totalPage, 'current page', this.page);
    if (this.page >= totalPage) {
      // Funcs.log('End of list');

      // Reset data
      if (this.page === 0) {
        this.setState({
          data: []
        });
      }
      return;
    }

    // Offset
    let start = itemsPerPage * this.page;
    let end = start + itemsPerPage;
    if (end >= length) end = length;

    // New data
    let newData = data.slice(start, end);
    let currentData = this.page === 0 ? [] : this.state.data;
    this.setState({
      data: [...currentData, ...newData]
    });

    // Increase page
    this.page++;
  };

  onLoadMore = () => {
    this.loadMore();
  };

  renderItem = ({ item, index }) => {
    let { renderItem } = this.props;
    if (!renderItem) return null;
    return renderItem({ item, index });
  };

  renderLoadingMore = () => {
    if (this.state.data.length >= this.props.data?.length) return null;
    return <ActivityIndicator size={'small'} style={styles.indicatorLoading} />;
  };

  render() {
    let { data } = this.state;
    let { emptyText } = this.props;
    if (!data || data.length < 1) {
      return (
        <View style={styles.containerEmpty}>
          <MaterialCommunityIcons name={'delete-empty'} size={30} color={Colors.text} />
          <BaseText style={styles.textEmpty}>{emptyText}</BaseText>
        </View>
      );
    }
    return (
      <FlatList
        {...this.props}
        refreshing={!!this.props.refreshing}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        extraData={this.props}
        renderItem={this.renderItem}
        onEndReached={this.onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={this.renderLoadingMore}
        contentContainerStyle={styles.containerContent}
      />
    );
  }
}

const styles = StyleSheet.create({
  containerEmpty: {
    flex: 1,
    alignItems: 'center',
    margin: 10
  },
  textEmpty: {
    textAlign: 'center',
    marginTop: 5
  },
  indicatorLoading: {
    marginVertical: 10
  },
  containerContent: {
    paddingVertical: 5
  }
});
