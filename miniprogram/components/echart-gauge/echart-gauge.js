// components/echart-gauge/echart-gauge.js
import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

function setOption(chart,cost,mile) {
  // const chart = echarts.init(canvas, null, {
  //   width: width,
  //   height: height,
  //   devicePixelRatio: dpr // new
  // });
  // canvas.setChart(chart);

  var option = {
    grid:{
      top: 0,
      bottom:0
    },
    series: [
      {
        name: '里程',
        type: 'gauge',
        z: 3,
        min: 0,
        max: 100,
        splitNumber: 5,
        radius: '90%',
        axisLine: {            // 坐标轴线
          lineStyle: {       // 属性lineStyle控制线条样式
            width: 2,
            shadowBlur: 0
          }
        },
        axisTick: {            // 坐标轴小标记
          length: 10,        // 属性length控制线长
          lineStyle: {       // 属性lineStyle控制线条样式
            color: 'auto'
          }
        },
        splitLine: {           // 分隔线
          length: 10,         // 属性length控制线长
          lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
            color: 'auto'
          }
        },
        axisLabel: {
          borderRadius: 2,
          color: '#000',
          distance: 2,
          padding: 0
        
        },
        title: {
          // 其余属性默认使用全局文本样式，详见TEXTSTYLE
          fontWeight: 'bolder',
          fontSize: 10,
          fontStyle: 'italic'
        },
        pointer: {
          width: 5
        },
        detail: {
          // 其余属性默认使用全局文本样式，详见TEXTSTYLE
          formatter: function (value) {
            value = (value + '').split('.');
            value.length < 2 && (value.push('00'));
            return ('00' + value[0]).slice(-2)
              + '.' + (value[1] + '00').slice(0, 2);
          },
          fontWeight: 'normal',
          borderRadius: 3,
          backgroundColor: '#444',
          borderColor: '#aaa',
          borderWidth: 2,
          textBorderColor: '#000',
          textBorderWidth: 2,
          textShadowOffsetX: 0,
          textShadowOffsetY: 0,
          fontFamily: 'Arial',
          width: 30,
          height: 10,
          offsetCenter: [0, '80%'],
          fontStyle: 'italic',
          fontSize: 15,
          color: '#eee',
          rich: {}
        },
        data: [{ value: mile, name: '万公里' }]
      },
      {
        name: '费用',
        type: 'gauge',
        center: ['20%', '50%'],    // 默认全局居中
        radius: '90%',
        min: 0,
        max: 10,
        endAngle: 45,
        splitNumber: 5,
        axisLine: {            // 坐标轴线
          lineStyle: {       // 属性lineStyle控制线条样式
            width: 2
          }
        },
        axisTick: {            // 坐标轴小标记
          length: 5,        // 属性length控制线长
          lineStyle: {       // 属性lineStyle控制线条样式
            color: 'auto'
          }
        },
        splitLine: {           // 分隔线
          length: 5,         // 属性length控制线长
          lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
            color: 'auto'
          }
        },
        pointer: {
          width: 3
        },
        title: {
          offsetCenter: [0, '-30%'],       // x, y，单位px
          fontSize: 10
        },
        detail: {
          // 其余属性默认使用全局文本样式，详见TEXTSTYLE
          fontWeight: 'normal',
          fontSize: 15,
          fontStyle: 'italic'
        },
        data: [{ value: cost, name: '万元' }]
      },
      {
        name: '油表',
        type: 'gauge',
        center: ['80%', '50%'],    // 默认全局居中
        radius: '80%',
        min: 0,
        max: 2,
        startAngle: 135,
        endAngle: 45,
        splitNumber: 2,
        axisLine: {            // 坐标轴线
          lineStyle: {       // 属性lineStyle控制线条样式
            width: 2
          }
        },
        axisTick: {            // 坐标轴小标记
          splitNumber: 5,
          length: 10,        // 属性length控制线长
          lineStyle: {        // 属性lineStyle控制线条样式
            color: 'auto'
          }
        },
        axisLabel: {
          formatter: function (v) {
            switch (v + '') {
              case '0': return 'E';
              case '1': return 'Gas';
              case '2': return 'F';
            }
          }
        },
        splitLine: {           // 分隔线
          length: 15,         // 属性length控制线长
          lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
            color: 'auto'
          }
        },
        pointer: {
          width: 2
        },
        title: {
          show: false
        },
        detail: {
          show: false
        },
        data: [{ value: 0.5, name: 'gas' }]
      },
      {
        name: '水表',
        type: 'gauge',
        center: ['80%', '50%'],    // 默认全局居中
        radius: '80%',
        min: 0,
        max: 2,
        startAngle: 315,
        endAngle: 225,
        splitNumber: 2,
        axisLine: {            // 坐标轴线
          lineStyle: {       // 属性lineStyle控制线条样式
            width: 2
          }
        },
        axisTick: {            // 坐标轴小标记
          show: false
        },
        axisLabel: {
          formatter: function (v) {
            switch (v + '') {
              case '0': return 'H';
              case '1': return 'Water';
              case '2': return 'C';
            }
          }
        },
        splitLine: {           // 分隔线
          length: 15,         // 属性length控制线长
          lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
            color: 'auto'
          }
        },
        pointer: {
          width: 2
        },
        title: {
          show: false
        },
        detail: {
          show: false
        },
        data: [{ value: 0.5, name: 'gas' }]
      }
    ]
  };


  chart.setOption(option, true);
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
     costAll: {
     type:Number,
     value: 0
     },
    miles: {
      type: Number,
      value: 0
    }
  },
  observers:{
    'costAll, miles':function(costAll, miles){
      this.init_one(costAll, miles)
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
  created(){

  },
  
  /**
   * 组件的方法列表
   */
  lifetimes:{
    created() {
      console.log('page is ready')
      this.oneComponent = this.selectComponent('#mychart-dom-gauge');
    },
    attached(){
      this.init_one(this.data.costAll,this.data.miles)
    }
  },
  pageLifetimes:{
   
  },
  methods: {
    init_one: function (xdata, ydata) {           //初始化第一个图表
      this.oneComponent.init((canvas, width, height,dpr) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr
        });
        setOption(chart, xdata, ydata)
        this.chart = chart;
        return chart;
      });
    }
  }
})
