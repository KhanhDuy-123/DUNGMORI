import Colors from 'assets/Colors';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import EventService from 'common/services/EventService';
import NavigationService from 'common/services/NavigationService';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import UIConst from 'consts/UIConst';
import React, { Component } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import BlogActionCreator from 'states/redux/actionCreators/BlogActionCreator';
import ModalDetailSeri from './ModalDetailSeri';

const colorBlue = '#50ABFE';
const colorBlue1 = '#5393F4';
const colorOrange = '#FFA030';
const colorOrange1 = '#F48D53';
const colorGreen = '#67CF56';
const colorGreen1 = '#2A9728';
class BlogsNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.onGenerationColor(props.listBlog)
    };
    this.newlest = false;
  }

  componentDidMount() {
    EventService.add(Const.TABLE_NAME.TIPS, () => {
      this.newlest = false;
      BlogActionCreator.getListBlog(false, 1, null);
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.listBlog != this.props.listBlog) {
      this.setState({ data: this.onGenerationColor(nextProps.listBlog) });
    }
    return nextState !== this.state;
  }

  componentWillUnmount() {
    EventService.remove(Const.TABLE_NAME.TIPS);
  }

  onGenerationColor = (listBlog) => {
    let count = 0;
    let data = listBlog;
    for (let i = 0; i < data.length; i++) {
      let item = { ...data[i] };
      let firstItem = { ...data[i - 2] };
      let secondItem = { ...data[i - 1] };
      count += 1;
      if ((i + 1) % 3 === 0 && count === 3) {
        count = 0;
        item.color = colorGreen;
        item.colorTitle = colorGreen1;
        firstItem.color = colorBlue;
        firstItem.colorTitle = colorBlue1;
        secondItem.color = colorOrange;
        secondItem.colorTitle = colorOrange1;
      } else if (count === 1) {
        item.color = colorBlue;
        item.colorTitle = colorBlue1;
      } else if (count === 2) {
        item.color = colorOrange;
        item.colorTitle = colorOrange1;
      }
      data[i] = item;
      data[i - 1] = secondItem;
      data[i - 2] = firstItem;
    }
    return data;
  };

  onPressGoShare = () => {
    NavigationService.navigate(ScreenNames.BlogScreen);
  };

  onPressShowInfo = (item) => () => {
    this.ModalDetailSeri.showModal(item);
  };

  keyExtractor = (item, index) => 'item' + index;

  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity style={{ ...styles.wrappeItem, backgroundColor: item.color }} onPress={this.onPressShowInfo(item)}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <BaseText style={styles.text} numberOfLines={1}>
            {item?.title}
          </BaseText>
          <BaseText style={styles.textIntro} numberOfLines={5}>
            {item?.intro}
          </BaseText>
          <View style={[styles.viewTitle, { backgroundColor: item.colorTitle }]}>
            <BaseText style={styles.textTitle}>{`#${item?.name?.toLowerCase()}`}</BaseText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.data}
          extraData={this.props}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
        <ModalDetailSeri ref={(refs) => (this.ModalDetailSeri = refs)} />
      </View>
    );
  }
}

export default BlogsNew;

const styles = StyleSheet.create({
  container: {
    width: UIConst.WIDTH,
    height: 110 * Dimension.scaleHeight,
    marginTop: 5,
    paddingLeft: 5
  },
  wrappeItem: {
    width: 100 * Dimension.scaleWidth,
    height: '100%',
    borderRadius: 10,
    elevation: 1.5,
    shadowColor: 'grey',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    marginLeft: 10
  },
  text: {
    paddingTop: 10 * Dimension.scale,
    paddingHorizontal: 10 * Dimension.scale,
    fontSize: 13 * Dimension.scale,
    fontWeight: 'bold',
    color: Colors.white100
  },
  images: {
    width: 26,
    height: 26
  },
  viewTitle: {
    padding: 2,
    position: 'absolute',
    bottom: 10 * Dimension.scale
  },
  textTitle: {
    fontSize: 8 * Dimension.scale,
    fontWeight: 'bold',
    color: Colors.white100
  },
  viewMore: {
    height: 85 * Dimension.scale,
    width: 110 * Dimension.scale,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5
  },
  button: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 1,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderRadius: 100,
    paddingLeft: 2
  },
  viewWrapperContent: {
    paddingHorizontal: 5,
    marginTop: 5,
    height: 95 * Dimension.scale,
    overflow: 'hidden'
  },
  textContent: {
    marginHorizontal: 10,
    marginTop: 8,
    fontSize: 11
  },
  image: {
    width: 90 * Dimension.scale,
    height: 115 * Dimension.scale,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: 'grey'
  },
  textView: {
    color: Colors.greenColorApp,
    marginHorizontal: 10,
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 10
  },
  textIntro: {
    flex: 1,
    fontSize: UIConst.FONT_SIZE - 3,
    color: 'white',
    margin: 5,
    fontWeight: '500'
  }
});
