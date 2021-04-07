import Resource from 'assets/Resource';
import HTMLFurigana from 'common/components/base/HTMLFurigana';
import PDFViews from 'common/components/base/PDFView';
import Const from 'consts/Const';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

class Document extends React.Component {
  constructor(props) {
    super(props);
    let listDocument = props.listDocument ? [...props.listDocument] : [];
    console.log(listDocument, '#########listDocument');
    let isPDF = false;
    if (listDocument?.length > 0) {
      for (let j = 0; j < listDocument.length; j++) {
        if (listDocument[j].type == Const.LESSON_TYPE.PDF) {
          isPDF = true;
          break;
        }
      }
    }
    this.state = { listDocument, isPDF };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.listDocument !== this.props.listDocument) {
      let listDocument = [...nextProps.listDocument];
      let isPDF = false;
      for (let j = 0; j < listDocument.length; j++) {
        if (listDocument[j].type == Const.LESSON_TYPE.PDF) {
          isPDF = true;
          break;
        }
      }
      this.setState({ listDocument, isPDF });
    }
    return nextState !== this.state;
  }

  render() {
    const { listDocument, isPDF } = this.state;
    if (isPDF) {
      return (
        <View style={{ flex: 1 }}>
          {listDocument.map((item, index) => {
            if (item.type == Const.LESSON_TYPE.PDF) {
              return <PDFViews key={'PDFView_' + index} value={item.value} />;
            }
          })}
        </View>
      );
    } else {
      return (
        <ScrollView style={styles.container} contentContainerStyle={styles.viewContainer} removeClippedSubviews={true}>
          {listDocument.map((item, index) => {
            if (item.type == Const.LESSON_TYPE.DOCUMENT) {
              return <HTMLFurigana key={index} html={item.value} />;
            }
          })}
        </ScrollView>
      );
    }
  }
}

const mapStateToProp = (state) => ({
  listDocument: state.lessonReducer.listDocument
});

export default connect(mapStateToProp)(Document);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: Resource.colors.backgroundColor
  },
  viewContainer: {
    flexGrow: 1,
    paddingTop: 15
  }
});
