import Colors from 'assets/Colors';
import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import NavigationService from 'common/services/NavigationService';
import ScreenNames from 'consts/ScreenName';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { Advertisement, BlogsNew } from 'screens/course/containers';
import ModalViewTeacherInfo from 'screens/course/teachers/ModalViewTeacherInfo';
import TeacherCollaborate from 'screens/course/teachers/TeacherCollaborate';

class DailyActivitiesView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onPressGoAllBlogs = () => NavigationService.navigate(ScreenNames.BlogScreen);
  onPressNavigateTeacher = () => NavigationService.navigate(ScreenNames.TeacherScreen);
  onPressShowTeacherInfo = (item, pageX, pageY) => {
    this.ModalViewTeacherInfo.showModal(item, pageX, pageY);
  };

  onLayout = ({ nativeEvent }) => {
    this.props.onSetHeightScreenTab(nativeEvent.layout.height, 1);
  };

  render() {
    const { advertisement, listTeacher, listBlog } = this.props;
    return (
      <View style={styles.container} onLayout={this.onLayout}>
        <View>
          <TouchableOpacity style={styles.viewJapan} onPress={this.onPressGoAllBlogs}>
            <BaseText style={{ ...styles.textTitle, marginTop: 0, marginBottom: 10 }}>{Lang.homeScreen.text_japan_in_day}</BaseText>
            <View style={styles.viewMore}>
              <BaseText style={styles.textNew}>{Lang.homeScreen.text_new_blog}</BaseText>
            </View>
          </TouchableOpacity>
          <BlogsNew listBlog={listBlog} />
        </View>
        <BaseText style={{ ...styles.textTitle, marginTop: 30, marginBottom: 10 }}>{Lang.homeScreen.text_endow}</BaseText>
        <Advertisement advertisement={advertisement} />
        <View>
          <TouchableOpacity style={styles.viewJapan} onPress={this.onPressNavigateTeacher}>
            <BaseText style={{ ...styles.textTitle, marginTop: 0, marginBottom: 0 }}>{Lang.homeScreen.text_teacher}</BaseText>
            <View style={styles.viewMore}>
              <BaseText style={styles.textNew}>{Lang.homeScreen.text_new_blog}</BaseText>
            </View>
          </TouchableOpacity>
          <TeacherCollaborate onPressShowInfo={this.onPressShowTeacherInfo} listTeacher={listTeacher} />
        </View>
        <ModalViewTeacherInfo ref={(refs) => (this.ModalViewTeacherInfo = refs)} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: 'white'
  },
  viewJapan: {
    flexDirection: 'row',
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  textTitle: {
    fontSize: 14 * Dimension.scale,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 15
  },
  textNew: {
    fontSize: 8 * Dimension.scale,
    color: Colors.white100,
    marginHorizontal: 7
  },
  viewNew: {
    backgroundColor: 'red',
    borderRadius: 10,
    marginLeft: 10,
    justifyContent: 'center',
    height: 20
  },
  viewMore: {
    paddingVertical: 3,
    borderRadius: 15,
    backgroundColor: Colors.greenColorApp,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    shadowColor: '#222',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1
  }
});
const mapStateToProps = (state) => ({
  listBlog: state.blogReducer.listBlog,
  advertisement: state.advertimentReducer.advertiment,
  listTeacher: state.teacherReducer.listTeacher
});
export default connect(mapStateToProps)(DailyActivitiesView);
