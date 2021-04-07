import Colors from 'assets/Colors';
import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import LoadingModal from 'common/components/base/LoadingModal';
import React, { Component } from 'react';
import { Animated, Keyboard, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import { connect } from 'react-redux';
import NavigationService from 'common/services/NavigationService';
import BlogActionCreator from 'states/redux/actionCreators/BlogActionCreator';
import Dimension from 'common/helpers/Dimension';
import ModalDetailSeri from '../containers/ModalDetailSeri';
import ChooseSeri from './containers/containers/ChooseSeri';

class DetailSeriScreen extends Component {
  constructor(props) {
    super(props);
    const series = NavigationService.getParams('params');
    this.state = {
      dataList: [],
      page: 1,
      title: series.name,
      showSearch: false,
      keyWords: ''
    };
    this.AnimatedSearch = new Animated.Value(0);
    this.dataBegin = [];
  }

  componentDidMount() {
    LoadingModal.show();
    const series = NavigationService.getParams('params');
    BlogActionCreator.getListBlog(false, 1, null, () => {}, series.series_id);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.listBlog !== this.props.listBlog) {
      this.setState({ dataList: nextProps.listBlog });
    }
    return nextState !== this.state;
  }

  onBackPress = () => {
    NavigationService.pop();
  };

  onPressShow = (text) => {
    this.ModalDetailSeri.showModal(text);
  };

  onLoadMore = () => {
    const series = NavigationService.getParams('params');
    this.setState({ page: this.state.page + 1 }, () => {
      let keyWords = null;
      if (this.state.keyWords.length > 0) keyWords = this.state.keyWords;
      BlogActionCreator.getListBlog(true, this.state.page, keyWords, () => this.ChooseSeri.onLoadMoreEnd(), series.series_id);
    });
  };

  onPressShowSearch = () => {
    this.setState({ page: 1, showSearch: !this.state.showSearch, keyWords: '' }, this.onAnimated);
  };

  onAnimated = () => {
    const { showSearch } = this.state;
    Animated.spring(this.AnimatedSearch, {
      toValue: showSearch ? 1 : 0,
      speed: 20,
      bounciness: 0
    }).start();
  };

  onPressClose = () => {
    Keyboard.dismiss();
    const series = NavigationService.getParams('params');
    this.setState({ showSearch: false, keyWords: '', page: 1 }, () => {
      BlogActionCreator.getListBlog(false, 1, null, () => {}, series.series_id);
      this.onAnimated();
    });
    clearTimeout(this.timeScroll);
    this.timeScroll = setTimeout(() => {
      this.ChooseSeri.onPressGoToTop();
    }, 300);
  };

  onChangeText = (text) => {
    const series = NavigationService.getParams('params');
    this.setState({ page: 1, keyWords: text, dataList: [] }, () => {
      clearTimeout(this.timeSearch);
      this.timeSearch = setTimeout(() => {
        BlogActionCreator.getListBlog(false, 1, text, () => {}, series.series_id);
      }, 500);
    });
  };

  render() {
    const { showSearch, title } = this.state;
    const widthSearch = this.AnimatedSearch.interpolate({
      inputRange: [0, 1],
      outputRange: ['15%', '96%']
    });
    return (
      <Container containerStyles={styles.containerStyles} statusBarColor={Colors.greenColorApp}>
        <View style={styles.header}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={styles.buttonBack} onPress={this.onBackPress}>
              <Icon name="ios-arrow-back" size={23 * Dimension.scale} color={'white'} />
            </TouchableOpacity>
            <BaseText style={styles.title} onPress={this.onBackPress} numberOfLines={1}>
              {title}
            </BaseText>
          </View>
          <Animated.View style={[styles.wrapperSearch, { width: widthSearch }]}>
            <View style={[styles.viewSearch, { backgroundColor: showSearch ? '#E9E9EA' : Colors.greenColorApp }]}>
              <TouchableOpacity style={styles.buttonRight} onPress={this.onPressShowSearch} disabled={showSearch}>
                <Octicons name="search" size={20} color={'#D0D0D2'} />
              </TouchableOpacity>
              {showSearch && (
                <TextInput
                  autoFocus={true}
                  allowFontScaling={false}
                  placeholder={Lang.seriHistory.text_input_placeholder}
                  style={styles.textInputStyle}
                  onChangeText={this.onChangeText}
                />
              )}
            </View>
            {showSearch && (
              <BaseText style={styles.textCancel} onPress={this.onPressClose}>
                {Lang.blog.cancel}
              </BaseText>
            )}
          </Animated.View>
        </View>
        <ChooseSeri dataList={this.state.dataList} onPress={this.onPressShow} onEndReached={this.onLoadMore} ref={(refs) => (this.ChooseSeri = refs)} />
        <ModalDetailSeri ref={(refs) => (this.ModalDetailSeri = refs)} />
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listBlog: state.blogReducer.listBlog
  };
};

export default connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(DetailSeriScreen);

const styles = StyleSheet.create({
  header: {
    width: Dimension.widthParent,
    height: 50,
    paddingLeft: 10,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.greenColorApp,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2.5
  },
  buttonBack: {
    height: 50,
    width: 25,
    justifyContent: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: 'white',
    width: '95%'
  },
  buttonRight: {
    justifyContent: 'center',
    marginRight: 10,
    paddingTop: 3
  },
  viewSearch: {
    width: '85%',
    height: 35,
    paddingLeft: 15,
    flexDirection: 'row',
    shadowColor: 'grey',
    alignItems: 'center',
    backgroundColor: '#E9E9EA',
    borderRadius: 10
  },
  containerStyles: {
    backgroundColor: Colors.greenColorApp
  },
  wrapperSearch: {
    flexDirection: 'row',
    alignItems: 'center'
    // margi
  },
  textCancel: {
    color: 'black',
    marginLeft: 10,
    marginRight: 10
  },
  textInputStyle: {
    width: '80%',
    paddingVertical: 0,
    fontSize: 15,
    height: '100%'
  }
});
