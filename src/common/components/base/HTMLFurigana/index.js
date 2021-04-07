import Colors from 'assets/Colors';
import Funcs from 'common/helpers/Funcs';
import UIConst from 'consts/UIConst';
import UrlConst from 'consts/UrlConst';
import { isNumber } from 'lodash';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Rows, Table } from 'react-native-table-component';
import AutoSizeImage from '../AutoSizeImage';
import BaseText from '../BaseText';
import ButtonVolume from '../ButtonVolume';
import ItemTagA from './ItemTagA';
import ItemTagRuby from './ItemTagRuby';
import ItemTagU from './ItemTagU';

const htmlparser2 = require('htmlparser2');
const Entities = require('html-entities').AllHtmlEntities;

const entities = new Entities();
const debug = false;
const width = UIConst.WIDTH;
const maxWidth = width - 30;

type Props = {
  html: string,
  textFuriganaStyle: object,
  textStyle: object,
  textContainer: object,
  textStyle: object,
  style: object
};

export default class HTMLFurigana extends React.PureComponent<Props> {
  state = {};

  componentDidMount() {
    let { html, showResult } = this.props;
    if (!html) return;
    if (typeof html != 'string') {
      html = html.toString();
    }

    // Remove space
    html = entities.decode(html);
    html = html.replace(new RegExp('&nbsp;', 'g'), '');
    html = html.replace(new RegExp('</u><u>★', 'g'), '★');

    // Remove html comment
    const indexCommnent = html.indexOf('<!--');
    if (indexCommnent >= 0) {
      const index1 = html.indexOf('-->', indexCommnent);
      if (index1 >= 0) html = html.substr(0, indexCommnent) + html.substr(index1 + 3);
    }

    // Find audio 1 {?--?} (Câu hỏi audio)
    let index = html.indexOf('{?');
    while (index > 0) {
      let index1 = html.indexOf('?}', index);
      if (index1 > 0) {
        html = html.substring(0, index) + `<audio show=${showResult ? false : true}>${html.substring(index + 2, index1)}</audio>` + html.substring(index1 + 2);
      }
      index = html.indexOf('{?');
      if (index1 < 0) break;
    }

    // Find audio 2 {!--!} (Câu trả lời audio)
    index = html.indexOf('{!');
    while (index > 0) {
      let index1 = html.indexOf('!}', index);
      if (index1 > 0) {
        html = html.substring(0, index) + `<audio show=${showResult ? true : false}>${html.substring(index + 2, index1)}</audio>` + html.substring(index1 + 2);
      }
      index = html.indexOf('{!');
      if (index1 < 0) break;
    }

    // Find text result {*--*} (Kết quả text)
    index = html.indexOf('{*');
    while (index > 0) {
      let index1 = html.indexOf('*}', index);
      if (index1 > 0) {
        html =
          html.substring(0, index) + `<result show=${showResult ? true : false}>${html.substring(index + 2, index1)}</result>` + html.substring(index1 + 2);
      }
      index = html.indexOf('{*');
      if (index1 < 0) break;
    }

    // Parse HTML
    try {
      var dom = htmlparser2.parseDOM(html);
      if (debug) Funcs.log('dom', dom);

      // Check Japan text

      // Parse html
      let htmlData = [];
      for (var i = 0; i < dom.length; i += 1) {
        let nodeData = this.parseNode(dom[i]);
        htmlData = [...htmlData, ...nodeData];
      }

      // Remove 2 line break or line break
      htmlData = htmlData.filter((item, index1) => {
        // if (item.type === 'text') return item.data.trim().length > 0;
        return item.type !== 'br' || (item.type === 'br' && index1 > 0 && htmlData[index1 - 1].type !== 'br' && index1 < htmlData.length - 1);
      });

      // Update UI
      this.setState({
        htmlData
      });
    } catch (err) {
      Funcs.log(err);
    }
  }

  checkJpText = (str) => {
    var isJpText = str.match(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/);
    return isJpText && isJpText.length > 0;
  };

  connvertTextToData = (text, style, option) => {
    const { disableSaltText } = option;
    // Text empty
    if (text.trim() === '' && !style) {
      return [];
    }

    // Process text
    text = text.replace(new RegExp('  ', 'g'), ' ');
    text = text.replace(new RegExp('  ', 'g'), ' ');
    text = text.replace(new RegExp('\t', 'g'), ' ');
    text = text.replace(new RegExp('\n', 'g'), '');

    // If no has furigana
    if (!this.checkJpText(text)) {
      return [
        {
          type: 'text',
          data: text,
          style
        }
      ];
    }

    // Sub string text to 5 chars
    let htmlData = [];
    if (!disableSaltText) {
      this.saltText = true;
      while (text.length > 5) {
        htmlData.push({
          type: 'text',
          data: text.substr(0, 6),
          style
        });
        text = text.substr(6);
      }
    }
    htmlData.push({
      type: 'text',
      data: text,
      style
    });
    return htmlData;
  };

