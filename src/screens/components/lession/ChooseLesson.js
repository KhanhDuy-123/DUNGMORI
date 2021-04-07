import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import ContentLesson from './ContentLesson';
export default class ChooseLesson extends Component {
  constructor(props) {
    super(props);
    const { data } = props;
    let dataList = [];
    if (data) {
      dataList = data;
      dataList.map((e) => {
        e.isActive = false;
        return e;
      });
    }
    this.state = {
      dataList,
      itemId: 0
    };
    this.index = 0;
  }

  onPressShowData = (data) => {
    if (data.selected !== 'undefined' && data.selected == 0) {
      this.props.onShowSelecSpecLesson(data);
    } else {
      let dataList = this.state.dataList;
      for (let i = 0; i < dataList.length; i++) {
        let item = { ...dataList[i] };
        if (dataList[i].id == data.id) {
          item.isActive = !item.isActive;
        } else if (dataList[i].id !== data.id && dataList[i].isActive) {
          item.isActive = false;
        }
        item.update = false;
        dataList[i] = item;
      }
      this.setState({ dataList: dataList });
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    let dataList = [];
    if (nextProps.data !== this.props.data) {
      dataList = nextProps.data.map((e) => {
        e.isActive = e.update ? true : false;
        return e;
      });
      this.setState({ dataList });
    }
    return nextState !== this.state;
  }

  renderItem = (item, index) => {
    const { courseId, onNavigateDetailLesson, typeFeature, isStillExpired, headerStyles, parentHeaderStyle, courseName } = this.props;
    return (
      <ContentLesson
        key={item.id}
        courseName={courseName}
        section={item}
        courseId={courseId}
        sectionId={item.id}
        onPressShowData={this.onPressShowData}
        ref={(refs) => (this.ChooseLesson = refs)}
        typeRead={this.props.typeRead}
        onNavigateDetailLesson={onNavigateDetailLesson}
        typeFeature={typeFeature}
        isStillExpired={isStillExpired}
        headerStyles={headerStyles}
        parentHeaderStyle={parentHeaderStyle}
      />
    );
  };

  render() {
    const { dataList } = this.state;
    return <ScrollView removeClippedSubviews={true}>{dataList.map(this.renderItem)}</ScrollView>;
  }
}
