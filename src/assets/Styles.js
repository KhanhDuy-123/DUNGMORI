import { StyleSheet } from 'react-native';
import Colors from './Colors';

const Styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  flexRow: {
    flexDirection: 'row'
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  border: {
    borderWidth: 0.7,
    borderColor: Colors.border
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  shadow: {
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    margin: 10,
    shadowOffset: { width: 1, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5
  }
});

export default Styles;