  parseImageNode = (node) => {
    let data = [];
    let src = node.attribs.src;
    if (src.indexOf('http') < 0) src = `https://dungmori.com/${src}`;
    data.push({
      type: 'br',
      data: ''
    });
    data.push({
      type: 'img',
      data: src
    });
    return data;
  };

  parseRubyNode = (node, style, option) => {
    let htmlData = [];
    // Parse ruby tag
    let rawChildren = node.children;
    let dataNode = null,
      rtNode = null;
    for (var j = 0; j < rawChildren.length; j += 1) {
      let child = rawChildren[j];
      if (child.type === 'text') dataNode = child;
      if (child.type === 'tag' && child.name === 'rt') rtNode = child;
    }

    // Ruby not valid => parse normal
    if (rawChildren.length > 0 && !rtNode) {
      for (var j = 0; j < rawChildren.length; j += 1) {
        let child = rawChildren[j];
        let data = this.parseNode(child, style, option);
        htmlData = [...htmlData, ...data];
      }
      return htmlData;
    }

    // Parse ruby
    if (!dataNode) dataNode = rawChildren[0];
    if (!rtNode) rtNode = rawChildren[2];
    let data = dataNode && this.parseNode(dataNode, style, { ...option, disableSaltText: true });
    let subData = rtNode && this.parseNode(rtNode, style, { ...option, disableSaltText: true });
    data = data?.length > 0 && data[0];
    if (data?.style) style = { ...style, ...data.style };
    // data = data?.data;
    subData = subData && subData.length > 0 && subData[0];
    // subData = subData?.data;
    if (data?.style) style = { ...style, ...data.style };
    htmlData.push({
      type: 'ruby',
      data,
      subData,
      style
    });
    return htmlData;
  };

  parseTableNode = (node, style, option) => {
    let htmlData = [];
    // Parse table tag
    let tableData = [];
    let trNodeList = this.findChildsNodeByTagName(node, 'tr');
    for (var j = 0; j < trNodeList.length; j += 1) {
      let tdNodeList = this.findChildsNodeByTagName(trNodeList[j], 'td');
      if (!tdNodeList || tdNodeList.length < 1) tdNodeList = this.findChildsNodeByTagName(trNodeList[j], 'th');
      let trData = [];
      for (var k = 0; k < tdNodeList.length; k += 1) {
        let tdData = this.parseNode(tdNodeList[k], style, option);
        trData.push(this.renderHTML(tdData, 100));
      }
      tableData.push(trData);
    }
    htmlData.push({
      type: 'table',
      data: tableData
    });
    return htmlData;
  };

  parseANode = (node, style) => {
    let text = this.getTextFromNode(node);
    let htmlData = [
      {
        type: 'a',
        data: text,
        uri: node.attribs.href,
        style
      }
    ];
    return htmlData;
  };

  parseBoldNode = (node, style, option) => {
    let htmlData = [];
    for (var i = 0; i < node.children.length; i += 1) {
      let data = this.parseNode(node.children[i], { ...style, fontWeight: 'bold' }, option);
      htmlData = [...htmlData, ...data];
    }
    return htmlData;
  };

  parsePNode = (node, style, option) => {
    let htmlData = [];
    htmlData.push({
      type: 'br',
      data: ''
    });
    for (var i = 0; i < node.children.length; i += 1) {
      let data = this.parseNode(node.children[i], style, option);
      htmlData = [...htmlData, ...data];
    }
    return htmlData;
  };

  parseUNode = (node, style, option) => {
    const dataU = {
      type: 'u',
      data: [],
      style
    };
    for (var i = 0; i < node.children.length; i += 1) {
      let data = this.parseNode(node.children[i], style, option);
      dataU.data = [...dataU.data, ...data];
    }
    return [dataU];
  };

