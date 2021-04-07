import Images from 'assets/Images';
import Lang from 'assets/Lang';
import Dimension from 'common/helpers/Dimension';
import * as d3 from 'd3';
import React, { Component } from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { G, Line, Path, Rect, Svg, Text } from 'react-native-svg';

const GRAPH_MARGIN = 10;
const GRAPH_BAR_WIDTH = 10;
const colors = {
  axis: 'grey',
  bars: '#15AD13'
};
const AnimatedRect = Animated.createAnimatedComponent(Rect);
export default class BarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.animated = new Animated.Value(0);
  }

  static defaultProps = {
    point: [{ value: 30 }, { value: 60 }, { value: 90 }, { value: 120 }, { value: 150 }, { value: 180 }],
    colorChart: ['#FC8687', '#8486F1', '#FFE8B9']
  };

  componentDidMount() {
    Animated.timing(this.animated, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.out(Easing.back(2))
    }).start();
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.dataChart !== this.props.dataChart) {
      Animated.timing(this.animated, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(2))
      }).start();
    }
    return true;
  }

  render() {
    const { dataChart, multiChart, backgroundBarChart, point, colorChart } = this.props;

    // Dimensions
    const SVGHeight = 200;
    const SVGWidth = dataChart.length > 7 ? dataChart.length * 50 : 300 * Dimension.scale;
    const graphHeight = SVGHeight - 2 * GRAPH_MARGIN;
    const graphWidth = SVGWidth - 2 * GRAPH_MARGIN;
    // X scale point
    const xDomain = dataChart.map((item) => item.label);
    const xRange = [0, graphWidth];
    const x = d3
      .scalePoint()
      .domain(xDomain)
      .range(xRange)
      .padding(1);
    return (
      <View style={styles.container}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <Svg width={SVGWidth} height={SVGHeight}>
            <G y={graphHeight}>
              {/* bars */}
              {dataChart.map((item) => {
                let h = 0;
                let ret = [];
                let pointData = item.value;
                pointData = multiChart ? [pointData[0] + pointData[2] + pointData[1], pointData[0] + pointData[1], pointData[0]] : [pointData[0] * 3];
                for (let z = 0; z < pointData.length; z++) {
                  h = pointData[z];
                  const translateRectY = this.animated.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, (h / 1.3) * -1]
                  });
                  ret.push(
                    <AnimatedRect
                      key={z}
                      x={x(item.label) + 15}
                      y={translateRectY}
                      rx={2.5}
                      width={GRAPH_BAR_WIDTH}
                      height={h / 1.3}
                      fill={multiChart ? colorChart[z] : backgroundBarChart}
                    />
                  );
                }
                return ret;
              })}

              {/* Chèn view */}
              <Path d={'M30,30 L30, 00 L350,0 L350, 30'} fill="white" />

              {/* bottom axis */}
              <Line x1="30" y1="2" x2={graphWidth * 1.2} y2="2" stroke={colors.axis} strokeWidth="0.7" strokeDasharray={8} strokeDashoffset={3} />

              {dataChart.map((item) => (
                <Text key={`label${item.label}`} fill={colors.axis} fontSize="8" fontWeight="100" x={x(item.label) + 20} y="15" textAnchor="middle">
                  {item.label}
                </Text>
              ))}
            </G>
          </Svg>
        </ScrollView>
        <View style={{ width: 40, height: 200, backgroundColor: 'white', position: 'absolute', left: 0 }}>
          <Svg width={SVGWidth} height={SVGHeight}>
            <G y={graphHeight}>
              <Text fill={colors.axis} fontSize="9" fontWeight={'100'} x={30} y={-150} textAnchor="middle">
                {Lang.testScreen.hint_text_point}
              </Text>
              <Line x1="30" y1="2" x2="30" y2={-graphHeight * 0.8} stroke={colors.axis} strokeWidth="0.7" strokeDasharray={8} strokeDashoffset={3} />
              <Line x1="30" y1="2" x2={45} y2="2" stroke={colors.axis} strokeWidth="0.7" strokeDasharray={8} />
              <Text fill={colors.axis} fontSize="9" fontWeight={'100'} x={295 * Dimension.scale} y={15} textAnchor="middle">
                {Lang.intensive.textThreads}
              </Text>
              {point.map((item, index) => (
                <Text key={`value${item.value}`} fill={colors.axis} fontSize="8" fontWeight={'100'} x={10} y={(index + 1) * -22.5} textAnchor="middle">
                  {item.value}
                </Text>
              ))}
            </G>
          </Svg>
        </View>
        {dataChart.length > 7 ? <FastImage source={Images.intensive.icChevron} style={styles.icon} resizeMode={FastImage.resizeMode.contain} /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  icon: {
    width: 20 * Dimension.scale,
    height: 20 * Dimension.scale,
    padding: 10
  }
});
