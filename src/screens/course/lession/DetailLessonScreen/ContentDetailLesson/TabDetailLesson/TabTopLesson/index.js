import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseKeyboardListener from 'common/components/base/BaseKeyboardListener';
import Dimension from 'common/helpers/Dimension';
import { getBottomSpace } from 'common/helpers/IPhoneXHelper';
import EventService from 'common/services/EventService';
import Const from 'consts/Const';
import React from 'react';
import { Animated, Platform, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { TabBar, TabView } from 'react-native-tab-view';
import { connect } from 'react-redux';
import CommentLesson from '../../../../containers/containers/CommentLesson';
import DocumentLesson from './DocumentLesson';
import TestLesson from './TestLesson';

const width = Dimension.widthParent;
const wrapWidth = width - 30;

class TabTopLesson extends BaseKeyboardListener {
  constructor(props) {
    super(props);
    const nameTab = props.lessonCondition?.checkRenderTab;
    const typeNotify = props.screenProps.typeNotify;
    const params = props.screenProps.params.item;
    this.index = 0;
    this.getIndex = 0;
    this.routes = [
      { key: 'Document', title: Lang.chooseLession.text_title_document },
      { key: 'Test', title: Lang.chooseLession.text_title_test },
      { key: 'Comment', title: Lang.chooseLession.text_title_comment }
    ];
    if (nameTab == Const.LESSON_TYPE.DOCUMENT) {
      this.routes = [{ key: 'Test', title: Lang.chooseLession.text_title_test }, { key: 'Comment', title: Lang.chooseLession.text_title_comment }];
    } else if (nameTab == Const.LESSON_TYPE.MULTI_CHOISE_QUESTION) {
      this.routes = [{ key: 'Document', title: Lang.chooseLession.text_title_document }, { key: 'Comment', title: Lang.chooseLession.text_title_comment }];
    }
    if (typeNotify && this.routes.length == 2) {
      this.index = 1;
      this.getIndex = this.index + 1;
    } else if (typeNotify && this.routes.length == 3) {
      if (params.table_name == 'kaiwa') {
        if (params.lessonId) {
          this.index = 1;
        } else {
          this.index = 2;
        }
      } else {
        this.index = 2;
      }
      this.getIndex = this.index + 1;
    }
    this.state = {
      index: this.index,
      routes: this.routes,
      showTabBar: true
    };
    this.widthMove = 0;
    let totalWidth = this.routes.length * 2;
    this.widthAnimated = new Animated.Value(wrapWidth / totalWidth - 20);
    this.dataReply = null;
    this.refresh = false;
  }

  componentDidMount() {
    super.componentDidMount();
    const typeNotify = this.props.screenProps.typeNotify;
    if (typeNotify) {
      this.onMoveIndicator();
    }
    EventService.add(Const.EVENT.PRESS_NOTIFY_GO_TO_LESSON, (params) => {
      this.dataReply = params;
      this.index = this.state.routes.length - 1;
      this.getIndex = this.index == 0 ? 0 : this.index + 1;
      this.refresh = true;
      this.setState({ index: this.index }, this.onMoveIndicator);
    });
  }

  componentWillMount() {
    EventService.remove(Const.EVENT.PRESS_NOTIFY_GO_TO_LESSON);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.lessonCondition?.checkRenderTab !== this.props.lessonCondition?.checkRenderTab) {
      const nameTab = nextProps.lessonCondition.checkRenderTab;
      const typeNotify = nextProps.screenProps.typeNotify;
      const params = nextProps.screenProps.params.item;
      this.index = 0;
      this.getIndex = 0;
      this.routes = [
        { key: 'Document', title: Lang.chooseLession.text_title_document },
        { key: 'Test', title: Lang.chooseLession.text_title_test },
        { key: 'Comment', title: Lang.chooseLession.text_title_comment }
      ];
      if (nameTab == Const.LESSON_TYPE.DOCUMENT) {
        this.routes = [{ key: 'Test', title: Lang.chooseLession.text_title_test }, { key: 'Comment', title: Lang.chooseLession.text_title_comment }];
      } else if (nameTab == Const.LESSON_TYPE.MULTI_CHOISE_QUESTION) {
        this.routes = [{ key: 'Document', title: Lang.chooseLession.text_title_document }, { key: 'Comment', title: Lang.chooseLession.text_title_comment }];
      }
      if (typeNotify && this.routes.length == 2) {
        this.index = 1;
        this.getIndex = this.index + 1;
      } else if (typeNotify && this.routes.length == 3) {
        if (params.table_name == 'kaiwa') {
          if (params.lessonId) {
            this.index = 1;
          } else {
            this.index = 2;
          }
        } else {
          this.index = 2;
        }
        this.getIndex = this.index + 1;
      }
      this.setState({
        index: this.index,
        routes: this.routes
      });
    }
    return nextState !== this.state;
  }

  keyboardDidShow = () => {
    this.setState({ showTabBar: false });
  };

  keyboardDidHide = () => {
    this.setState({ showTabBar: true });
  };

  onChangTab = (index) => {
    this.getIndex = index == 0 ? 0 : index + 1;
    this.setState({ index });
    this.onMoveIndicator();
  };

  onMoveIndicator = () => {
    let totalWidth = this.routes.length * 2;
    for (var i = 1; i <= totalWidth; i++) {
      if (this.getIndex == 0) {
        this.widthMove = 1;
        break;
      } else {
        if (i / this.getIndex == 2) {
          this.widthMove = i - 1;
          break;
        }
      }
    }

    Animated.timing(this.widthAnimated, {
      toValue: this.widthMove * (wrapWidth / totalWidth) - 20,
      duration: 200,
      useNativeDriver: true
    }).start();
  };

  onPressIgnore = () => {
    this.props.screenProps.onPressIgnore;
  };

  renderScene = ({ route, jumpTo }) => {
    const screenProps = this.props.screenProps;
    switch (route.key) {
      case 'Document': {
        return <DocumentLesson jumpTo={jumpTo} screenProps={screenProps} />;
      }
      case 'Test': {
        return <TestLesson jumpTo={jumpTo} screenProps={screenProps} onPressIgnore={this.onPressIgnore} />;
      }
      case 'Comment': {
        return <CommentLesson screenProps={screenProps} reply={this.dataReply} refresh={this.refresh} />;
      }
    }
  };

  renderIcon = ({ route, focused }) => {
    return (
      <FastImage
        source={!focused ? Resource.images[`im${route.key}a`] : Resource.images[`im${route.key}b`]}
        style={styles.iconStyle}
        resizeMode={FastImage.resizeMode.contain}
      />
    );
  };

  renderTabBar = (props) => {
    const { showTabBar } = this.state;
    if (!showTabBar) return null;
    return (
      <TabBar
        activeColor="black"
        getLabelText={({ route }) => route.title}
        labelStyle={styles.labelStyle}
        inactiveColor="black"
        {...props}
        lazy={true}
        style={styles.styleTabBar}
        indicatorStyle={styles.indicatorStyle}
        upperCaseLabel={false}
        pressColor="#FFFFFF"
        contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
        renderIcon={this.renderIcon}
      />
    );
  };

  render() {
    return (
      <TabView
        navigationState={this.state}
        tabBarPosition="bottom"
        onIndexChange={this.onChangTab}
        renderScene={this.renderScene}
        lazy={true}
        swipeEnabled={false}
        keyboardDismissMode="none"
        renderTabBar={this.renderTabBar}
        style={{ backgroundColor: 'white' }}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  lessonCondition: state.lessonReducer.lessonCondition
});

export default connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(TabTopLesson);

const styles = StyleSheet.create({
  styleTabBar: {
    backgroundColor: '#F5F5F5',
    height: Platform.OS === 'ios' ? getBottomSpace() + (Dimension.isIPad ? 55 * Dimension.scale : 35 * Dimension.scale) : 45 * Dimension.scale,
    width,
    shadowColor: '#F5F5F5',
    elevation: 0
  },
  labelStyle: {
    color: 'rgba(51, 51, 51, 0.8)',
    fontSize: 9 * Dimension.scale
  },
  iconStyle: {
    width: 17 * Dimension.scale,
    height: 17 * Dimension.scale,
    marginTop: 3
  },
  indicatorStyle: {
    width: 0,
    height: 0
  }
});
