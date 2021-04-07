import React, { Component } from 'react';
import { Animated } from 'react-native';
import SemiSurvey from './SemiSurvey';
import FullSurvey from './FullSurvey';
import { connect } from 'react-redux';

class SurveyQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      widthAnimated: 0
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.videoQuestionInfo !== this.props.videoQuestionInfo || nextState !== this.state;
  }

  showSurvey = (surveyQuestion) => {
    this.setState({ visible: true, surveyQuestion }, () => {
      if (this.state.surveyQuestion?.type == 1) this.SurveyHalfScreen?.showSurvey();
      else this.SurveyFullScreen?.showFullSurvey();
    });
  };

  hideSurvey = () => {
    this.setState({ visible: false });
    this.props.onHideSurvey();
  };

  renderSurvey = () => {
    const { surveyQuestion } = this.state;
    if (surveyQuestion.type == 1) {
      return <SemiSurvey videoQuestionInfo={surveyQuestion} onHideSurvey={this.hideSurvey} ref={(refs) => (this.SurveyHalfScreen = refs)} />;
    }
    return (
      <FullSurvey videoQuestionInfo={surveyQuestion} ref={(refs) => (this.SurveyFullScreen = refs)} fullSurvey={true} onHideFullSurvey={this.hideSurvey} />
    );
  };

  render() {
    const { visible } = this.state;
    if (!visible) return null;
    return this.renderSurvey();
  }
}

const mapStateToProps = (state) => ({
  videoQuestionInfo: state.lessonReducer.videoQuestionInfo
});

export default connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(SurveyQuestion);
