import HTMLFurigana from 'common/components/base/HTMLFurigana';
import React, { PureComponent } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Dimension from 'common/helpers/Dimension';

export default class HeaderMondaiQuickTest extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  scrollTo = (index) => {
    this.FlatList?.scrollTo({ animated: true, x: index * Dimension.widthParent });
  };

  keyExtractor = (item, index) => `Item_${item.id.toString()}`;

  renderItem = (item, index) => {
    return (
      <View style={{ width: Dimension.widthParent }} key={`Item ${item.id}`}>
        <HTMLFurigana html={item.value} normalText={{ fontSize: 14 }} />
      </View>
    );
  };

  render() {
    const { endList, listMondai, dataLength } = this.props;
    if (endList) return null;
    return (
      <View style={styles.question}>
        {dataLength > 0 && (
          <ScrollView bounces={false} horizontal={true} showsHorizontalScrollIndicator={false} pagingEnabled={true} ref={(refs) => (this.FlatList = refs)}>
            {listMondai?.map(this.renderItem)}
          </ScrollView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  question: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10
  }
});
