import BaseButton from 'common/components/base/BaseButton';
import BaseText from 'common/components/base/BaseText';
import HTMLFurigana from 'common/components/base/HTMLFurigana';
import DownloadVideoService from 'common/services/DownloadVideoService';
import EncryptFileService from 'common/services/EncryptFileService';
import React, { Component } from 'react';
import { View } from 'react-native';
import fs from 'react-native-fs';
import 'react-native-gesture-handler';
import FacebookService from 'common/services/FacebookService';

const path = `${fs.DocumentDirectoryPath}/videos/test.mp4/`;

export default class DebugScreen extends Component {
  onPress = async () => {
    await EncryptFileService.encryptVideo(path);
  };

  onPressDecode = async () => {
    await EncryptFileService.decryptVideo(path);
  };

  onPressReEncrypt = async () => {
    await EncryptFileService.reEncryptVideo(path);
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <BaseButton
          text={'BUTTON'}
          onPress={() => {
            FacebookService.share('http://dungmori.com', 'link');
          }}
          activeOpacity={0.1}
          style={{ margin: 20 }}
        />
        <HTMLFurigana
          html={`<p>35.&nbsp;&nbsp;②<u>作った人と買う人の<ruby>結<rp>(</rp><rt>むす</rt><rp>)</rp></ruby><u>びつきを大切にする</u>と</u>あるが、この目的はどんなことか。</p>`}

          // html={`5.&nbsp;&nbsp;<ruby>人<rp>(</rp><rt>ひと</rt><rp>)</rp></ruby>は　<strong>&nbsp;</strong><u>　　　</u>　<u>　　　</u>　<u>　</u><u>★　</u>　<u>　　　</u>学</ruby><ruby></ruby>んで<ruby>成長<rt>せいちょう</rt></ruby>する。`}
        />
      </View>
    );
  }
}
