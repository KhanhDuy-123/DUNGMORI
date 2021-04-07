import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import ModalWebView from 'common/components/base/ModalWebView';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import Dimension from 'common/helpers/Dimension';
const width = Dimension.widthParent;

export default class BankTransferVn extends React.Component {
  constructor(props) {
    super(props);
    this.course = [
      `${Lang.detailLesson.text_name_key_course} Kaiwa – ${Lang.detailLesson.text_name_code_course} 18`,
      `${Lang.detailLesson.text_name_key_course} EJU – ${Lang.detailLesson.text_name_code_course} 15`,
      `${Lang.detailLesson.text_name_key_course} N4 – ${Lang.detailLesson.text_name_code_course} 02`,
      `${Lang.detailLesson.text_name_key_course} N3 – ${Lang.detailLesson.text_name_code_course} 03`,
      `${Lang.detailLesson.text_name_key_course} N2 – ${Lang.detailLesson.text_name_code_course} 07`,
      `${Lang.detailLesson.text_name_key_course} N1 – ${Lang.detailLesson.text_name_code_course} 11`,
      `Combo N4+N3 – ${Lang.detailLesson.text_name_code_course} 05`,
      `Combo N3+N2 – ${Lang.detailLesson.text_name_code_course} 08`,
      `Combo N4+N3+N2 – ${Lang.detailLesson.text_name_code_course} 09`,
      `Combo N2+N1 – ${Lang.detailLesson.text_name_code_course} 12`,
      `Combo N3+N2+N1 – ${Lang.detailLesson.text_name_code_course} 13`,
      `Combo N4+N3+N2+N1 – ${Lang.detailLesson.text_name_code_course} 14`
    ];
    this.arrInfoBank = [
      {
        title: Lang.buyCourse.text_bank_account_name_2
      },
      {
        content: Lang.buyCourse.text_name_bank_2
      },
      {
        title: Lang.buyCourse.text_bank_account_title,
        content: Lang.buyCourse.text_bank_account_2
      }
    ];
  }

  onPressLink = (url) => () => {
    ModalWebView.show(url);
  };

  render() {
    const { course, arrInfoBank } = this;
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <View style={styles.viewIntro}>
          <View style={styles.viewTitle}>
            <Octicons style={styles.iconDot} name={'primitive-dot'} size={12} color={Resource.colors.greenColorApp} />
            <BaseText style={styles.textTitle}>{Lang.buyCourse.text_info_bank} :</BaseText>
          </View>
          {arrInfoBank.map((item, index) => {
            return (
              <BaseText key={index} style={styles.textSumary}>
                {item.title}
                {item.title && item.content ? ': ' : ''}
                <BaseText style={{ ...styles.textbol, marginLeft: 7 }}>{item.content}</BaseText>{' '}
              </BaseText>
            );
          })}
          <View style={styles.viewTitle}>
            <Octicons style={styles.iconDot} name={'primitive-dot'} size={12} color={Resource.colors.greenColorApp} />
            <BaseText style={styles.textTitle}>{Lang.buyCourse.text_account_transfer_details} :</BaseText>
          </View>
          <BaseText style={styles.textbol}>{Lang.buyCourse.text_details}</BaseText>
          <BaseText style={styles.textSumary}>{Lang.buyCourse.text_exam}</BaseText>
          <BaseText style={styles.textNote}>{Lang.buyCourse.text_note}</BaseText>
          <BaseText style={styles.textSumary}>{Lang.buyCourse.text_title_attention}</BaseText>
          {this.props.showContent ? null : (
            <View style={styles.listCourse}>
              {course.map((item, index) => {
                return (
                  <BaseText key={index} style={styles.textlistCourse}>
                    {item}
                  </BaseText>
                );
              })}
            </View>
          )}
          <BaseText style={styles.textSumary}>
            {Lang.buyCourse.text_after_purchase}
            <BaseText style={[styles.textSumary, styles.textLink]} onPress={this.onPressLink('https://www.facebook.com/dungmori/')}>
              {'https://www.facebook.com/dungmori/'}
            </BaseText>
          </BaseText>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 25,
    paddingHorizontal: 20
  },
  viewIntro: {},
  textIntro: {
    fontSize: 13,
    lineHeight: 25,
    color: Resource.colors.black1
  },
  textIntros: {
    fontSize: 13,
    fontStyle: 'italic',
    color: Resource.colors.red900
  },
  viewTitle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textSumary: {
    fontSize: 13,
    lineHeight: 25,
    color: Resource.colors.black1
  },
  textSumaryAttention: {
    marginTop: 20,
    fontSize: 12,
    color: Resource.colors.red900
  },
  iconDot: {
    marginRight: 7
  },
  textTitle: {
    fontSize: 13,
    color: Resource.colors.black1
  },
  textbol: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 20,
    color: Resource.colors.black1
  },
  listCourse: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    justifyContent: 'space-between',
    backgroundColor: Resource.colors.blueGrey50
  },
  textlistCourse: {
    width: width / 2 - 30,
    fontSize: 10,
    lineHeight: 28,
    color: Resource.colors.black1
  },
  viewNote: {
    flexDirection: 'row',
    backgroundColor: 'green',
    marginTop: 5
  },
  textNote: {
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 3,
    marginBottom: 3,
    color: Resource.colors.red900
  },
  textMarginTop: {
    marginTop: 10
  },
  textLink: {
    color: 'green'
  }
});