  parseNode = (node, style = {}, option = {}) => {
    let htmlData = [];
    try {
      // if (debug) Funcs.log('Parse node', node);
      if (node.type === 'text') {
        htmlData = [...htmlData, ...this.connvertTextToData(node.data, style, option)];
      } else if (node.type === 'tag' && node.name === 'br') {
        htmlData.push({ type: 'br', data: '' });
      } else if (node.type === 'tag' && node.name === 'a') {
        htmlData = [...htmlData, ...this.parseANode(node, style, option)];
      } else if (node.type === 'tag' && node.name === 'u') {
        const dataUList = this.parseUNode(node, style, option);
        htmlData = [...htmlData, ...dataUList];

        // Check tag u
        // Nếu có 2 tag u lồng nhau thì sẽ bỏ đi tag con
        for (let i = 0; i < htmlData.length; i += 1) {
          if (htmlData[i].type === 'u') {
            for (let j = 0; j < htmlData[i].data.length; j += 1) {
              if (htmlData[i].data[j].type === 'u') {
                htmlData[i].data.splice(j, 1, ...htmlData[i].data[j].data);
                j--;
              }
            }
          }
        }
      } else if (node.type === 'tag' && (node.name === 'b' || node.name === 'strong')) {
        htmlData = [...htmlData, ...this.parseBoldNode(node, style, option)];
      } else if (node.type === 'tag' && node.name === 'div') {
        htmlData = [...htmlData, ...this.parsePNode(node, style, option)];
      } else if (node.type === 'tag' && node.name === 'p') {
        htmlData = [...htmlData, ...this.parsePNode(node, style, option)];
      } else if (node.type === 'tag' && node.name === 'img') {
        htmlData = [...htmlData, ...this.parseImageNode(node, style, option)];
      } else if (node.type === 'tag' && node.name === 'ruby') {
        htmlData = [...htmlData, ...this.parseRubyNode(node, style, option)];
      } else if (node.type === 'tag' && node.name === 'table') {
        htmlData = [...htmlData, ...this.parseTableNode(node, style, option)];
      } else if (node.type === 'tag' && (node.name === 'audio' || node.name === 'result')) {
        htmlData.push({ type: node.name, data: this.getTextFromNode(node), show: node.attribs.show === 'true' });
      } else if (node.children && node.children.length > 0) {
        // Get text color, font weight
        let color = null;
        let fontWeight = null;
        let css = node.attribs.style;
        if (css) {
          css = css.split(';');
          css = css.filter((item) => item.trim().length > 0);
          for (var i = 0; i < css.length; i += 1) {
            let itemCss = css[i];
            itemCss = itemCss.split(':');
            const styleName = itemCss[0].trim();
            // Color
            if (styleName === 'color') {
              color = itemCss[1].trim();
            }
            if (styleName === 'font-weight') {
              fontWeight = itemCss[1].trim();
              fontWeight = fontWeight.replace('px', '');
              const isValidFontWeight = isNumber(fontWeight) || fontWeight === 'normal' || fontWeight === 'bold';
              if (!isValidFontWeight) {
                fontWeight = 'normal';
              }
            }
          }
        }
        if (color) style = { ...style, color };
        if (fontWeight === 'inherit') fontWeight = null;
        if (fontWeight) style = { ...style, fontWeight };

        // Parse node has more child
        for (var i = 0; i < node.children.length; i += 1) {
          let data = this.parseNode(node.children[i], style, option);
          htmlData = [...htmlData, ...data];
        }
      }
    } catch (err) {
      Funcs.log(err);
    }

    // Update data
    htmlData = htmlData.filter((item, index1) => {
      // Remove space behind br
      if (item.type === 'text' && item.data.trim() === '' && index1 > 0 && htmlData[index1 - 1].type === 'br' && index1 < htmlData.length - 1) {
        return false;
      }
      return true;
    });

    return htmlData;
  };

  getCSSColor = (node) => {
    let color = null;
    let css = node.attribs.style;
    if (css) {
      css = css.split(';');
      css = css.filter((item) => item.trim().length > 0);
      for (var i = 0; i < css.length; i += 1) {
        let itemCss = css[i];
        itemCss = itemCss.split(':');
        if (itemCss[0].trim() === 'color') {
          color = itemCss[1].trim();
        }
      }
    }
    return color;
  };

  findChildsNodeByTagName = (node, name) => {
    if (node.type === 'tag' && node.name === name) {
      return [node];
    }
    let child = [];
    for (var i = 0; node.children && i < node.children.length; i += 1) {
      let newarr = this.findChildsNodeByTagName(node.children[i], name);
      child = [...child, ...newarr];
    }
    return child;
  };

