import React, { PureComponent } from 'react';
import BaseText from './BaseText';
import { StyleSheet } from 'react-native';

export default class TextHightLightLink extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.typeLink = null;
    this.contentLink = null;
    this.link = '';
  }

  onPressDirect = () => {
    const { link, typeLink, contentLink } = this.props;
    this.props.onPressDirectLink(link, typeLink, contentLink);
  };

  render() {
    const { link } = this.props;
    return (
      <BaseText style={{ ...styles.textLink, ...this.props.styles }} onPress={this.onPressDirect}>
        {link}
      </BaseText>
    );
  }
}

const styles = StyleSheet.create({
  textLink: {
    textDecorationLine: 'underline',
    color: 'white'
  }
});
