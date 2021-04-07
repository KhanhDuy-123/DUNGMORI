import Colors from 'assets/Colors';
import Dimension from 'common/helpers/Dimension';
import Strings from 'common/helpers/Strings';
import React, { Component } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class SearchLesson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    };
    this.listLesson = props.listLesson;
    this.listSpecLesson = props.listSpecLesson;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.listLesson !== this.props.listLesson || nextProps.listSpecLesson !== this.props.listSpecLesson) {
      this.listLesson = nextProps.listLesson;
      this.listSpecLesson = nextProps.listSpecLesson;
    }
    return nextState !== this.state;
  }

  onPressResetText = () => {
    this.onChangeText('');
  };

  onChangeText = (text) => {
    this.setState({ text }, this.onSearch);
  };

  onSearch = () => {
    clearTimeout(this.timeSearch);
    this.timeSearch = setTimeout(() => {
      let listLessons = [];
      let listSpecLesson = [];
      const { text } = this.state;
      let listData = this.listLesson;
      let listDataSpec = this.listSpecLesson;
      if (!text) listLessons = [0];
      else {
        listLessons = this.compareText(listData, text);
        if (listDataSpec.length > 0) listSpecLesson = this.compareText(listDataSpec, text);
      }
      this.props.onSearchComplete(listLessons, listSpecLesson);
    }, 500);
  };

  compareText = (listData = [], text) => {
    let listLessons = [];
    for (let i = 0; i < listData.length; i++) {
      if (listData[i].is_step > 0) continue;
      let item = { ...listData[i] };
      item.lessons = item.lessons.filter((e) => {
        let name = Strings.replaceAscent(e.name);
        let textCompare = Strings.replaceAscent(text);
        return name.indexOf(textCompare) !== -1;
      });
      if (item.lessons?.length > 0) listLessons.push(item);
    }
    return listLessons;
  };

  render() {
    const { text } = this.state;
    return (
      <View style={styles.containerSearch}>
        <MaterialIcons name="search" size={26} color={Colors.greenColorApp} />
        <TextInput
          onChangeText={this.onChangeText}
          value={this.state.text}
          style={{ paddingHorizontal: 15, fontSize: 15, height: 45, flex: 1 }}
          placeholder={'Tìm kiếm...'}
        />
        {text?.length > 0 && (
          <TouchableOpacity style={styles.buttonClose} onPress={this.onPressResetText}>
            <AntDesign name={'closecircle'} size={20} color={'grey'} />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerSearch: {
    width: Dimension.widthParent,
    height: 45,
    backgroundColor: 'rgba(0,0,0,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    borderBottomColor: 'rgba(0,0,0,0.2)',
    borderBottomWidth: 0.5
  },
  buttonClose: {
    width: 35,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
