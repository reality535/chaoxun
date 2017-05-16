var app = getApp()
Page({
    data: {
        
        systemInfo: {},
        yanGuanChao: "",
        yanGuanXi:"",
        yanChangChao:"",
        yanChangXi:"",
        bigKouChao:"",
        bigKouXi:"",
        chao_jianshan:"",
        xi_jianshan:"",
        windowHeight:0
    },
    onLoad: function(options) {
        var that = this;
        // that.setData({
        //   windowHeight: app.globalData.systemInfo.windowHeight
        // });
        that.setData({
            "yanGuanChao":app.globalData.spotChao["yanGuanChao"],
            "yanGuanXi":app.globalData.spotChao["yanGuanXi"],
            "yanChangChao":app.globalData.spotChao["yanChangChao"],
            "yanChangXi":app.globalData.spotChao["yanChangXi"],
            "bigKouChao":app.globalData.spotChao["bigKouChao"],
            "bigKouXi":app.globalData.spotChao["bigKouXi"],
            "jianShanChao":app.globalData.spotChao["jianShanChao"],
            "jianShanXi":app.globalData.spotChao["jianShanXi"]
            })
    }
      


})