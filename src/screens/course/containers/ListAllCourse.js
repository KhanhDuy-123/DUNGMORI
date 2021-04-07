import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import NavigationService from 'common/services/NavigationService';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React, { Component } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import HomeActionCreator from 'states/redux/actionCreators/HomeActionCreator';
import ItemAllCourse from './ItemAllCourse';
const parentWidth = Dimension.widthParent - 30;

let SCALE = Dimension.scale;
class ListAllCourse extends Component {
  constructor(props) {
    super(props);
    let data = props.listCourse;
    this.state = {
      data: data ? data : []
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.listCourse !== this.props.listCourse) {
      let data = nextProps.listCourse || [];
      for (let i = 0; i < data?.length; i++) {
        let item = { ...data[i] };
        if (item.name == 'N5') {
          item.resource = Resource.images.imgN5;
        } else if (item.name == 'N4') {
          item.resource = Resource.images.imgN4;
        } else if (item.name == 'N3') {
          item.resource = Resource.images.imgN3;
        } else if (item.name == 'N2') {
          item.resource = Resource.images.imgN2;
        } else if (item.name == 'N1') {
          item.resource = Resource.images.imgN1;
        } else if (item.name?.toUpperCase() == 'CHUYÊN NGÀNH') {
          item.resource = Resource.images.icFlashcard;
        }
        data[i] = item;
      }
      this.setState({ data: [...data] });
    }
    if (nextProps.language !== this.props.language) {
      this.setState({ data: [...this.state.data] });
    }
    return nextState !== this.state || nextProps !== this.props;
  }

  onUpdateData = () => {
    HomeActionCreator.getHomeLesson();
  };

  onPressItem = (item) => {
    if (item.price == 0 || item.owned == 1) {
      let params = { ...item };
      params.course_id = item.id;
      if (params.premium === 1) {
        NavigationService.navigate(ScreenNames.CourseProgressScreen, { params, updateData: this.onUpdateData });
      } else {
        NavigationService.navigate(ScreenNames.ChooseLessionScreen, { params, updateData: this.onUpdateData });
      }
    } else {
      let type = 'jlpt';
      if (item.name == 'Kaiwa') {
        type = Const.COURSE_TYPE.KAIWA;
      } else {
        type = Const.COURSE_TYPE.EJU;
      }
      if (item.premium === 1) {
        NavigationService.navigate(ScreenNames.DetailCourseNewScreen, { item, type, updateData: this.onUpdateData });
      } else {
        NavigationService.navigate(ScreenNames.DetailCourseScreen, { item, type, updateData: this.onUpdateData });
      }
    }
  };

  renderLabel = (item) => {
    let text = '';
    if (item.price == 0 || item.name?.toUpperCase() == 'N5') {
      text = Lang.homeScreen.text_free;
    } else if (item.owned == 1) {
      text = Lang.homeScreen.text_bought;
    }
    let backgroundColor = 'red';
    if (item.price == 0) backgroundColor = 'green';
    if (!(item.owned == 1 || item.price == 0)) return <View />;
    return (
      <View style={[styles.viewBadge, { backgroundColor }]}>
        <BaseText style={styles.textBadge}>{text}</BaseText>
      </View>
    );
  };

  renderItem = ({ item, index }) => {
    return <ItemAllCourse item={item} onPressItem={this.onPressItem} index={index} dataLenth={this.state.data?.length} />;
  };

  keyExtractor = (item, index) => index.toString();

  render() {
    const { data } = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          numColumns={3}
          scrollEnabled={false}
          removeClippedSubviews={true}
          extraData={this.state.data}
          contentContainerStyle={styles.containerFlatList}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: parentWidth - 1,
    backgroundColor: '#EBEDEE',
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 1 },
    alignSelf: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
    elevation: 5
  },
  containerFlatList: {
    borderRadius: 8
  },
  wrapperItem: {
    width: parentWidth / 3,
    height: 89 * SCALE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginRight: 0.7,
    marginBottom: 0.7,
    borderBottomRightRadius: 8
  }
});

const mapStateToProps = (state) => ({
  language: state.languageReducer.language
});

export default connect(mapStateToProps)(ListAllCourse);
