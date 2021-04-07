import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import LoadingModal from 'common/components/base/LoadingModal';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React, { Component } from 'react';
import { Animated, FlatList, Keyboard, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { default as Icon } from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import { connect } from 'react-redux';
import EventService from 'common/services/EventService';
import NavigationService from 'common/services/NavigationService';
import BlogActionCreator from 'states/redux/actionCreators/BlogActionCreator';
import Dimension from 'common/helpers/Dimension';
import ModalDetailSeri from '../containers/ModalDetailSeri';
import ChooseSeri from './containers/containers/ChooseSeri';
import ModalMenuChoose from './containers/ModalMenuChoose';

class BlogScreen extends Component {
  constructor(props) {
    super(props);
    let params = NavigationService.getParams('params');
    this.state = {
      dataList: [],
      loading: true,
      chooseTime: params?.typeNotify ? true : false,
      page: 1,
      showSearch: false,
      keyWords: ''
    };
    this.count = false;
    this.countShow = 0;
    this.AnimatedTabBlogs = new Animated.Value(params?.typeNotify ? 1 : 0);
    this.AnimatedSearch = new Animated.Value(0);
    this.chooseNewlest = params?.typeNotify ? true : false;
    this.isDataBegin = true;
  }

  componentDidMount() {
    LoadingModal.show();
    this.setState({ loading: true }, () => {
      if (this.state.chooseTime) BlogActionCreator.getListBlog(false, 1, null, this.onGetBlogSuccess);
      else BlogActionCreator.getListSeries(false, 1);
    });
    EventService.add(Const.TABLE_NAME.TIPS, () => {
      this.setState({ page: 1, dataList: [] }, () => {
        if (this.state.chooseTime) BlogActionCreator.getListBlog(false, 1, null);
        else BlogActionCreator.getListSeries(false, 1);
      });
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.listSeries !== this.props.listSeries) {
      this.setState({ dataList: nextProps.listSeries });
    }
    if (nextProps.listBlog !== this.props.listBlog && this.state.chooseTime) {
      this.setState({ dataList: nextProps.listBlog });
    }
    return nextState !== this.state;
  }

  componentWillUnmount() {
    EventService.remove(Const.TABLE_NAME.TIPS);
  }

  onGetBlogSuccess = (listBlogs, key_words) => {
    const params = this.props.navigation.state.params;
    for (let i = 0; i < listBlogs.length; i++) {
      if (!params) break;
      if (listBlogs[i].id == params.blog_id) {
        this.timer = setTimeout(() => {
          if (this.countShow == 0) this.ModalDetailSeri.showModal(listBlogs[i]);
          this.countShow = 1;
        }, 300);
        break;
      }
    }
    this.ChooseSeri.onLoadMoreEnd();
  };

  onSeriesLoadMore = () => {
    this.setState({ page: this.state.page + 1 }, () => BlogActionCreator.getListSeries(true, this.state.page));
  };

  onLoadMore = () => {
    this.setState({ page: this.state.page + 1 }, () => {
      let keyWords = null;
      if (this.state.keyWords.length > 0) keyWords = this.state.keyWords;
      BlogActionCreator.getListBlog(true, this.state.page, keyWords, () => this.ChooseSeri.onLoadMoreEnd());
    });
  };

  onBackPress = () => {
    NavigationService.back();
  };

  onRightPress = () => {
    this.count = !this.count;
    this.setState({ showSearch: false });
    if (this.count) {
      this.ModalMenuChoose.show();
    } else {
      this.ModalMenuChoose.hide();
    }
  };

  onHide = () => {
    this.count = false;
  };

  onTimePress = (text) => {
    this.ModalDetailSeri.showModal(text);
  };

  onPressSeria = (item) => () => {
    NavigationService.navigate(ScreenNames.DetailSeriScreen, { series_id: item.id, name: item.name });
  };

  onPressShowSearch = () => {
    this.setState({ showSearch: !this.state.showSearch, keyWords: '' }, this.onAnimatedSearch);
  };

  onAnimatedSearch = () => {
    Animated.spring(this.AnimatedSearch, {
      toValue: this.state.showSearch ? 1 : 0,
      bounciness: 0,
      speed: 15
    }).start();
  };

  onPressClose = () => {
    Keyboard.dismiss();
    this.setState({ showSearch: false, page: 1, keyWords: '' }, () => {
      BlogActionCreator.getListBlog(false, 1, null, () => this.ChooseSeri.onLoadMoreEnd());
      this.onAnimatedSearch();
    });
    clearTimeout(this.timeScroll);
    this.timeScroll = setTimeout(() => {
      this.ChooseSeri.onPressGoToTop();
    }, 400);
  };

  onChangeText = (text) => {
    this.setState({ page: 1, keyWords: text, dataList: [] }, () => {
      clearTimeout(this.timeSearch);
      this.timeSearch = setTimeout(() => {
        BlogActionCreator.getListBlog(false, this.state.page, text, () => this.ChooseSeri.onLoadMoreEnd());
      }, 500);
    });
  };

  onPressChangeTab = (newlest) => () => {
    if (newlest == this.chooseNewlest) return;
    this.chooseNewlest = newlest;
    Animated.timing(this.AnimatedTabBlogs, {
      toValue: newlest ? 1 : 0,
      duration: 100,
      useNativeDriver: true
    }).start();

    if (!this.chooseNewlest) {
      LoadingModal.show();
      this.setState({ chooseTime: false, dataList: [], page: 1 }, () => BlogActionCreator.getListSeries(false, 1));
    } else {
      LoadingModal.show();
      this.setState({ chooseTime: true, dataList: [], page: 1 }, () => BlogActionCreator.getListBlog(false, 1, null, this.onGetBlogSuccess));
    }
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={this.onPressSeria(item)} style={styles.wrapperItem}>
        <FastImage source={{ uri: Const.RESOURCE_URL.BLOG.SMALL + item.img }} style={styles.image} />
        <View style={{ flex: 1 }}>
          <BaseText style={styles.textTitle}>{item.name}</BaseText>
        </View>
      </TouchableOpacity>
    );
  };

  renderSearch = () => {
    const { chooseTime, showSearch } = this.state;
    const widthSearch = this.AnimatedSearch.interpolate({
      inputRange: [0, 1],
      outputRange: ['10%', '100%']
    });
    if (!chooseTime) return null;
    return (
      <Animated.View style={[styles.wrapperSearch, { width: widthSearch }]}>
        <View style={[styles.viewSearch, { width: showSearch ? '90%' : null, backgroundColor: showSearch ? '#E9E9EA' : 'white' }]}>
          <TouchableOpacity style={styles.buttonRight} onPress={this.onPressShowSearch}>
            <Octicons name="search" size={20} color={'#8C8B8C'} />
          </TouchableOpacity>
          {showSearch && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                autoFocus={true}
                allowFontScaling={false}
                placeholder={Lang.seriHistory.text_input_placeholder}
                style={styles.inputSearch}
                onChangeText={this.onChangeText}
              />
            </View>
          )}
        </View>
        {showSearch && (
          <BaseText style={styles.buttonCancel} onPress={this.onPressClose}>
            {Lang.blog.cancel}
          </BaseText>
        )}
      </Animated.View>
    );
  };

  renderSeries = () => {
    const { chooseTime, dataList } = this.state;
    if (chooseTime) {
      return <ChooseSeri dataList={dataList} onPress={this.onTimePress} onEndReached={this.onLoadMore} ref={(refs) => (this.ChooseSeri = refs)} />;
    }
    return (
      <FlatList
        data={this.state.dataList}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        onEndReachedThreshold={0.5}
        onEndReached={this.onSeriesLoadMore}
        style={{ marginBottom: 20 }}
      />
    );
  };

  render() {
    const translateTab = this.AnimatedTabBlogs.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 149 * Dimension.scale]
    });
    return (
      <Container>
        <View style={styles.header}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={styles.buttonBack} onPress={this.onBackPress}>
              <Icon name="ios-arrow-back" size={23 * Dimension.scale} color={this.props.colorBackButton} />
            </TouchableOpacity>
            <BaseText style={styles.title} onPress={this.onBackPress} numberOfLines={1}>
              {Lang.seriHistory.text_japan_language_everyday}
            </BaseText>
          </View>
          {this.renderSearch()}
        </View>
        <View style={styles.tabBlogs}>
          <Animated.View style={[styles.viewAnimated, { transform: [{ translateX: translateTab }] }]} />
          <TouchableOpacity style={styles.viewTabBlogs} onPress={this.onPressChangeTab(false)}>
            <BaseText>{Lang.blog.category}</BaseText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewTabBlogs} onPress={this.onPressChangeTab(true)}>
            <BaseText>{Lang.blog.newlest}</BaseText>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          {this.renderSeries()}
          <ModalMenuChoose
            ref={(refs) => (this.ModalMenuChoose = refs)}
            onHide={this.onHide}
            onChooseSeri={this.onChooseSeri}
            onChooseTime={this.onChooseTime}
          />
        </View>
        <ModalDetailSeri ref={(refs) => (this.ModalDetailSeri = refs)} />
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listSeries: state.blogReducer.listSeries,
    listBlog: state.blogReducer.listBlog
  };
};

