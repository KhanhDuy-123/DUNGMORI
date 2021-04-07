import BaseAnimated from 'common/components/base/BaseAnimated';
import React, { PureComponent } from 'react';
import { Easing, TouchableOpacity } from 'react-native';

export default class Button extends PureComponent {
  render() {
    const center = { justifyContent: 'center', alignItems: 'center' };
    var { onPress, style, containerStyle, children } = this.props;
    return (
      <TouchableOpacity
        {...this.props}
        style={[center, style]}
        activeOpacity={1}
        onPress={() => {
          this.aimated();
          if (onPress) {
            onPress();
          }
        }}>
        <BaseAnimated style={{ ...center, ...containerStyle }} ref={'Animated'} scale={1}>
          {children}
        </BaseAnimated>
      </TouchableOpacity>
    );
  }

  aimated() {
    if (this.props.animatedDisable) return;
    this.refs.Animated.start([
      {
        type: 'scale',
        duration: 30,
        value: 0.8,
        easing: Easing.in(Easing.back())
      },
      {
        type: 'scale',
        duration: 150,
        value: 1,
        easing: Easing.out(Easing.back())
      }
    ]);
  }
}
