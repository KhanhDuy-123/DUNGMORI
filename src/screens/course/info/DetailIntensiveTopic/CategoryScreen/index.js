import Colors from 'assets/Colors';
import Images from 'assets/Images';
import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import Header from 'common/components/base/Header';
import Dimension from 'common/helpers/Dimension';
import NavigationService from 'common/services/NavigationService';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LessonActionCreator from 'states/redux/actionCreators/LessonActionCreator';

const Result = (props) => {
  return (
    <View style={{ ...styles.wrapperTime }}>
      <View style={styles.circle} />
      <Icon name={props.name} size={17} color={Colors.violet} />
      <BaseText style={styles.titleTime}>
        {props.textTime}: <BaseText style={{ ...styles.titleTime, fontWeight: '600', color: Colors.black3 }}>{props.result}</BaseText>
      </BaseText>
    </View>
  );
};

class CategoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: [
        { id: 0, icon: Images.intensive.icDoWork, title: 'Làm đề ngay' },
        { id: 1, icon: Images.intensive.icEditWork, title: 'Chữa đề' },
        { id: 2, icon: Images.intensive.icWatch, title: 'Xem lại bài làm' }
      ]
    };
    this.params = NavigationService.getParams('');
    this.routes =
      this.params.type === Const.COURSE_TYPE.LDKN
        ? [{ key: 1, title: '語彙ー漢字' }]
        : [{ key: 1, title: '語彙ー漢字' }, { key: 2, title: '文法ー読解' }, { key: 3, title: '聴解' }];
  }

  componentDidMount() {
    LessonActionCreator.getLessonInfo(this.params.id);
    LessonActionCreator.getLessonDetail(this.params.id, () => {});
    LessonActionCreator.getResultLuyenDe(this.params.id);
  }

  onPressChooseCategory = (item) => () => {
    const { category } = this.state;
    if (category) {
      category.map((val) => {
        val.isChoose = val.id === item.id;
        this.setState({ dataVideo: [] });
        if (item.id === 0) {
          let value = { typeCategory: 'question', ...this.params, routes: this.routes };
          NavigationService.navigate(ScreenNames.TestIntensiveTopicScreen, value);
        } else if (item.id === 1) {
          NavigationService.navigate(ScreenNames.ListVideoCorrectScreen);
        } else {
          let value = { typeCategory: 'result', nameHeader: 'Xem lại bài làm', ...this.params, routes: this.routes };
          NavigationService.navigate(ScreenNames.TestIntensiveTopicScreen, value);
        }
        return val;
      });
      this.setState({ category });
    }
  };

  render() {
    const { category } = this.state;
    return (
      <View style={styles.container}>
        <Header left={true} text={this.params?.name} titleStyle={styles.titleStyle} headerStyle={styles.headerStyle} />
        <View style={styles.container}>
          <View style={{ ...styles.wrapperTime, marginVertical: 15, justifyContent: 'space-around' }}>
            <Result name={'clock'} textTime={Lang.intensive.textTime} result={`1h30'`} />
            <Result name={'flag-checkered'} textTime={Lang.intensive.textScorePass} result={this.params?.pass_marks} />
          </View>
          <View style={{ ...styles.wrapperTime, justifyContent: 'space-between', paddingHorizontal: 10 }}>
            {category.map((item, i) => {
              return (
                <TouchableOpacity style={{ ...styles.categoryStyle, borderWidth: item.isChoose ? 1.5 : 0 }} key={i} onPress={this.onPressChooseCategory(item)}>
                  <FastImage source={item.icon} style={styles.icon} resizeMode={FastImage.resizeMode.contain} />
                  <BaseText style={styles.title}>{item.title}</BaseText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerStyle: {
    backgroundColor: Colors.white100,
    shadowColor: '#777',
    shadowOffset: { x: 5, y: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 7,
    paddingTop: 20 * Dimension.scale
  },
  titleStyle: {
    fontSize: 16,
    fontWeight: '500'
  },
  wrapperTime: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  circle: {
    width: 4 * Dimension.scale,
    height: 4 * Dimension.scale,
    borderRadius: 3 * Dimension.scale,
    marginRight: 10,
    marginTop: 5 * Dimension.scale,
    backgroundColor: '#C4C4C4'
  },
  titleTime: {
    fontSize: 13 * Dimension.scale,
    fontWeight: '100',
    paddingLeft: 5
  },
  categoryStyle: {
    width: Dimension.widthParent / 3.5,
    height: Dimension.widthParent / 3.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.violet,
    backgroundColor: Colors.white100,
    borderRadius: 18,
    shadowColor: '#333',
    shadowOffset: { x: 2, y: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5
  },
  icon: {
    width: 47 * Dimension.scale,
    height: 47 * Dimension.scale,
    marginBottom: 5 * Dimension.scale
  },
  title: {
    fontSize: 10 * Dimension.scale,
    fontWeight: '400',
    color: Colors.violet
  }
});

export default CategoryScreen;