  getTextFromNode = (node) => {
    if ((node.wrapper === 'Text' || node.type === 'text') && node.data && (!node.children || node.children.length < 1)) {
      let data = node.data ? node.data : '';
      // data = data.trim();
      return data;
    }
    let text = '';
    for (var i = 0; node.children && i < node.children.length; i += 1) {
      let obj = this.getTextFromNode(node.children[i]);
      if (typeof obj === 'object') {
        return obj;
      } else {
        text += this.getTextFromNode(node.children[i]);
      }
    }
    return text;
  };

  renderTagU = (item, index, saltText) => {
    return <ItemTagU key={'u_' + index} renderHTMLTagItem={this.renderHTMLTagItem} saltText={saltText} item={item} style={this.props.textStyle} />;
  };

  renderTagRuby = (item, index) => {
    return (
      <ItemTagRuby
        item={item}
        key={'ruby_' + index}
        textFuriganaStyle={{ ...styles.furiganaText, ...this.props.textFuriganaStyle }}
        textStyle={{ ...styles.normalText, ...this.props.textStyle }}
        renderHTMLTagItem={this.renderHTMLTagItem}
      />
    );
  };

  renderHTMLTagItem = (item, index, saltText) => {
    // Render furigana
    const { textStyle } = this.props;
    if (item.type === 'ruby') return this.renderTagRuby(item, index);

    // Render tag table
    if (item.type === 'table') {
      return (
        <View key={'table_' + (Date.now() + '_' + Funcs.random(1000, 20000))} style={styles.tableContainer}>
          <Table borderStyle={styles.tableBorder}>
            <Rows data={item.data} textStyle={styles.tableRowText} />
          </Table>
        </View>
      );
    }

    // Render tag u
    if (item.type === 'u') return this.renderTagU(item, index, saltText);

    // Render tag br
    if (item.type === 'br') {
      return <View key={'br_' + index} style={styles.brContainer} />;
    }

    // Render tag img
    if (item.type === 'img') {
      return <AutoSizeImage key={'image_' + index} source={{ uri: item.data }} maxWidth={maxWidth} />;
    }

    // Render tag a
    if (item.type === 'a') {
      return <ItemTagA item={item} key={'a_' + index} textStyle={{ ...styles.normalText, ...this.props.textStyle }} />;
    }

    // Render tag audio
    if (item.type === 'audio') {
      if (!item.show) return null;
      return (
        <View key={'result_' + index} style={styles.textContainer}>
          <ButtonVolume key={'audio_' + index} linkSound={`${UrlConst.MP3}${item.data}`} style={styles.buttonSound} soundColor={'red'} />
        </View>
      );
    }

    // Result
    const dataIsString = typeof item.data === 'string';
    if (item.type === 'result' && dataIsString) {
      return (
        <View key={'result_' + index} style={[styles.textContainer, this.props.textContainer]}>
          <BaseText style={[styles.normalText, item.style, textStyle]}>{item.show ? `(${item.data})` : `(                  )`}</BaseText>
        </View>
      );
    }
    // Render text

    //TODO loi khi full screen video Khoa hoc N2, liveStream t12, #2 bai hojc livestream
    if (dataIsString) {
      if (saltText) {
        const arr = new Array(item.data.length).fill(1);
        return arr.map((e, i) => (
          <BaseText style={[styles.normalText, item.style, textStyle]} key={'text_salt_' + index + '_' + i}>
            {item.data[i]}
          </BaseText>
        ));
      }
      return (
        <View key={'text_' + index} style={[styles.textContainer, this.props.textContainer]}>
          <BaseText style={[styles.normalText, item.style, textStyle]}>{item.data}</BaseText>
        </View>
      );
    }

    // Else
    return null;
  };

  renderHTML = (htmlData, index) => {
    if (debug) Funcs.log('htmlData', htmlData);
    return (
      <View key={'HTML_' + index} style={[styles.htmlContainer, this.props.style]}>
        {htmlData && htmlData.map((item, i) => this.renderHTMLTagItem(item, i))}
      </View>
    );
  };

  render() {
    let { htmlData } = this.state;
    return this.renderHTML(htmlData, 0);
  }
}

const styles = StyleSheet.create({
  htmlContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  textContainer: {
    minHeight: 25,
    justifyContent: 'flex-end'
  },
  normalText: {
    fontSize: 16
  },
  furiganaText: {
    fontSize: 8
  },
  tableContainer: {
    width: maxWidth
  },
  tableBorder: {
    borderWidth: 1,
    borderColor: Colors.border
  },
  tableRowText: {
    margin: 5,
    fontSize: 14
  },
  brContainer: {
    width: '100%',
    height: 0
  },
  buttonSound: {
    marginHorizontal: 8
  }
});