export default connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(BlogScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    width: Dimension.widthParent,
    height: 50 * Dimension.scale,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row'
    // backgroundColor: 'yellow'
  },
  buttonBack: {
    height: 50,
    width: 25,
    justifyContent: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    fontStyle: 'italic',
    width: '80%'
  },
  buttonRight: {
    width: 40,
    height: 50,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingTop: 3
  },
  wrapperItem: {
    marginTop: 10,
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 10,
    paddingHorizontal: 10
  },
  images: {
    width: 35,
    height: 35,
    marginLeft: 10
  },
  textTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 10
  },
  inputSearch: {
    width: '85%',
    height: 50,
    paddingVertical: 0,
    fontSize: 15,
    color: 'black'
  },
  tabBlogs: {
    width: 300 * Dimension.scale,
    height: 30 * Dimension.scale,
    backgroundColor: '#E3E3E6',
    alignSelf: 'center',
    borderRadius: 5,
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
    marginBottom: 10
  },
  wrapperBlogs: {
    width: Dimension.widthParent
  },
  viewTabBlogs: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2
  },
  viewAnimated: {
    width: 148 * Dimension.scale,
    height: 27 * Dimension.scale,
    backgroundColor: 'white',
    position: 'absolute',
    left: 2,
    borderRadius: 5,
    elevation: 1,
    shadowRadius: 5,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2
  },
  textContent: {
    marginHorizontal: 5,
    marginTop: 8,
    fontSize: 11
  },
  image: {
    width: 82.95 * Dimension.scale,
    height: 70 * Dimension.scale,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: 'grey'
  },
  buttonCancel: {
    color: 'red',
    marginLeft: 10
  },
  wrapperSearch: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  viewSearch: {
    flexDirection: 'row',
    height: 35,
    alignItems: 'center',
    borderRadius: 10
  }
});
