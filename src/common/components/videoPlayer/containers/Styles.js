import Dimension from 'common/helpers/Dimension';
import { StyleSheet } from 'react-native';
import Resource from '../../../../assets/Resource';

const width = Dimension.widthParent;

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerControllerBottom: {
    width: '100%',
    height: 30 * Dimension.scale,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute',
    bottom: 0
  },
  videoArea: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  backgroundVideo: {
    width: width
  },
  playButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    width: 50 * Dimension.scale,
    height: 50 * Dimension.scale,
    borderRadius: 50,
    flexDirection: 'row'
  },
  controllerBottom: {
    width: '100%',
    height: 30 * Dimension.scale,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  controllerTop: {
    width: '100%',
    height: 30 * Dimension.scale,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute',
    top: 0,
    flexDirection: 'row'
  },
  sliderPlay: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  containerSlider: {
    height: 30,
    width: '100%'
  },
  track: {
    backgroundColor: '#379C3C'
  },
  hintTrackStyle: {
    backgroundColor: 'rgba(135, 135, 135, 255)'
  },
  containerTrack: {
    height: 2.5
  },
  thumb: {
    width: 17 * Dimension.scale,
    height: 17 * Dimension.scale,
    backgroundColor: '#379C3C',
    borderRadius: 20
  },
  Snapcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  textShowTime: {
    fontSize: 10 * Dimension.scale,
    color: Resource.colors.white100
  },
  playBackButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100
  },
  buttonPlayerArea: {
    alignItems: 'center',
    justifyContent: 'space-around',
    width: width - 100,
    flexDirection: 'row',
    position: 'absolute',
    height: 50
  },
  menuTop: {
    width: '100%',
    height: 25 * Dimension.scale,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    top: 0
  },
  buttonChooseMenu: {
    width: '20%',
    height: 30 * Dimension.scale,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  buttonChooseMenu1: {
    width: '20%',
    height: 30 * Dimension.scale,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    right: 10
  },
  textButton: {
    fontSize: 10 * Dimension.scale,
    color: Resource.colors.white100
  },
  buttonchooseItem: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 25 * Dimension.scale
  },
  buttonchooseItem1: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 25 * Dimension.scale,
    flexDirection: 'row'
  },
  chooseDataArea: {
    width: '100%',
    flexDirection: 'row',
    position: 'absolute',
    top: 30 * Dimension.scale,
    zIndex: 1,
    alignSelf: 'flex-start'
  },
  showTimeArea: {
    height: 25 * Dimension.scale,
    width: 50 * Dimension.scale,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5
  },
  iconDrop: {
    width: 12 * Dimension.scale,
    height: 12 * Dimension.scale,
    marginLeft: 5
  },
  thumbSize: {
    width: 50 * Dimension.scale,
    height: 40 * Dimension.scale
  },
  icFullScreen: {
    width: 16 * Dimension.scale,
    height: 16 * Dimension.scale
  },
  icPlayBack: {
    width: 26 * Dimension.scale,
    aspectRatio: 1 / 1.26,
    marginBottom: 3
  },
  icPlay: {
    width: 22 * Dimension.scale,
    height: 22 * Dimension.scale
  },
  areaChooseOption: {
    width: '31%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute'
  },
  viewEmpty: {
    width: '25%',
    height: 5 * Dimension.scale,
    backgroundColor: 'green'
  },
  buttonFullScreenVideo: {
    width: 35 * Dimension.scale,
    height: 30 * Dimension.scale,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  },
  containerVideo: {
    position: 'absolute',
    overflow: 'hidden'
  },
  viewBackground: {
    // width: '100%',
    // height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconDownload: {
    width: 8 * Dimension.scale,
    height: 8 * Dimension.scale
  },
  progressStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5
  },
  wrapperController: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  }
});
