import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseEmpty from 'common/components/base/BaseEmpty';
import BaseNoInternet from 'common/components/base/BaseNoInternet';
import Container from 'common/components/base/Container';
import Header from 'common/components/base/Header';
import LoginRequire from 'common/components/base/LoginRequire';
import Dimension from 'common/helpers/Dimension';
import EventService from 'common/services/EventService';
import Const from 'consts/Const';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import NotifyActionCreator from 'states/redux/actionCreators/NotifyActionCreator';
import UserActionCreator from 'states/redux/actionCreators/UserActionCreator';
import AppContextView from 'states/context/views/AppContextView';
import Utils from 'utils/Utils';
import { onCountNotify } from '../../../states/redux/actions/CountNotiAction';
import ItemNotify from './containers/ItemNotify';

class NotifyScreen extends AppContextView {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      page: 1,
      loading: true,
      inforUser: {}
    };
  }

  async componentDidMount() {
    if (Utils.token.length > 0) {
      this.focus = this.props.navigation.addListener('willFocus', this.onResetNotify);
      EventService.add(Const.EVENT.RECIEVE_NOTIFY, (params) => {
        this.onResetNotify();
      });
    }
  }

  componentWillUnmount() {
    if (Utils.token.length > 0) {
      EventService.remove(Const.EVENT.RECIEVE_NOTIFY);
    }
  }

  handleRefresh = () => {
    this.setState({ page: 1, loading: true });
    NotifyActionCreator.getListNotify(1, () => this.setState({ loading: false }), true);
  };

  handleLoadmore = () => {
    if (!this.onMomentumScrollBegin) {
      this.setState({ page: this.state.page + 1, loading: true }, () => {
        NotifyActionCreator.getListNotify(this.state.page, () => this.setState({ loading: false }));
      });
      this.onMomentumScrollBegin = true;
    }
  };

  keyExtractor = (item, index) => item.id.toString();

  onReadNotify = async (item) => {
    if (item.readed == 1) return;
    NotifyActionCreator.updateReadNotify(item.id);
  };

  onResetNotify = async () => {
    this.setState({ page: 1, loading: true }, () => {
      NotifyActionCreator.getListNotify(this.state.page, (data) => {
        this.setState({ loading: false });
        if (data[0]) UserActionCreator.settingReadNotify(data[0].id);
      });
    });
  };

  renderItem = ({ item }) => {
    return <ItemNotify item={item} onReadNotify={this.onReadNotify} inforUser={Utils.user} />;
  };

  renderContent = () => {
    const { loading } = this.state;
    const { listNotify } = this.props;
    if (!loading && listNotify.length == 0) return <BaseEmpty text={Lang.listNotify.text_no_notify} />;
    return (
      <FlatList
        data={listNotify}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        onEndReachedThreshold={0.5}
        onEndReached={this.handleLoadmore}
        refreshing={loading}
        extraData={listNotify}
        onRefresh={this.handleRefresh}
        onMomentumScrollBegin={() => (this.onMomentumScrollBegin = false)}
      />
    );
  };

  render() {
    const { internet = true } = this.context || {};
    const { user } = this.props;
    if (!internet) return <BaseNoInternet />;
    if (!user || !user.id) return <LoginRequire />;
    return (
      <Container backgroundColor={Resource.colors.white100} barStyle={'dark-content'} style={{ backgroundColor: Resource.colors.white100 }}>
        <Header headerStyle={styles.headerStyle} text={Lang.listNotify.text_header} titleStyle={styles.titleStyle} />
        {this.renderContent()}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: Resource.colors.white100
  },
  titleStyle: {
    width: '100%',
    fontSize: 18 * Dimension.scale,
    fontWeight: '600',
    textAlign: 'center'
  },
  activitiStyle: {
    width: Dimension.widthParent,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
  language: state.languageReducer.language,
  listNotify: state.notifyReducer.listNotify
});

const mapDispatchToProps = { onCountNotify };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(NotifyScreen);
