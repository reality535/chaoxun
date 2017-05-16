//app.js
App({
  chineseWeek:{
    weeks:['日','一','二','三','四','五','六']
  },
  onLaunch: function () {
    this.getSystemInfo();
    // this.getLocation();
  },
    //  获取设备信息
  getSystemInfo: function(cb) {
    var that = this;
    if(that.globalData.systemInfo) {
      typeof cb == "function" && cb(that.globalData.systemInfo);
    } else {
      wx.getSystemInfo({
      success: function(res) {
        that.globalData.systemInfo = res;
        typeof cb == "function" && cb(that.globalData.systemInfo);
      }
    })
    }
  },

  getLocation: function(cb) {
      var that = this;
      if(that.globalData.currentLocation) {
        typeof cb == "function" && cb(that.globalData.currentLocation);
      } else {
        wx.getLocation({
        type: 'wgs84',
        success: function(res) {
          that.globalData.currentLocation = res;
          typeof cb == "function" && cb(that.globalData.currentLocation);
        }
      })
      }
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
    },

  globalData: {

    systemInfo: null,
    currentLocation:null,
    currentChao:null,
    spotChao:null
  }
  
 
})