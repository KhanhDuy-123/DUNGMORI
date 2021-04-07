import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import Header from 'common/components/base/Header';
import LoadingModal from 'common/components/base/LoadingModal';
import PhotoSelect from 'common/components/photo/PhotoSelect';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React, { PureComponent } from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, UIManager, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import NavigationService from 'common/services/NavigationService';
import { onUpdateUser } from 'states/redux/actions';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import Time from 'common/helpers/Time';
import InfoUser from './containers/InfoUser';
import ItemContentUser from './containers/ItemContentUser';
const height = Dimension.heightParent;
const width = Dimension.widthParent;

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
class MyProfileScreen extends PureComponent {
  state = {
    data: [
      {
        title: Lang.profile.text_email,
        content: this.props.user && this.props.user.email ? this.props.user.email : null
      },
      {
        title: Lang.profile.text_number_phone,
        content: this.props.user && this.props.user.phone ? this.props.user.phone : null
      },
      {
        title: Lang.profile.text_gender,
        content: this.props.user && this.props.user.gender ? this.props.user.gender : null
      },
      {
        title: Lang.profile.text_adress,
        content: this.props.user && this.props.user.address ? this.props.user.address : null
      }
    ],
    country: [{ id: 230, name: Lang.profile.text_vietnam }, { id: 107, name: Lang.profile.text_japan }, { id: 1, name: Lang.profile.text_other }],
    avatar: [],
    showHeader: false
  };

  componentDidUpdate(prev) {
    if (prev.user != this.props.user) {
      this.setState({
        data: [
          {
            title: Lang.profile.text_email,
            content: this.props.user && this.props.user.email ? this.props.user.email : null
          },
          {
            title: Lang.profile.text_number_phone,
            content: this.props.user && this.props.user.phone ? this.props.user.phone : null
          },
          {
            title: Lang.profile.text_gender,
            content: this.props.user && this.props.user.gender ? this.props.user.gender : null
          },
          {
            title: Lang.profile.text_adress,
            content: this.props.user && this.props.user.address ? this.props.user.address : null
          }
        ]
      });
    }
  }

  onPressPhoto = () => {
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    this.PhotoSelected.show();
    this.setState({ showHeader: !this.state.showHeader });
  };

  onPressEditInfo = () => {
    const { user } = this.props;
    NavigationService.navigate(ScreenNames.EditInfoUserScreen, { user });
  };

  showContry = () => {
    const { user } = this.props;
    let nameCountry = this.state.country.find((item) => {
      if (user.country != null) {
        if (user.country == item.id) {
          return item.name;
        }
      }
    });

    let country = nameCountry && nameCountry.name ? nameCountry.name : null;
    return country;
  };

  onPressSendCapture = (photo) => {
    let avatarUser = {
      uri: photo.uri,
      name: 'image',
      type: photo.type
    };

    this.uploadAvatar(avatarUser);
    this.PhotoSelected.hide();
  };

  onPressPhotoSelected = (image) => {
    this.setState({ avatar: image });
  };

  onPressClose = () => {
    this.PhotoSelected.hide();
    this.setState({ showHeader: false });
  };

  onPressAgree = () => {
    const { avatar } = this.state;
    let uri = avatar && avatar.length > 0 && avatar[0].uri;
    let type = avatar && avatar.length > 0 && avatar[0].type;
    let avatarUser = {
      uri,
      name: 'image',
      type
    };

    this.uploadAvatar(avatarUser);
  };

  uploadAvatar = async (avatarUser) => {
    LoadingModal.show();
    let res = await Fetch.postForm(Const.API.USER.CHANGE_AVATAR, { image: avatarUser }, true);
    if (res.status === Fetch.Status.SUCCESS) {
      await Funcs.delay(500);
      LoadingModal.hide();
      this.setState({ showHeader: false });
      this.PhotoSelected.hide();
      this.props.onUpdateUser({ ...this.props.user, avatar: res.data.avatar });
    }
  };

  renderHeader() {
    if (!this.state.showHeader) {
      return (
        <Header
          left
          onBackPress={() => NavigationService.pop()}
          text={Lang.profile.text_info_personal}
          titleArea={{ alignItems: null }}
          colorBackButton={Resource.colors.black1}
          headerStyle={styles.headerStyle}
          titleStyle={styles.titleStyle}
        />
      );
    } else {
      return null;
    }
  }

