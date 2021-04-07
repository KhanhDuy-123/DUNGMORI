import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import React, { Component } from 'react';
import { FlatList, Modal, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';

export default class ModalChooseSpec extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataList: [],
      sectionSelected: {}
    };
    this.index = 0;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.dataList !== this.props.dataList) {
      let dataList = nextProps.dataList.map((e) => {
        e.choose = false;
        return e;
      });
      this.setState({ dataList: dataList });
    }
    return nextState !== this.state;
  }

  componentWillUnmount() {
    clearTimeout(this.timeScroll);
  }

  showModal = (section) => {
    let dataList = this.state.dataList;
    let sectionSelected = {};
    for (let i = 0; i <= dataList.length; i++) {
      if (!dataList[i]) continue;
      if (dataList[i].id == section.id) {
        this.index = i;
        dataList[i].choose = true;
        sectionSelected = dataList[i];
      } else {
        dataList[i].choose = false;
      }
    }
    this.setState({ visible: true, dataList, sectionSelected });
  };

  hideModal = () => {
    this.setState({ visible: false });
  };

  onPressChoose = (params) => () => {
    let sectionSelected = {};
    let dataList = this.state.dataList.map((e) => {
      if (e.name == params.name) {
        e.choose = true;
        sectionSelected = e;
      } else {
        e.choose = false;
      }
      return e;
    });
    this.setState({ dataList, sectionSelected });
  };

  onScrollToLastItem = () => {
    if (this.index == this.state.dataList.length - 1) {
      this.timeScroll = setTimeout(() => {
        this.FlatList.scrollToEnd({ animated: true });
      }, 200);
    }
  };

  renderItem = ({ item }) => {
    let color = '#000000';
    return (
      <TouchableOpacity style={styles.button} onPress={this.onPressChoose(item)}>
        <BaseText style={{ ...styles.textUnChooseItem, color }}>{item.name}</BaseText>
        {item.choose ? (
          <Fontisto name="radio-btn-active" size={20} color={Resource.colors.greenColorApp} />
        ) : (
          <Fontisto name="radio-btn-passive" size={20} color="grey" />
        )}
      </TouchableOpacity>
    );
  };

  onPressSave = (item) => () => {
    this.props.onPressSave(item);
  };

  render() {
    return (
      <Modal transparent={true} visible={this.state.visible}>
        <StatusBar backgroundColor={'rgba(0, 0, 0, 0.7)'} />
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.header}>
              <BaseText style={styles.textParent}>
                {' '}
                <BaseText style={styles.textTitle}>{Lang.chooseLession.text_gif}</BaseText>{' '}
                <BaseText style={styles.textContent}>{Lang.chooseLession.text_spec}</BaseText>{' '}
              </BaseText>
            </View>
            <View style={{ flex: 1 }}>
              <FlatList
                ref={(refs) => (this.FlatList = refs)}
                data={this.state.dataList}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
                extraData={this.state}
                contentContainerStyle={{ paddingTop: 10 }}
                onContentSizeChange={this.onScrollToLastItem}
              />
            </View>
            <View style={styles.areaButton}>
              <TouchableOpacity style={styles.buttonChooseLater} onPress={this.hideModal}>
                <BaseText style={{ color: '#000000', fontWeight: '500', fontSize: 15 }}>{Lang.chooseLession.text_button_later}</BaseText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonChoose} onPress={this.onPressSave(this.state.sectionSelected)}>
                <BaseText style={{ color: '#FFFFFF', fontWeight: '500', fontSize: 15 }}>{Lang.chooseLession.text_button_choose}</BaseText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  keyExtractor = (item, index) => index.toString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  content: {
    width: 250 * Dimension.scale,
    height: 270 * Dimension.scale,
    backgroundColor: '#FFFFFF',
    borderRadius: 15
  },
  header: {
    width: '100%',
    height: '22%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  textContent: {
    fontWeight: 'bold',
    fontSize: 15
  },
  textTitle: {
    fontSize: 15
  },
  textParent: {
    textAlign: 'center'
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 40 * Dimension.scale
  },
  textUnChooseItem: {
    fontSize: 15
    // color: '#000000'
  },
  areaButton: {
    height: 40 * Dimension.scale,
    width: '100%',
    marginBottom: -1,
    flexDirection: 'row'
  },
  buttonChooseLater: {
    flex: 1,
    borderTopWidth: 0.7,
    borderTopColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 15,
    backgroundColor: '#FFFFFF'
  },
  buttonChoose: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Resource.colors.greenColorApp,
    borderBottomRightRadius: 15
  }
});
