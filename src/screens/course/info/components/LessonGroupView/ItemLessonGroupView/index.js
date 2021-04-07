import Colors from 'assets/Colors';
import BaseButton from 'common/components/base/BaseButton';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import ListLessonView from './ListLessonView';

export default class ItemLessonGroupView extends React.Component {
  constructor(props) {
    super(props);
    this.hasNewText = props.item.name.indexOf('*new') >= 0;
  }

  onPress = () => {
    const { item } = this.props;
    this.props.onPressShowLesson(item);
  };

  render() {
    const { item, isStillTime, textLesson } = this.props;
    let alignItems = textLesson ? 'flex-start' : 'center';
    let paddingLeft = textLesson ? 15 : 0;
    return (
      <View style={styles.container}>
        <BaseButton style={{ ...styles.button, alignItems, paddingLeft }} onPress={this.onPress}>
          <View style={{ flexDirection: 'row' }}>
            <BaseText style={styles.nameStyle}>{item.name?.split('*new')?.join('')}</BaseText>
            {this.hasNewText ? (
              <View style={styles.viewNew}>
                <BaseText style={styles.newStyle}>{'new'} </BaseText>
              </View>
            ) : null}
          </View>
        </BaseButton>
        <ListLessonView item={item} owned={this.props.owned} onPressDetailLesson={this.props.onPressDetailLesson} isStillTime={isStillTime} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    marginVertical: 7,
    marginHorizontal: 2,
    borderWidth: 0.5,
    borderColor: '#eee',
    borderRadius: 5 * Dimension.scale,
    backgroundColor: Colors.white100,
    shadowColor: 'grey',
    shadowOffset: { x: 2, y: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3
  },
  button: {
    minHeight: 35 * Dimension.scale,
    justifyContent: 'center',
    alignItems: 'center'
    // flexDirection: 'row'
  },
  nameStyle: {
    fontSize: 12 * Dimension.scale,
    fontWeight: 'bold',
    color: Colors.greenColorApp
  },
  viewNew: {
    paddingHorizontal: 3,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 10
  },
  newStyle: {
    color: 'white'
  }
});
