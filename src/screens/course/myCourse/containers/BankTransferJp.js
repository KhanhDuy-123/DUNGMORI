import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import Dimension from 'common/helpers/Dimension';
import BankTransferVn from './BankTransferVn';

const width = Dimension.widthParent;

export default class BankTransferJp extends BankTransferVn {
  render() {
    const { course, arrInfoBank } = this;
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <View style={styles.viewIntro}>
          {this.props.showContent ? null : (
            <BaseText style={styles.textIntro}>
              <BaseText style={styles.textbol}>{Lang.buyCourse.text_purchase_1}: </BaseText>
              {Lang.buyCourse.text_send_money_from_vn}
            </BaseText>
          )}
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
          <BaseText style={[styles.textSumary, styles.textMarginTop]}>
            <BaseText style={styles.textbol}>{Lang.buyCourse.text_purchase_2}: </BaseText>
            {Lang.buyCourse.text_message_to_fanpage}
          </BaseText>
          <BaseText style={[styles.textSumary, styles.textLink]} onPress={this.onPressLink('https://www.facebook.com/Nhatngudungmori/')}>
            {'https://www.facebook.com/Nhatngudungmori/'}
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
    alignItems: 'center',
    paddingVertical: 10
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
