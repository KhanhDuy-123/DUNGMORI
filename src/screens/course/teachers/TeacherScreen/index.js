import Lang from 'assets/Lang';
import Container from 'common/components/base/Container';
import Header from 'common/components/base/Header';
import NavigationService from 'common/services/NavigationService';
import React, { Component } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import ModalVideoPresent from '../ModalVideoPresent';
import ModalViewTeacherInfo from '../ModalViewTeacherInfo';
import TeacherCollaborate from '../TeacherCollaborate';
import OfficialTeacher from './OfficialTeacher';
import TeacherSupport from './TeacherSupport';

class TeacherScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onBackPress = () => NavigationService.pop();

  onPressShowTeacherInfo = (item, pageX, pageY) => {
    this.ModalViewTeacherInfo.showModal(item, pageX, pageY);
  };

  onPressViewVideoInfo = (item) => {
    this.ModalVideoPresent.showModal(item);
  };

  render() {
    const { listTeacher } = this.props;
    return (
      <Container>
        <Header left={true} text={Lang.teacher?.text_header} onBackPress={this.onBackPress} />
        <ScrollView>
          <TeacherCollaborate onPressShowInfo={this.onPressShowTeacherInfo} listTeacher={listTeacher} />
          <OfficialTeacher listTeacher={listTeacher} onPressShowInfo={this.onPressShowTeacherInfo} onPressViewVideoInfo={this.onPressViewVideoInfo} />
          <TeacherSupport listTeacher={listTeacher} onPressShowInfo={this.onPressShowTeacherInfo} />
        </ScrollView>
        <ModalViewTeacherInfo ref={(refs) => (this.ModalViewTeacherInfo = refs)} />
        <ModalVideoPresent ref={(refs) => (this.ModalVideoPresent = refs)} />
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  listTeacher: state.teacherReducer.listTeacher
});

export default connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(TeacherScreen);

const styles = StyleSheet.create({
  container: {}
});
