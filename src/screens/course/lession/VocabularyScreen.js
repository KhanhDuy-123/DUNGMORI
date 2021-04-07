import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseButtonOpacity from 'common/components/base/BaseButtonOpacity';
import Container from 'common/components/base/Container';
import Header from 'common/components/base/Header';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import NavigationService from 'common/services/NavigationService';
import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import ScreenNames from 'consts/ScreenName';
import Const from 'consts/Const';
import StorageService from 'common/services/StorageService';

class VocabularyScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      finish: [],
      allFlashCard: []
    };
  }

  async componentDidMount() {
    let { params } = this.props.navigation.state.params;
    const lessonDetail = await Fetch.get(
      Const.API.LESSON.GET_LESSON_DETAIL,
      {
        lessonId: params.item.id
      },
      true
    );
    if (lessonDetail.status === Fetch.Status.SUCCESS) {
      let finish = lessonDetail.data.filter((item) => item.memorized === true);
      let flashcardFinish = {
        lessonId: params.item.id,
        data: finish
      };
      StorageService.save(Const.DATA.FINISH_FLASHCARD, flashcardFinish);
      this.setState({
        finish,
        allFlashCard: lessonDetail.data
      });
    }
  }

  onPressNotBelong = () => {
    let { params } = this.props.navigation.state.params;
    if (params) {
      params.type = Const.TYPE_CARD.UNFINISH;
      NavigationService.replace(ScreenNames.DetailLessonScreen, params);
    }
  };

  onPressBelong = () => {
    let { params } = this.props.navigation.state.params;
    if (params) {
      params.type = Const.TYPE_CARD.FINISH;
      NavigationService.replace(ScreenNames.DetailLessonScreen, params);
    }
  };

  onPressAllVocabulary = () => {
    let { params } = this.props.navigation.state.params;
    if (params) {
      params.type = Const.TYPE_CARD.ALL_VOCABULARY;
      NavigationService.replace(ScreenNames.DetailLessonScreen, params);
    }
  };

  onBackPress = () => {
    const exampleProgress = 100;
    const videoProgress = 100;
    const params = this.props.navigation.state.params.params;
    if (params.updateProgressLesson) {
      params.updateProgressLesson(exampleProgress, videoProgress, params.item.id, params.item.group_id, false, params.item.courseId);
    }
    NavigationService.pop();
  };

  render() {
    const { finish, allFlashCard } = this.state;
    let { courseName } = this.props.navigation.state.params;
    return (
      <Container>
        <Header
          left
          onBackPress={this.onBackPress}
          text={`${Lang.learn.text_cours} ${courseName}`}
          titleArea={{ alignItems: null }}
          colorBackButton={Resource.colors.black1}
          headerStyle={styles.headerStyle}
          titleStyle={styles.titleStyle}
        />
        <View style={styles.container}>
          <BaseButtonOpacity
            disabled={allFlashCard.length - finish.length === 0 ? true : false}
            text={Lang.flashcard.text_button_unfinish}
            socialButtonStyle={[
              styles.button,
              {
                backgroundColor: allFlashCard.length - finish.length === 0 ? Resource.colors.grey500 : Resource.colors.greenColorApp
              }
            ]}
            textStyle={styles.text}
            number={`(${allFlashCard.length - finish.length})`}
            onPress={this.onPressNotBelong}
          />
          <BaseButtonOpacity
            disabled={finish.length === 0 ? true : false}
            text={Lang.flashcard.text_button_finish}
            socialButtonStyle={[styles.button, { backgroundColor: finish.length === 0 ? Resource.colors.grey500 : Resource.colors.greenColorApp }]}
            textStyle={styles.text}
            number={`(${finish.length})`}
            onPress={this.onPressBelong}
          />
          <BaseButtonOpacity
            text={Lang.flashcard.text_button_all_card}
            socialButtonStyle={styles.button}
            textStyle={styles.text}
            number={`(${allFlashCard.length})`}
            onPress={this.onPressAllVocabulary}
          />
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50
  },
  button: {
    backgroundColor: Resource.colors.greenColorApp,
    borderRadius: 10,
    width: 280 * Dimension.scale,
    marginTop: 20
  },
  text: {
    color: Resource.colors.white100,
    fontWeight: '600'
  },
  headerStyle: {
    backgroundColor: Resource.colors.white100,
    paddingHorizontal: 5 * Dimension.scale
  },
  titleStyle: {
    color: Resource.colors.black1,
    fontSize: 16 * Dimension.scale,
    fontStyle: 'italic'
  }
});

export default VocabularyScreen;
