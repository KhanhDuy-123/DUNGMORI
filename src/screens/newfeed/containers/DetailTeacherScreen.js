import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import Header from 'common/components/base/Header';
import LoadingModal from 'common/components/base/LoadingModal';
import Fetch from 'common/helpers/Fetch';
import React, { PureComponent } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import HTML from 'react-native-render-html';
import YouTube from 'react-native-youtube';
import Const from 'consts/Const';
import Configs from 'utils/Configs';

const { width } = Dimensions.get('window');
export default class DetailTeacherScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listInfo: []
    };
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    var { data } = this.props.navigation.state.params;
    LoadingModal.show();
    const teacher = await Fetch.get(Const.API.TEACHER.GET_INFO_TEACHER, { id: data.id });
    LoadingModal.hide();
    if (teacher.status === Fetch.Status.SUCCESS) {
      this.setState({
        listInfo: teacher.data
      });
    }
  }

  render() {
    const imageTeacher = Const.RESOURCE_URL.TEACHER.DEFAULT_DETAIL;
    const { listInfo } = this.state;
    return (
      <Container>
        <Header left text="Teacher" />
        <ScrollView style={styles.container}>
          <BaseText style={styles.titleAvata}>{listInfo.name}</BaseText>
          <HTML
            baseFontStyle={{ fontSize: 12 }}
            style={styles.textInfo}
            html={listInfo.description}
            ignoredStyles={['font-family']}
            imagesMaxWidth={Dimensions.get('window').width}
          />
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            style={styles.imagesPost}
            source={{ uri: imageTeacher + listInfo.avartar_detail }}
          />
          <HTML
            style={styles.textInfoStory}
            html={listInfo.story_description}
            ignoredStyles={['font-family']}
            imagesMaxWidth={Dimensions.get('window').width}
          />
          <YouTube
            videoId={'a1Nbt0bsfpE'}
            origin={'http://www.youtube.com'}
            play
            fullscreen={false}
            loop={false}
            style={{ alignSelf: 'stretch', height: 215 }}
          />
          <View style={styles.viewLesson}>
            <BaseText style={styles.textLesson}>
              Xem thu bai giang cua <BaseText style={styles.tetxTeach}>{listInfo.name}</BaseText>
            </BaseText>
          </View>
          <View style={styles.viewComment}>
            <BaseText style={styles.textLesson}>binh luon</BaseText>
          </View>
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  titleAvata: {
    fontWeight: '600',
    marginBottom: 10,
    color: Resource.colors.greenColorApp,
    fontSize: 16,
    textAlign: 'center'
  },
  textInfo: {
    marginTop: 20,
    fontSize: 13
  },
  imagesPost: {
    width: '100%',
    height: 500
  },
  textInfoStory: {
    marginTop: 15,
    fontSize: 13,
    backgroundColor: Resource.colors.blueGrey50
  },
  viewLesson: {
    marginTop: 15,
    paddingVertical: 10
  },
  textLesson: {
    fontSize: 16,
    fontWeight: '500',
    color: Resource.colors.black1,
    textAlign: 'center'
  },
  tetxTeach: {
    fontWeight: '500',
    marginBottom: 10,
    fontSize: 16,
    color: Resource.colors.greenColorApp
  },
  viewComment: {
    marginTop: 20
  }
});
