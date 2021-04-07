import Colors from 'assets/Colors';
import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseEmpty from 'common/components/base/BaseEmpty';
import Header from 'common/components/base/Header';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import NavigationService from 'common/services/NavigationService';
import AppConst from 'consts/AppConst';
import DatabaseConst from 'consts/DatabaseConst';
import moment from 'moment';
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { TabBar, TabView } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import CourseController from 'realm/controllers/CourseController';
import LessonController from 'realm/controllers/LessonController';
import LessonGroupController from 'realm/controllers/LessonGroupController';
import VideoController from 'realm/controllers/VideoController';
import Realms from 'realm/Realms';
import RNFetchBlob from 'rn-fetch-blob';
import ListLessonGroupOffline from './containers/ListLessonGroupOffline';

class CourseOfflineScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourse: [],
      index: 0,
      routes: [
        { id: 4, key: 'N4' },
        { id: 3, key: 'N3' },
        { id: 16, key: 'N2' },
        { id: 17, key: 'N1' },
        { id: 9, key: 'EJUTOAN' },
        { id: 8, key: 'EJUTN' },
        { id: 10, key: 'EJUXHTH' },
        { id: 21, key: 'KAIWA' },
        { id: 25, key: 'KAIWASOCAP' },
        { id: 26, key: 'KAIWATRUNGCAP' }
      ],
      showCheck: true
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentWillUnmount() {
    Realms.close();
  }

  getData = async () => {
    try {
      // Delete all couse expired
      let allCourse = await CourseController.getAll();
      allCourse = allCourse.map((item) => {
        return {
          name: item?.name,
          id: item.id,
          expiredDate: item.expiredDate
        };
      });

      const onSortData = (data) => {
        data.sort(function(a, b) {
          return a.sort - b.sort;
        });
      };

      // Get all group
      let allGroup = await LessonGroupController.getAll();
      if (allGroup?.length > 0) {
        allGroup = allGroup.map((item) => {
          return {
            name: item?.name,
            id: item.id,
            courseId: item.course?.id,
            courseName: item.course?.name,
            sort: item.sort
          };
        });
        onSortData(allGroup);
      }

      // Get all lesson
      let allLesson = await LessonController.getAll();
      allLesson = allLesson.map((item) => {
        return {
          name: item?.name,
          id: item.id,
          groupId: item.group?.id,
          courseId: item.course?.id,
          sort: item.sort
        };
      });
      onSortData(allLesson);

      // Get all Video
      let allVideo = await VideoController.getAll();
      allVideo = allVideo.map((item) => {
        return {
          id: item.id,
          downloadPath: item.downloadPath,
          lessonId: item.lessonId,
          isDownloadFinish: item.isDownloadFinish
        };
      });

      // Convert object
      allVideo = allVideo.filter((val) => val.downloadPath !== null);
      allGroup = allGroup.map((item) => {
        item.lessons = [];
        for (let i = 0; i < allLesson.length; i += 1) {
          for (let j = 0; j < allVideo.length; j += 1) {
            if (item.id === allLesson[i].groupId && allLesson[i].id === allVideo[j].lessonId) {
              item.lessons.push({ ...allLesson[i], isFinish: allVideo[j].isDownloadFinish });
              break;
            }
          }
        }
        return item;
      });
      allCourse = allCourse.map((item) => {
        if (this.props.listCourse) {
          this.props.listCourse.map((val) => {
            if (val.id === item.id) {
              let data = {
                id: item.id,
                expiredDate: val.course_expired_day
              };
              CourseController.add({ ...data }, true);
            }
          });
        }
        item.groups = [];
        for (let i = 0; i < allGroup.length; i += 1) {
          if (item.id === allGroup[i].courseId) item.groups.push(allGroup[i]);
        }
        return item;
      });
      // Delete video when expried
      const dateFormat = 'YYYY-MM-DD';
      allCourse.map((val) => {
        allLesson.map(async (value) => {
          const { user } = this.props;
          let expiredDate = moment(val.expiredDate).format(dateFormat);
          if (moment().format(dateFormat) > expiredDate && value.courseId === val.id) {
            allCourse = allCourse.filter((k) => k.id !== value.courseId);
            if (value.courseId === val.id) {
              this.unlinkVideoOffline(allVideo, value);
            }
            this.deleteVideoOffline(val);
          } else {
            this.props.listCourse.map(async (item) => {
              if (user.name && item.id === val.id && !item.course_expired_day) {
                allCourse = allCourse.filter((k) => k.id !== item.id);
                if (value.courseId === item.id) {
                  this.unlinkVideoOffline(allVideo, value);
                }
                this.deleteVideoOffline(val);
              }
            });
          }
        });
      });

      this.setState({ allCourse });
    } catch (err) {
      Funcs.log(err);
      this.setState({ allCourse: [] });
    }
  };

  unlinkVideoOffline = (allVideo, value) => {
    allVideo.map((content) => {
      if (content.lessonId === value.id) {
        let deleteVideo = {
          id: content.id,
          downloadPath: null,
          isDownloadFinish: null
        };
        let path = DatabaseConst.VIDEO_PATH + content.downloadPath;
        RNFetchBlob.fs.unlink(path);
        VideoController.add({ ...deleteVideo }, true);
      }
    });
  };

  deleteVideoOffline = async (val) => {
    await LessonController.deleteBy('course.id', val.id);
    await LessonGroupController.deleteBy('course.id', val.id);
    await CourseController.delete(val.id);
  };

  onBackPress = () => NavigationService.pop();

  renderScene = ({ route, jumpTo }) => {
    const { allCourse } = this.state;
    const data = allCourse.find((item) => item?.id === route.id);
    if (data?.groups?.length > 0) {
      return <ListLessonGroupOffline data={data} />;
    } else {
      return <BaseEmpty text={Lang.flashcard.hint_empty_video_offline(route.key)} />;
    }
  };

  renderIcon = ({ route, focused }) => {
    return (
      <FastImage
        source={focused ? Resource.images[`${route.key}a`] : Resource.images[`${route.key}b`]}
        style={{ ...styles.iconStyle }}
        resizeMode={FastImage.resizeMode.contain}
      />
    );
  };

  onIndexChange = (index) => {
    this.setState({ index });
  };

  onPressNextPageLeft = () => {
    const { index } = this.state;
    this.setState({ index: index === 0 ? 0 : index - 1 });
  };
  onPressNextPageRight = () => {
    const { index, routes } = this.state;
    this.setState({ index: index === routes.length - 1 ? routes.length - 1 : index + 1 });
  };

  render() {
    return (
      <View style={styles.container}>
        <Header left onBackPress={this.onBackPress} text={Lang.profile.text_video_download} titleStyle={styles.titleStyle} headerStyle={styles.headerStyle} />
        <View style={styles.wrapper}>
          <TouchableOpacity onPress={this.onPressNextPageLeft} style={[styles.wrapperArrow, { left: 2 }]}>
            <Icon name="ios-arrow-back" size={20} color={Colors.greenColorApp} />
          </TouchableOpacity>
          <TabView
            navigationState={this.state}
            renderScene={this.renderScene}
            lazy={true}
            lazyPreloadDistance={0}
            swipeEnabled={true}
            renderTabBar={(props) => (
              <TabBar
                {...props}
                scrollEnabled={true}
                style={styles.viewHeader}
                contentContainerStyle={styles.contentContainerStyle}
                indicatorStyle={styles.indicatorStyle}
                tabStyle={styles.tabStyle}
                renderIcon={this.renderIcon}
              />
            )}
            onIndexChange={this.onIndexChange}
          />
          <TouchableOpacity onPress={this.onPressNextPageRight} style={[styles.wrapperArrow, { alignItems: 'flex-end' }]}>
            <Icon name="ios-arrow-forward" size={20} color={Colors.greenColorApp} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Resource.colors.backgroundColor
  },
  headerStyle: {
    backgroundColor: Resource.colors.white100,
    height: AppConst.IS_IPHONEX ? 80 * Dimension.scale : 60 * Dimension.scale,
    paddingTop: AppConst.IS_IPHONEX ? 30 : 20
  },
  titleStyle: {
    color: Resource.colors.black1,
    fontSize: 13 * Dimension.scale
  },
  viewHeader: {
    height: 100,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35
  },
  iconStyle: {
    width: 150 * Dimension.scale,
    height: 25 * Dimension.scale
  },
  tabStyle: {
    width: Dimension.widthParent / 2
  },
  contentContainerStyle: {
    marginTop: 15 * Dimension.scale
  },
  indicatorStyle: {
    width: 0,
    height: 0
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row'
  },
  wrapperArrow: {
    width: 25 * Dimension.scale,
    height: 40 * Dimension.scale,
    padding: 5,
    justifyContent: 'center',
    position: 'absolute',
    top: 15 * Dimension.scale,
    right: 2,
    zIndex: 1000
  }
});
const mapStateToProps = (state) => ({
  user: state.userReducer.user,
  listCourse: state.courseReducer.listCourse
});
export default connect(mapStateToProps)(CourseOfflineScreen);
