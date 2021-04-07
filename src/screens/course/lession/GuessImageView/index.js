import Lang from 'assets/Lang';
import Container from 'common/components/base/Container';
import Header from 'common/components/base/Header';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import NavigationService from 'common/services/NavigationService';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import ItemGuessImage from './ItemGuessImage';
import ProgressQuestionBar from './ProgressQuestionBar';

class GuessImageView extends Component {
  constructor(props) {
    super(props);
    let listData = props.listQuestions ? props.listQuestions : [];
    listData = listData.map((e) => {
      e.value = Funcs.jsonParse(e.value);
      return e;
    });

    let contentData = [];
    if (listData?.length > 5) {
      contentData = listData?.slice(0, 5);
    } else {
      contentData = listData;
    }
    this.state = {
      data: listData,
      contentData
    };
    this.currentPictureAnswer = null;
    this.videoProgress = 100;
    this.examProgress = 0;
    this.listAnswer = [];
  }

  onSlideComplete = (item, index) => {
    if (this.currentPictureAnswer?.id === item.id) {
      this.listAnswer.push(item);
    }
    this.currentPictureAnswer = item;
    const { data } = this.state;
    let contentData = this.state.contentData;
    contentData = contentData.slice(1, contentData.length);
    for (let i = 0; i < data.length; i++) {
      if (contentData[contentData.length - 1]?.id == data[i].id && data[i + 1]) {
        contentData.push(data[i + 1]);
        break;
      }
    }
    this.setState({ contentData });
  };

  onShowResult = (item) => {
    this.currentPictureAnswer = item;
  };

  onBackPress = () => {
    const { data } = this.state;
    if (!this.currentPictureAnswer) this.examProgress = 0;
    let lastItem = this.listAnswer[this.listAnswer.length - 1];
    let indexLastPicture = data.indexOf(lastItem);
    if (indexLastPicture >= 0) {
      this.examProgress = ((indexLastPicture + 1) / data.length) * 100;
    } else {
      this.examProgress = 0;
    }
    const params = this.props.params;
    if (params.updateProgressLesson) {
      params.updateProgressLesson(this.videoProgress, this.examProgress, params.item.id, params.item.group_id, false, params.item.courseId);
    }
    NavigationService.pop();
  };

  renderItem = (item, index) => {
    return (
      <ItemGuessImage
        onShowResult={this.onShowResult}
        key={item.id}
        item={item}
        index={index}
        dataLength={this.state.contentData.length}
        onSlideComplete={this.onSlideComplete}
      />
    );
  };

  render() {
    let data = [...this.state.contentData].reverse();
    return (
      <Container>
        <Header onBackPress={this.onBackPress} left={true} sizeIcon={26 * Dimension.scale} text={Lang.guessImage.header} />
        <ProgressQuestionBar dataList={this.state.data} pictureAnswer={this.currentPictureAnswer} />
        <View style={styles.container}>{data.map(this.renderItem)}</View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const mapStateToProps = (state) => ({
  listQuestions: state.lessonReducer.listQuestions
});

export default connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(GuessImageView);
