import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import Header from 'common/components/base/Header';
import React, { PureComponent } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import NavigationService from 'common/services/NavigationService';
import CourseActionCreator from 'states/redux/actionCreators/CourseActionCreator';
import Dimension from 'common/helpers/Dimension';
import ItemOddCourse from './containers/ItemOddCourse';
import HomeActionCreator from 'states/redux/actionCreators/HomeActionCreator';

class BuyCourseScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listCombo: [],
      listSingle: [],
      loading: true,
      ownedCourse: []
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentWillUnmount() {
    clearTimeout(this.timeScrollHeader);
  }

  getData = async () => {
    this.setState({ loading: true });
    CourseActionCreator.getListCombo(() => this.setState({ loading: false }));
  };

  onBackPress = () => {
    NavigationService.pop();
  };

  updateData = () => {
    HomeActionCreator.getHomeLesson();
  };

  renderAllCourse = (item, index) => {
    return (
      <View key={index}>
        <View>
          <BaseText style={styles.textTitle}>{Lang.saleLesson.text_odd_coures}</BaseText>
          <FlatList data={this.props.listSingle} renderItem={this.renderItem} keyExtractor={this.keyExtractor} />
          <BaseText style={{ ...styles.textTitle, marginTop: 10 }}>{Lang.saleLesson.text_combo_coures}</BaseText>
          <FlatList data={this.props.listCombo} renderItem={this.renderItem} keyExtractor={this.keyExtractor} />
        </View>
      </View>
    );
  };

  renderItem = ({ item }) => {
    return <ItemOddCourse item={item} updateData={this.updateData} />;
  };

  keyExtractor = (item, index) => item.id.toString();

  render() {
    const { loading } = this.state;
    return (
      <Container statusBarColor={Resource.colors.white100} backgroundColor={Resource.colors.white100} barStyle="dark-content">
        <Header
          left
          onBackPress={this.onBackPress}
          text={Lang.homeScreen.text_all_course}
          headerStyle={styles.headerStyle}
          titleStyle={styles.titleStyle}
          titleArea={styles.areaHeaderText}
          colorBackButton={Resource.colors.black1}
          onScrollTopHeader={this.onBackPress}
        />
        <View style={styles.content}>
          <ScrollView contentContainerStyle={styles.containerStyle} refreshControl={<RefreshControl refreshing={loading} onRefresh={this.getData} />}>
            {this.renderAllCourse()}
          </ScrollView>
        </View>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listCombo: state.courseReducer.listCombo,
    listSingle: state.courseReducer.listSingle
  };
};

export default connect(mapStateToProps)(BuyCourseScreen);

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: Resource.colors.white100,
    paddingHorizontal: 10 * Dimension.scale,
    paddingVertical: 5 * Dimension.scale
  },
  titleStyle: {
    color: Resource.colors.black1,
    fontStyle: 'italic'
  },
  textTitle: {
    fontSize: 18,
    marginLeft: 20,
    color: Resource.colors.black1,
    marginBottom: 15,
    fontWeight: '400'
  },
  content: {
    flex: 1,
    backgroundColor: Resource.colors.white100
  },
  containerStyle: {
    paddingVertical: 7
  },
  textTitleCombo: {
    marginTop: 10,
    fontSize: 18,
    marginLeft: 20,
    color: Resource.colors.greenColorApp,
    marginBottom: 15,
    fontWeight: 'bold'
  },
  textComboDes: {
    fontSize: 16,
    marginLeft: 20,
    color: Resource.colors.redDescripton,
    marginBottom: 20,
    fontWeight: '500'
  },
  areaHeaderText: {
    alignItems: 'flex-start'
  }
});
