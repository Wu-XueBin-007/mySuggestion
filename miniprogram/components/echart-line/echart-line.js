// components/echart-line/echart-line.js
import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

function setOption(chart,datas) {
  // const chart = echarts.init(canvas, null, {
  //   width: width,
  //   height: height,
  //   devicePixelRatio: dpr // new
  // });
  // canvas.setChart(chart);
  var option = {

    color: ["#37A2DA", "#67E0E3", "#9FE6B8"],

    grid: {
      containLabel: true,
      top: 10,
      bottom: 5
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
      splitLine: {
        show: false
      },
      minInterval: 3600*24*1000,
      axisLine: {
        //show: false,
        lineStyle: {
          color: '#506799',
          width: 1
        }
      }
      //data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      // show: false
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
      axisLine: {
        show: false
      }
      // show: false
    },
    series: [{
      name: '油耗(L/km)',
      type: 'line',
      smooth: true,
      data: datas,//[['2019-8-10', 1], ['2019-8-15', 3], ['2019-9-01', 5], ['2019-9-15', 6], ['2019-9-30', 66], ['2019-10-01', 8], ['2019-10-15', 11], ['2019-10-25', 32], ['2019-11-10', 54]],
      //  data: [18, 36, 65, 90, 78, 40, 33],
      areaStyle: {
        color: {
          type: 'liner',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#506799' // 0% 处的颜色
          }, {
            offset: 1, color: '#fff'// 100% 处的颜色
          }],
          global: false // 缺省为 false
        },
        opacity: 0.3,
      },
      lineStyle: {
        color: '#506799',
        width: 1
      }
    }],
    dataZoom: {
      type: 'inside',
      show: true,
      xAxisIndex: [0],
      start: 0,
      end: 100
    }
  };

  chart.setOption(option, true);
  //return chart;
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
      datas:{
        type: Array,
        value: []
      }
  },
  observers: {
    'datas': function (datas) {
      this.init_one(datas)
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    ec: {
      lazyLoad: true
    }
  },
  lifetimes:{
    created() {
      console.log('page is ready')
      this.twoComponent = this.selectComponent('#mychart-dom-line');
    },
    attached() {
      this.init_one(this.data.datas)
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    init_one: function (param) {           //初始化第一个图表
      this.twoComponent.init((canvas, width, height, dpr) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr
        });
        setOption(chart, param)
        this.chart = chart;
        return chart;
      });
    }
  }
})
