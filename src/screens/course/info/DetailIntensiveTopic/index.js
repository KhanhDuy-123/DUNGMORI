import Colors from 'assets/Colors';
import Header from 'common/components/base/Header';
import Dimension from 'common/helpers/Dimension';
import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import InfoIntensiveTopic from './components/InfoIntensiveTopic';
import BaseText from 'common/components/base/BaseText';
import ListPracticeTopic from './components/ListPracticeTopic';
import ListSynthesisTopic from './components/ListSynthesisTopic';
import Lang from 'assets/Lang';
import NavigationService from 'common/services/NavigationService';
import LessonActionCreator from 'states/redux/actionCreators/LessonActionCreator';
import { connect } from 'react-redux';

class DetailIntensiveTopic extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [{ key: 'first', title: Lang.intensive.textPracticeTopic }, { key: 'second', title: Lang.intensive.textSynthesisTopic }]
    };
    this.params = NavigationService.getParams();
  }

  componentDidMount() {
    LessonActionCreator.getLessonLuyenDe(this.params.id);
  }

  onIndexChange = (index) => {
    this.setState({ index });
  };

  renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'first':
        return <ListPracticeTopic listLDKN={this.props.listLDKN} />;
      case 'second':
        return <ListSynthesisTopic listLDTH={this.props.listLDTH} />;
    }
  };

  renderTabBar = (props) => {
    return (
      <TabBar
        {...props}
        labelStyle={styles.labelStyle}
        indicatorStyle={styles.indicatorStyle}
        style={{ backgroundColor: Colors.white100 }}
        renderLabel={({ route, focused }) => {
          return (
            <View
              style={{
                ...styles.styleTabbar,
                height: focused ? 50 : 40,
                backgroundColor: focused ? Colors.white100 : '#F1F3F6',
                bottom: focused ? 0 : -10
              }}>
              <BaseText
                style={{ color: focused ? Colors.violet : '#9C9C9C', fontSize: focused ? 16 : 14, paddingBottom: 12, fontWeight: focused ? '600' : '500' }}>
                {route.title}
              </BaseText>
            </View>
          );
        }}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Header left={true} text={'Lựa chọn đề N4'} titleStyle={styles.titleStyle} headerStyle={styles.headerStyle} />
        {/* <InfoIntensiveTopic /> */}
        <View style={[styles.container, { marginTop: 10 }]}>
          <TabView
            navigationState={this.state}
            renderScene={this.renderScene}
            initialLayout={Dimension.widthParent}
            renderTabBar={this.renderTabBar}
            onIndexChange={this.onIndexChange}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerStyle: {
    backgroundColor: Colors.white100,
    shadowColor: '#777',
    shadowOffset: { x: 5, y: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 7,
    paddingTop: 15
  },
  titleStyle: {
    fontSize: 16,
    fontWeight: '500'
  },
  indicatorStyle: {
    height: 0
  },
  labelStyle: {
    fontSize: 10 * Dimension.scale,
    fontWeight: 'bold'
  },
  styleTabbar: {
    width: Dimension.widthParent / 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { x: 2, y: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  }
});

const mapStateToProps = (state) => ({
  listLDKN: state.lessonReducer.listLDKN,
  listLDTH: state.lessonReducer.listLDTH
});
export default connect(mapStateToProps)(DetailIntensiveTopic);
