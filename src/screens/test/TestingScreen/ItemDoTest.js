import Dimension from 'common/helpers/Dimension';
import moment from 'moment';
import React from 'react';
import { FlatList } from 'react-native';
import ItemTest from '../../components/lession/ItemTest';
const width = Dimension.widthParent;

export default class ItemDoTest extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onSelectedAnswer = (data) => {
    this.props.onSelectedAnswer(data);
  };

  onScrollToTop = () => {
    this.FlatList.scrollToIndex({ animated: true, index: 0 });
  };

  keyExtractor = (item, index) => (moment().valueOf() + index).toString();

  renderItem = ({ item, index }) => {
    return <ItemTest key={'Item_' + index} item={item} ref={(refs) => (this.TestItem = refs)} onSelectedAnswer={this.onSelectedAnswer} isTryDoTest={true} />;
  };

  render() {
    const { item } = this.props;
    return (
      <FlatList
        data={item}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        extraData={this.state}
        contentContainerStyle={{ width }}
        showsHorizontalScrollIndicator={false}
        ref={(refs) => (this.FlatList = refs)}
      />
    );
  }
}
