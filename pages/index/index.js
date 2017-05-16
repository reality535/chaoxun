//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    year:"2017",
    month:"1",
    day:"1",
    week:"日",
    area:"盐官",
    distance:0,

    typeid:"",
    lunarMonth:"",
    lunarDay:"",
    
    animationData:"",
    loading_opacity: 1,

    now_temperature:"",
    now_weather:"",
    wind_direction:"",
    wind_scale:"",

    today_high:"",
    today_low:"",
    today_weather:"",
    tomorrow_high:"",
    tomorrow_low:"",
    tomorrow_weather:"",
    thirdDay_high:"",
    thirdDay_low:"",
    thirdDay_weather:"",

    code_today:"0",
    code_tomorrow:"0",
    code_thirdDay:"0",

    firstDay:[],
    secondDay:[],
    thirdDay:[],
    windowHeight:0,
    windowWidth:0,
    spotChao:{}
  },
  onLoad: function () {
    console.log('onLoad');
    this.getDis();
    // var that = this;
    // that.setData({
    //   windowHeight: app.globalData.systemInfo.windowHeight
    // });

  },
  onReady: function(){
    this.showDate();
    var _this = this;
wx.clearStorage();
    wx.getStorage({
      key: 'chaocun',
      success: function(res){
        // success
        // console.log(res);
        app.globalData.currentChao = res.data.chaoxunData.firstDay[0];
        app.globalData.spotChao = res.data.chaoxunData.spotChao;
        // console.log(app.globalData.spotChao);
        console.log("获取全局当前潮汛缓存");
        var nowTime = new Date();
        // 时间戳转换
        var nowtimestamp = Date.parse(new Date(nowTime));
        var deadlinetimestamp = Date.parse(new Date(res.data.timeDeadline));
        // console.log(nowtimestamp);
        // console.log(deadlinetimestamp);
        // 判断是否重新向服务器获取数据
        if(nowtimestamp > deadlinetimestamp){
          console.log("重新获取数据！");
          _this.loadChaoXun();
        } else{
          console.log("获取本地数据！");
          
          _this.setData(res.data.chaoxunData);
          _this.loading();
        }
      },
      fail: function() {
        // fail
        console.log('获取缓存失败');
        _this.loadChaoXun();
      }

    })

  },

  setTimeDeadline:function(){
    var now=new Date();
    var t=now.getTime();
    t+=3600000;//一个小时的毫秒数
    var deadline=new Date(t);
    return deadline;
  },

  //显示日期，年月日
  showDate:function(){
    var today = new Date();
    var _this = this;
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    var week = today.getDay();
    
  
    _this.setData({
      "year":year,
      "month":month,
      "day":day,
      "week":app.chineseWeek.weeks[week]
    })
  },

  //加载潮汛信息
  loadChaoXun: function(){
    var _this = this;
    //发送请求，获取数据
    wx.request({
      url:'https://www.zjhaining.com/chaoxun/api.php',
      method: 'GET',
      // header: {}, // 设置请求的 header
      header:{
        'Content-Type':'application/json'
      },
      success: function(res){
        // success
        // console.log('success');
        console.log(res);
        var chaoData = res.data;
        // console.log(chaoData);
        app.globalData.currentChao = chaoData.day_chao[0][0];
        app.globalData.spotChao = chaoData.spotChao;
        // console.log("!!!!!!!");
        // console.log(app.globalData.currentChao);
        // console.log(app.globalData.spotChao);

        var timeDeadline = _this.setTimeDeadline();
        var renderData = {
            typeid:"",
            lunarMonth:chaoData.lunarMonth,
            lunarDay:chaoData.lunarDay,
            
            now_temperature:chaoData.now.temperature,
            now_weather:chaoData.now.text,
            wind_direction:chaoData.today.wind_direction,
            wind_scale:chaoData.today.wind_scale,

            today_high:chaoData.today.high,
            today_low:chaoData.today.low,
            today_weather:chaoData.today.text_day,
            tomorrow_high:chaoData.tomorrow.high,
            tomorrow_low:chaoData.tomorrow.low,
            tomorrow_weather:chaoData.tomorrow.text_day,
            thirdDay_high:chaoData.thirdDay.high,
            thirdDay_low:chaoData.thirdDay.low,
            thirdDay_weather:chaoData.thirdDay.text_day,

            code_today:chaoData.today.code_day,
            code_tomorrow:chaoData.tomorrow.code_day,
            code_thirdDay:chaoData.thirdDay.code_day,

            loading_opacity: 0,
            firstDay:chaoData.day_chao[0],
            secondDay:chaoData.day_chao[1],
            thirdDay:chaoData.day_chao[2],

            windowHeight:app.globalData.systemInfo.windowHeight,
            windowWidth:app.globalData.systemInfo.windowWidth,
            spotChao:chaoData.spotChao
            
        };
        _this.setData(renderData);
        _this.storeData(timeDeadline,renderData);
        _this.loading();
      },
      fail: function() {
        // fail
        console.log('failed');
      }

    })
  },

  // 加载动画
  loading:function(){
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease"
    })
    animation.opacity(1).step()
    this.setData({
      animationData:animation.export()
    })
  },

  // 将数据进行本地存储
  storeData: function(date, chaoxunData){
    wx.setStorage({
      key: 'chaocun',
      data: {
        timeDeadline:date,
        chaoxunData:chaoxunData
      }
    })
  },
  getDis: function() {
      var that = this;
      
      wx.getLocation({
        type: 'wgs84',
        success: function(res) {

          var currentLat = res.latitude;
          var currentLng = res.longitude;

          var dis = that.getDistance(30.408241,120.553146,currentLat,currentLng);
         
          that.setData({
            "distance":dis
          });
        }
      })
      
    },
  
  // 120.553146,30.408241 盐官景区坐标
  //计算两点之间的距离
    getDistance:function(lat1,lng1,lat2,lng2){
        
        var PI = Math.PI;
     
        function Rad(d){
            return d*PI/180.0;
        }

        var radLat1 = Rad(lat1);
        var radLat2 = Rad(lat2);
        var a = radLat1 - radLat2;
        var  b = Rad(lng1) - Rad(lng2);
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
        Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
        s = s *6378.137 ;// EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000; //输出为公里
        s=s.toFixed(0);
        return s;
    }

})
