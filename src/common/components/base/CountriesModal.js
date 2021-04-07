import React, { PureComponent } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList } from 'react-native';
import CountryItem from './CountryItem';

class CountriesModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  render() {
    return (
      <Modal animationType="fade" transparent={true} visible={this.state.visible}>
        <TouchableOpacity
          activeOpacity={1}
          style={{ backgroundColor: 'rgba(0,0,0,0.3)', flex: 1 }}
          onPress={this.onDismiss}>
          <View style={{ marginHorizontal: 30, marginVertical: 80, backgroundColor: 'white' }}>
            <FlatList data={this.props.countries} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  onDismiss = () => {
    this.setState({ visible: false });
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => <CountryItem onCountryPressed={this.props.onCountryPressed} item={item} />;

  toggleModal = visible => {
    this.setState({ visible });
  };
}

export default CountriesModal;
