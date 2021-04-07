import React from 'react';
import { StyleSheet, View } from 'react-native';
import ItemCategory from './ItemCategory';

export default class LessonCategoriesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.convertDataState(props.categories, props.index)
    };
  }

  componentDidMount() {
    let { data } = this.state;
    const { params } = this.props;
    if (params?.owned || params?.price === 0) {
      data = data.map((val, index) => {
        if (index === 0) {
          val = { ...val };
          val.isChoose = true;
          this.props.onPressChooseCategories(val, this.props.index);
        }
        return val;
      });
      this.setState({ data });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  convertDataState = (categories, index) => {
    let data = categories?.filter((item, i) => (index === 0 ? i !== 0 : item)) || [];
    let oldItem = null;
    data = data.map((item) => {
      if (oldItem?.type === 2 && item.type === 1) {
        item.isExtendsCategory = true;
      }
      oldItem = item;
      return item;
    });
    return data;
  };

  reset = () => {
    let { data } = this.state;
    const { params } = this.props;
    data = data.map((val, index) => {
      if (val.isChoose) {
        val = { ...val };
        val.isChoose = false;
      }
      if (params?.owned && index === 0) {
        val = { ...val };
        val.isChoose = true;
      }
      return val;
    });
    this.setState({ data });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.categories !== this.props.categories || nextProps.index !== this.props.index) {
      let data = this.convertDataState(nextProps.categories, nextProps.index);
      this.setState({ data, dataLenth: data.length });
    }
    return nextState !== this.state;
  }

  onPressChooseCategories = (item) => {
    this.timer = setTimeout(() => {
      let { data } = this.state;
      data = data.map((val) => {
        if (val.id === item.id || val.isChoose) {
          val = { ...val };
          val.isChoose = val.id === item.id;
        }
        return val;
      });
      this.props.onPressChooseCategories(item, this.props.index);
      this.setState({ data });
    }, 500);
  };

  onLayout = (e) => {
    this.layoutY = e.nativeEvent.layout.y;
  };

  render() {
    const { data } = this.state;
    return (
      <View style={styles.group} onLayout={this.onLayout}>
        {data.map((item, index) => (
          <ItemCategory item={item} key={item.id.toString()} onPressChooseCategories={this.onPressChooseCategories} />
        ))}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10
  }
});
