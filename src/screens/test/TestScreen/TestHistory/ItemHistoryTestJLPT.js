import Colors from 'assets/Colors';
import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import moment from 'moment';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default class ItemHistoryTestJLPT extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPressShowResults = () => {
    this.props.onPressShowResults(this.props.item);
  };

  onPressGoEditInfor = () => {
    this.props.onPressGoEditInfor(this.props.item);
  };

  checkPass = (course, score1, score2, score3, totalScore) => {
    if (score1 < 19 || score2 < 19 || score3 < 19) return false;
    if (course == 'N5' && totalScore >= 80) {
      return true;
    } else if (course == 'N4' && totalScore >= 90) {
      return true;
    } else if (course == 'N3' && totalScore >= 95) {
      return true;
    } else if (course == 'N2' && totalScore >= 90) {
      return true;
    } else if (course == 'N1' && totalScore >= 100) {
      return true;
    }
  };

  renderButtonEditInfor = (pass) => {
    if (!pass) return null;
    return (
      <TouchableOpacity style={styles.buttonView} onPress={this.onPressGoEditInfor}>
        <BaseText style={styles.textButton}>{Lang.try_do_test.text_edit_infor}</BaseText>
      </TouchableOpacity>
    );
  };

  render() {
    const { item } = this.props;
    const dateFormat = moment(item.created_at).format('DD/MM/YYYY HH:mm');
    const checkPass = this.checkPass(item.course_name, item.score_1, item.score_2, item.score_3, item.total_score);
    let pass = '不合格';
    if (checkPass) {
      pass = '合格';
    } else {
      pass = '不合格';
    }
    return (
      <View style={styles.wrapper}>
        <View style={[styles.item, { flex: 0.5 }]}>
          <BaseText style={styles.textContent}>{item.course}</BaseText>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <View style={[styles.item, { flexDirection: 'row', justifyContent: 'center' }]}>
            <BaseText style={styles.textContent}>
              <BaseText style={styles.textPoint}>{item.total_score}</BaseText>
              <BaseText>{`${' '}${pass}`}</BaseText>
            </BaseText>
          </View>
          <TouchableOpacity style={styles.buttonView} onPress={this.onPressShowResults}>
            <BaseText style={styles.textButton}>{Lang.try_do_test.text_view_result}</BaseText>
          </TouchableOpacity>
        </View>
        <View style={styles.item}>
          <BaseText style={styles.textContent}>{dateFormat}</BaseText>
          {/* {this.renderButtonEditInfor(checkPass)} */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20
  },
  topStyle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15
  },
  levelStyle: {
    flex: 1.2,
    textAlign: 'center',
    fontSize: 15
  },
  viewName: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10
  },
  dateStyle: {
    flex: 3,
    fontSize: 15,
    textAlign: 'center'
  },
  avatarStyle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    flex: 1
  },
  nameStyle: {
    paddingLeft: 4,
    fontSize: 12
  },
  textPoint: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  viewTitle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textButton: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600'
  },
  buttonView: {
    borderRadius: 25,
    backgroundColor: Colors.greenColorApp,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    height: 20,
    marginLeft: 5,
    marginTop: 5
  },
  textContent: {
    fontSize: 14
  },
  item: {
    flex: 1,
    alignItems: 'center'
  }
});
