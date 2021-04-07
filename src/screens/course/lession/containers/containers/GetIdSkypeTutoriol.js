import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import Container from 'common/components/base/Container';
import Header from 'common/components/base/Header';
import Dimension from 'common/helpers/Dimension';
import React, { PureComponent } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import NavigationService from 'common/services/NavigationService';
import FastImage from 'react-native-fast-image';

const width = Dimension.widthParent;
class GetIdSkypeTutoriol extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [{ id: 0, image: Resource.images.imTutoriol1 }, { id: 1, image: Resource.images.imTutoriol2 }, { id: 2, image: Resource.images.imTutoriol3 }]
    };
  }

  onPressBack = () => {
    if (this.props.navigation.state.params.backShowModal) {
      this.props.navigation.state.params.backShowModal();
    }
    NavigationService.pop();
  };

  render() {
    return (
      <Container>
        <Header left text={Lang.flashcard.hint_tutorial} titleArea={styles.titleArea} titleStyle={styles.titleStyle} onBackPress={this.onPressBack} />
        <ScrollView>
          <View style={styles.container}>
            {this.state.data.map((item) => {
              return <FastImage key={item.id} source={item.image} style={styles.image} resizeMode={FastImage.resizeMode.stretch} />;
            })}
          </View>
        </ScrollView>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  titleArea: {
    alignItems: 'flex-start'
  },
  titleStyle: {
    fontStyle: 'italic'
  },
  container: {
    flex: 1,
    backgroundColor: '#E8ECEF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10
  },
  image: {
    width: width - 50,
    height: width + 50,
    marginTop: 10
  }
});
export default GetIdSkypeTutoriol;
