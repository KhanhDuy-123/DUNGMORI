import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import Container from 'common/components/base/Container';
import Header from 'common/components/base/Header';
import Resource from 'assets/Resource';
import ItemTeacher from './containers/ItemTeacher';
import Fetch from 'common/helpers/Fetch';
import Const from 'consts/Const';
import LoadingModal from 'common/components/base/LoadingModal';

export default class NewfeedScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listTeacher: []
    };
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    LoadingModal.show();
    const teacher = await Fetch.get(Const.API.TEACHER.GET_LIST_TEACHER);
    LoadingModal.hide();
    if (teacher.status === Fetch.Status.SUCCESS) {
      this.setState({
        listTeacher: teacher.data
      });
    }
  }

  render() {
    var { listTeacher } = this.state;
    return (
      <Container>
        <Header text="NewFeed" />
        <View style={styles.container}>
          <FlatList keyExtractor={this.keyExtractor} data={listTeacher} renderItem={this.renderItem} />
        </View>
      </Container>
    );
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, index }) => {
    return <ItemTeacher item={item} />;
  };
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: Resource.colors.white100
  },
  titleStyle: {
    color: Resource.colors.greenColorApp
  },
  container: {
    backgroundColor: 'white'
  }
});
