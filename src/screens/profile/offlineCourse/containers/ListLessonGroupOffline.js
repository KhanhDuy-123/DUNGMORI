import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import React, { Component } from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Dimension from 'common/helpers/Dimension';
import ListLessonOffline from './ListLessonOffline';
import LessonGroupController from 'realm/controllers/LessonGroupController';
import LessonController from 'realm/controllers/LessonController';
import RNFetchBlob from 'rn-fetch-blob';
import DatabaseConst from 'consts/DatabaseConst';
import { connect } from 'react-redux';
import VideoController from 'realm/controllers/VideoController';
import DownloadVideoService from 'common/services/DownloadVideoService';

class ListLessonGroupOffline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: props.data.groups
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    let { groups } = this.state;
    // upgrade video offline when cancel download
    if (nextProps.data != this.props.data || nextProps?.stopDownloadVideo != this.props?.stopDownloadVideo) {
      groups = groups.map((value) => {
        let lessons = value.lessons.filter((item) => item.id !== nextProps?.stopDownloadVideo.id);
        return {
          id: value.id,
          name: value.name,
          sort: value.sort,
          lessons
        };
      });
      groups = groups.filter((item) => item.lessons.length > 0);
      this.setState({
        groups: nextProps?.stopDownloadVideo ? groups : nextProps.data.groups
      });
      return;
    }
    const { lessonDownloading } = nextProps;
    if (lessonDownloading !== this.props.lessonDownloading) {
      groups = groups.map((item) => {
        if (lessonDownloading.groupId === item.id) {
          item = { ...item };
          item.lessons = item.lessons.map((item1) => {
            if (lessonDownloading.lessonId === item1.id) {
              item1 = { ...item1, downloadProgress: lessonDownloading.downloadProgress, isFinish: lessonDownloading.downloadProgress === 100 };
            }
            return item1;
          });
        }
        return item;
      });
      this.setState({
        groups
      });
    }
    return this.state != nextState;
  }

  onLongPress = (group) => {
    const { groups } = this.state;
    let dataList = groups.map((item) => {
      item = { ...item };
      item.isShowCheckbox = true;
      item.isChecked = group.id === item.id;
      return item;
    });
    this.setState({ groups: dataList, showBottomButton: true });
  };

  onPressCheck = (group) => {
    const { groups } = this.state;
    let dataList = groups.map((item) => {
      if (group.id === item.id) {
        item = { ...item };
        item.isChecked = !item.isChecked;
      }
      return item;
    });
    this.setState({ groups: dataList });
  };

  onPressShowContent = (group) => {
    let dataList = this.state.groups.map((item) => {
      if (item.isShowContent || group.id === item.id) {
        item = { ...item };
        item.isShowContent = group.id === item.id && !item.isShowContent;
      }
      return item;
    });
    this.setState({ groups: dataList });
  };

  onPressCancel = () => {
    let { groups } = this.state;
    const dataNew = groups.map((item) => {
      item = { ...item };
      item.isShowCheckbox = false;
      item.isChecked = false;
      return item;
    });
    this.setState({ showBottomButton: false, groups: dataNew });
  };

  onPressSelectAll = () => {
    let { groups } = this.state;
    const dataNew = groups.map((item) => {
      item = { ...item };
      item.isShowCheckbox = true;
      item.isChecked = true;
      return item;
    });
    this.setState({ groups: dataNew });
  };

  onPressDelete = () => {
    let { groups } = this.state;
    const checkedGroups = groups.filter((item) => item.isChecked);
    const remainGroups = groups.filter((item) => !item.isChecked);
    Alert.alert(
      '',
      Lang.videoDownload.hint_delete_video,
      [
        {
          text: Lang.popupMenu.text_agree,
          onPress: async () => {
            for (let i = 0; i < checkedGroups.length; i += 1) {
              // Delete data
              await LessonController.deleteBy('group.id', checkedGroups[i].id);
              await LessonGroupController.delete(checkedGroups[i].id);

              // Delete video
              for (let j = 0; j < checkedGroups[i].lessons.length; j += 1) {
                let lesson = checkedGroups[i].lessons[j];
                // Get all Video
                let videoOffline = await VideoController.getBy('lessonId', lesson.id);
                videoOffline = videoOffline.map(async (item) => {
                  let deleteVideo = {
                    id: item.id,
                    downloadPath: null,
                    isDownloadFinish: null
                  };
                  DownloadVideoService.stop({ videoId: item.id });
                  let path = DatabaseConst.VIDEO_PATH + item.downloadPath;
                  RNFetchBlob.fs.unlink(path);
                  VideoController.add({ ...deleteVideo }, true);
                });
              }
            }
            this.setState({ groups: remainGroups, showBottomButton: remainGroups?.length > 0 ? true : false });
          }
        },
        { text: Lang.popupMenu.text_cancel }
      ],
      { cancelable: true }
    );
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => {
    let expiredDate = this.props.data.expiredDate;
    return (
      <View style={{ flex: 1 }}>
        <ListLessonOffline
          item={item}
          expiredDate={expiredDate}
          onLongPress={this.onLongPress}
          onPressCheck={this.onPressCheck}
          onLongPressDelete={this.onLongPressDelete}
          onPressShowContent={this.onPressShowContent}
        />
      </View>
    );
  };

  render() {
    const { groups, showBottomButton } = this.state;
    return (
      <View style={styles.wrapper}>
        <FlatList data={groups} keyExtractor={this.keyExtractor} style={{ paddingTop: 5 }} renderItem={this.renderItem} />
        {showBottomButton ? (
          <View style={styles.viewDel}>
            <TouchableOpacity style={styles.buttonStyle} onPress={this.onPressCancel}>
              <BaseText>{Lang.videoDownload.hint_button_cancel}</BaseText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle} onPress={this.onPressSelectAll}>
              <BaseText>{Lang.videoDownload.hint_button_select_all}</BaseText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle} onPress={this.onPressDelete}>
              <BaseText>{Lang.videoDownload.hint_button_delete}</BaseText>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  lessonDownloading: state.videoDownloadReducer.lessonDownloading,
  stopDownloadVideo: state.videoDownloadReducer.stopDownloadVideo
});

export default connect(mapStateToProps)(ListLessonGroupOffline);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Resource.colors.backgroundColor
  },
  viewDel: {
    height: 40 * Dimension.scale,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: Resource.colors.white100,
    borderTopWidth: 0.5,
    borderTopColor: Resource.colors.grey500
  },
  buttonStyle: {
    paddingVertical: 10,
    paddingHorizontal: 15
  }
});