  render() {
    const { user } = this.props;
    let formatBirth = user && user.birth ? Time.format(user.birth, 'DD-MM-YYYY') : null;
    let avatarImage = Resource.images.icAvatar;
    if (user && user.avatar !== null) {
      avatarImage = {
        uri: Const.RESOURCE_URL.AVATAR.DEFAULT + user.avatar
      };
    }
    return (
      <Container>
        {this.renderHeader()}
        <ScrollView style={styles.container}>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.containAvavta}>
              <View style={styles.viewInfo}>
                <TouchableOpacity style={styles.viewAvata} onPress={this.onPressPhoto}>
                  <FastImage style={styles.avata} source={avatarImage} resizeMode={FastImage.resizeMode.cover} />
                  <View style={styles.editAvata}>
                    <Ionicons style={styles.iconInfo} name="ios-reverse-camera" size={15 * Dimension.scale} color={Resource.colors.white100} />
                  </View>
                </TouchableOpacity>
                <BaseText numberOfLines={2} style={styles.textName}>
                  {user && user.name ? user.name : null}
                </BaseText>
              </View>
              <InfoUser
                title={Lang.profile.text_level}
                content={user && user.japanese_level ? user.japanese_level : null}
                title1={Lang.profile.text_coutry}
                content1={this.showContry()}
                title2={Lang.profile.text_birthday}
                content2={formatBirth}
              />
            </View>
            {this.state.data.map((item, index) => {
              return <ItemContentUser item={item} key={index} />;
            })}
          </View>
          <View style={styles.button}>
            <TouchableOpacity style={styles.buttonEdit} onPress={this.onPressEditInfo}>
              <BaseText style={styles.textbutton}>{Lang.profile.button_edit_info}</BaseText>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <PhotoSelect
          showHeader
          isSingleSelected={true}
          containerHeight={height}
          ref={(ref) => {
            this.PhotoSelected = ref;
          }}
          onPhotoSelected={this.onPressPhotoSelected}
          onCaptureSuccess={this.onPressSendCapture}
          onPressClose={this.onPressClose}
          onPressAgree={this.onPressAgree}
        />
        <View style={styles.viewBottom} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: Resource.colors.white100,
    paddingHorizontal: 5 * Dimension.scale
  },
  titleStyle: {
    color: Resource.colors.black1
  },
  container: {
    flex: 1,
    backgroundColor: Resource.colors.white100
  },
  containAvavta: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: width - 30 * Dimension.scale,
    paddingVertical: 15 * Dimension.scale,
    borderRadius: 10 * Dimension.scale,
    borderColor: '#eee',
    borderWidth: 1,
    shadowColor: Resource.colors.blueGrey600,
    shadowOffset: { width: 0, height: 2 },
    backgroundColor: Resource.colors.white100,
    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 5,
    shadowRadius: Platform.OS === 'ios' ? 5 : 4,
    elevation: Platform.OS === 'ios' ? 0.3 : 5
  },
  viewInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
    paddingRight: 15
  },
  viewAvata: {
    flex: 1,
    alignItems: 'flex-end'
  },
  avata: {
    width: 65 * Dimension.scale,
    aspectRatio: 1 / 1,
    borderRadius: 45 * Dimension.scale
  },
  editAvata: {
    position: 'absolute',
    bottom: -3 * Dimension.scale,
    right: 0 * Dimension.scale,
    backgroundColor: Resource.colors.greenColorApp,
    width: 22 * Dimension.scale,
    aspectRatio: 1 / 1,
    borderRadius: 20 * Dimension.scale,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Resource.colors.white100,
    borderWidth: 2
  },
  containName: {
    flex: 1.5
  },
  textName: {
    flex: 2,
    fontSize: 14 * Dimension.scale,
    color: Resource.colors.black1,
    fontWeight: '600',
    paddingLeft: 15
  },
  pointLike: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center'
  },
  textPointLike: {
    marginLeft: 10,
    color: Resource.colors.black3
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
  },
  buttonEdit: {
    backgroundColor: Resource.colors.greenColorApp,
    paddingVertical: 8 * Dimension.scale,
    paddingHorizontal: 25 * Dimension.scale,
    borderRadius: 20 * Dimension.scale,
    justifyContent: 'center'
  },
  textbutton: {
    color: Resource.colors.white100,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 13 * Dimension.scale
  },
  viewBottom: {
    width,
    height: 50,
    position: 'absolute',
    backgroundColor: 'white',
    bottom: -50
  }
});

const mapStateToProps = (state) => ({
  user: state.userReducer.user
});

const mapDispatchToProps = { onUpdateUser };
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyProfileScreen);
