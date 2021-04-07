import Resource from 'assets/Resource';
import InputComment from 'screens/components/comment/InputComment';
import ListComment from 'screens/components/comment/ListComment';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import Funcs from 'common/helpers/Funcs';

var id = '';
class CommentLesson extends Component {
  constructor(props) {
    super(props);
    const { params, typeNotify, dataReply } = props.screenProps;
    const { reply } = this.props;
    try {
      if (typeNotify) {
        if (params.item.table_name == 'kaiwa') {
          if (params.item.lessonId) {
            id = params.item.lessonId;
          } else {
            id = params.item.table_id;
          }
        } else {
          id = params.item.table_id;
        }
      } else {
        id = params.item.id;
      }
    } catch (error) {}

    this.data = dataReply ? dataReply : reply ? reply.data : null;
    try {
      this.data = JSON.parse(this.data);
    } catch (error) {
      Funcs.log(error);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.refresh !== this.props.refresh) {
      this.data = nextProps.screenProps.dataReply ? nextProps.screenProps.dataReply : nextProps.reply ? nextProps.reply.data : null;
      try {
        this.data = JSON.parse(this.data);
      } catch (error) {
        Funcs.log(error);
      }
    }
    return true;
  }

  onScrollToComment = () => {};

  render() {
    const { onFocusInputComment = () => {}, onBlurInputComment = () => {} } = this.props.screenProps;
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <ListComment objectId={id} type={'lesson'} onScrollToComment={this.onScrollToComment} dataReply={this.data} refresh={this.props.refresh} />
        </View>

        {this.props.showInput && (
          <InputComment objectId={id} type={'lesson'} onFocusInputComment={onFocusInputComment} onBlurInputComment={onBlurInputComment} />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  showInput: state.inputCommentReducer.showInput
});
export default connect(
  mapStateToProps,
  null
)(CommentLesson);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Resource.colors.white100
  }
});
