import React, { Component } from 'react';
import { View, Animated, TouchableOpacity, StyleSheet, TextInput, Keyboard } from 'react-native';
import BaseText from '../../../../common/components/base/BaseText';
import Dimension from '../../../../common/helpers/Dimension';
import { default as Icon } from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import Lang from '../../../../assets/Lang';
import NavigationService from '../../../../common/services/NavigationService';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Strings from 'common/helpers/Strings';

export default class HeaderCourseProgress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSearch: false,
      keyWords: ''
    };
    this.AnimatedSearch = new Animated.Value(0);
    this.listGroup = [];
  }

  onPressShowSearch = () => {
    this.setState({ showSearch: !this.state.showSearch, keyWords: '' }, () => {
      this.props.onShowSearch();
      this.onAnimatedSearch();
    });
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
    this.setState({ showSearch: false, keyWords: '' }, () => {
      this.onAnimatedSearch();
    });
  };

  onChangeText = (text) => {
    this.setState({ keyWords: text }, () => {
      this.props.changeTextTitle();
      this.onSeach(text);
    });
  };

  setGroupData = (groups) => {
    this.listGroup = groups;
  };

  onSeach = (text) => {
    if (!text || text.length == 0) {
      let listLessons = this.compareText(this.listGroup, text);
      this.props.onSearchComplete(listLessons);
    } else {
      clearTimeout(this.timeSearch);
      this.timeSearch = setTimeout(() => {
        let listLessons = this.compareText(this.listGroup, text);
        this.props.onSearchComplete(listLessons, text);
      }, 500);
    }
  };

  compareText = (listData = [], text) => {
    let listLessons = [];
    if (!text || text?.length == 0) return listLessons;
    for (let i = 0; i < listData.length; i++) {
      let lessons = listData[i].lessons;
      for (let j = 0; j < lessons.length; j++) {
        let e = lessons[j];
        let name = Strings.replaceAscent(e.name);
        let textCompare = Strings.replaceAscent(text);
        if (name.indexOf(textCompare) !== -1) {
          let content = { ...e };
          content.group_id = listData[i].id;
          content.group_name = listData[i].name;
          listLessons.push(content);
        }
      }
    }
    return listLessons;
  };

  onPressReset = () => {
    Keyboard.dismiss();
    this.onChangeText('');
  };

  onBackPress = () => {
    NavigationService.back();
  };

  renderSearch = () => {
    const { showSearch, keyWords } = this.state;
    const widthSearch = this.AnimatedSearch.interpolate({
      inputRange: [0, 1],
      outputRange: ['10%', '95%']
    });
    return (
      <Animated.View style={[styles.wrapperSearch, { width: widthSearch }]}>
        <View style={[styles.viewSearch, { width: '100%', backgroundColor: showSearch ? '#E9E9EA' : 'white' }]}>
          {!showSearch && (
            <TouchableOpacity style={styles.buttonRight} onPress={this.onPressShowSearch}>
              <Octicons name="search" size={20} color={'#8C8B8C'} />
            </TouchableOpacity>
          )}
          {showSearch && (
            <View style={styles.wrapperInput}>
              <TextInput
                autoFocus={true}
                allowFontScaling={false}
                placeholder={Lang.chooseLession.text_search_lesson}
                style={styles.inputSearch}
                onChangeText={this.onChangeText}
                value={keyWords}
              />
            </View>
          )}
          {showSearch && keyWords.length > 0 ? (
            <TouchableOpacity style={styles.buttonReset} onPress={this.onPressReset}>
              <AntDesign name="closecircle" color="#848484" size={18} />
            </TouchableOpacity>
          ) : null}
        </View>
      </Animated.View>
    );
  };

  render() {
    return (
      <View style={styles.header}>
        <TouchableOpacity style={styles.buttonBack} onPress={this.onBackPress}>
          <Icon name="ios-arrow-back" size={23 * Dimension.scale} color={this.props.colorBackButton} />
        </TouchableOpacity>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <BaseText style={styles.title} onPress={this.onBackPress} numberOfLines={1}>
            {Lang.chooseLession.text_header}
          </BaseText>
        </View>
        {this.renderSearch()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    width: Dimension.widthParent,
    height: 50 * Dimension.scale,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row'
  },
  buttonBack: {
    height: 50,
    width: 25,
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: '600'
  },
  buttonRight: {
    width: 40,
    height: 50,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingTop: 3
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
    width: '95%',
    height: 50,
    paddingVertical: 0,
    fontSize: 15,
    color: 'black'
  },
  buttonCancel: {
    color: 'red',
    marginLeft: 10
  },
  wrapperSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 10
  },
  viewSearch: {
    flexDirection: 'row',
    height: 35,
    alignItems: 'center',
    borderRadius: 20
  },
  wrapperInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  buttonReset: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 5
  }
});
