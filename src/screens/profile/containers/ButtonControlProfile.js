import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import Dimension from 'common/helpers/Dimension';
import { onCountNotify } from '../../../states/redux/actions/CountNotiAction';

class ButtonControlProfile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  onPress = () => {
    this.props.onPress();
  };

  render() {
    const { totalNotify } = this.props;
    return (
      <TouchableOpacity style={styles.summary} onPress={this.onPress}>
        <FastImage source={this.props.source} style={styles.img} resizeMode={FastImage.resizeMode.contain} />
        <BaseText style={{ ...styles.textInfoUser, ...this.props.textInfoUser }}>{this.props.lang}</BaseText>
        {totalNotify && totalNotify > 0 ? (
          <View style={styles.badge}>
            <BaseText style={styles.textBagde}>{totalNotify}</BaseText>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center'
  },
  textInfoUser: {
    paddingLeft: 15,
    fontSize: 15 * Dimension.scale,
    color: Resource.colors.black1,
    fontWeight: '600'
  },
  img: {
    width: 35 * Dimension.scale,
    aspectRatio: 1 / 1
  },
  badge: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 100,
    marginLeft: 5
  },
  textBagde: {
    color: 'white',
    fontWeight: '600'
  }
});

const mapDispatchToProps = { onCountNotify };
export default connect(
  null,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(ButtonControlProfile);
