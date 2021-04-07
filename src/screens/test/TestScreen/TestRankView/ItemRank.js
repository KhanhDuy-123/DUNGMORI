import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Const from 'consts/Const';

export default class ItemRank extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  checkPass = (course, score1, score2, score3, totalScore) => {
    if (score1 < 19 || score2 < 19 || score3 < 19) return false;
    if (course == 'N5' && totalScore > 80) {
      return true;
    } else if (course == 'N4' && totalScore > 90) {
      return true;
    } else if (course == 'N3' && totalScore > 95) {
      return true;
    } else if (course == 'N2' && totalScore > 90) {
      return true;
    } else if (course == 'N1' && totalScore > 100) {
      return true;
    }
  };

  iconSize = (index) => {
    let size = {
      width: 26,
      height: 26
    };
    if (index == 0) {
      size.width = 30;
      size.height = 30;
    } else if (index == 1) {
      size.width = 26;
      size.height = 26;
    } else {
      size.width = 24;
      size.height = 24;
    }
    return size;
  };

  checkColor = (index) => {
    let color = '#FFFFFF';
    if (index == 0) {
      color = '#F0BEBE';
    } else if (index == 1) {
      color = '#FFFDB8';
    } else if (index == 2) {
      color = '#E9FDBE';
    } else if (index >= 3 && index <= 9) {
      color = '#F9FEF0';
    } else {
      color = '#FFFFFF';
    }
    return color;
  };

  onPressShowResult = () => {
    // this.props.onPressShowResult(this.props.item);
  };

  render() {
    const { item, index } = this.props;
    let topName = item.top;
    if (index === 0) {
      topName = Resource.images.icNo1;
    } else if (index === 1) {
      topName = Resource.images.icNo2;
    } else if (index === 2) {
      topName = Resource.images.icNo3;
    }
    let avtResource = Resource.images.noAvt;
    if (item.avatar) {
      avtResource = { uri: Const.RESOURCE_URL.AVATAR.DEFAULT + item.avatar };
    } else {
      avtResource = Resource.images.noAvt;
    }
    return (
      <View>
        <View style={[styles.wrapper, { backgroundColor: this.checkColor(index) }]}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            {index === 0 || index === 1 || index === 2 ? (
              <FastImage source={topName} style={this.iconSize(index)} resizeMode="contain" />
            ) : (
              <BaseText style={styles.topStyle}>{index + 1}</BaseText>
            )}
          </View>
          <View style={styles.viewName}>
            <FastImage source={avtResource} style={styles.avatarStyle} resizeMode={FastImage.resizeMode.contain} />
            <BaseText style={styles.nameStyle}>{item.user_name}</BaseText>
          </View>
          <BaseText style={styles.pointStyle}>{item.total_score}</BaseText>
          <BaseText style={styles.pointStyle}>{item.course}</BaseText>
          {this.checkPass(item.course, item.score_1, item.score_2, item.score_3, item.total_score) ? (
            <FastImage source={Resource.images.icCheck} style={styles.doneStyle} resizeMode={FastImage.resizeMode.contain} />
          ) : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <FontAwesome name="times" color="red" size={22} />
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  topStyle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13
  },
  viewName: {
    flex: 2.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 5
  },
  avatarStyle: {
    width: 24,
    height: 24,
    borderRadius: 100
  },
  nameStyle: {
    paddingLeft: 7,
    fontSize: 13,
    flex: 4
  },
  pointStyle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13
  },
  doneStyle: {
    flex: 1,
    width: 13,
    height: 13
  },
  iconStyle: {
    width: 26,
    height: 26
  },
  viewMenu: {
    flexDirection: 'row',
    width: Dimension.widthParent,
    justifyContent: 'space-around',
    marginTop: 10
  },
  viewExamInMonth: {
    marginLeft: 20,
    alignSelf: 'flex-start',
    marginTop: 10
  },
  myRank: {
    fontSize: 16,
    color: Resource.colors.red900,
    paddingLeft: 25,
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: 'bold'
  },
  contentMyRank: {
    left: 20,
    width: 125,
    height: 150
  }
});
