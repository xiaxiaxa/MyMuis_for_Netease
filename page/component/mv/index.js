var common = require('../../../utils/util.js');
var bsurl = require('../../../utils/bsurl.js');
var app = getApp();
Page({
  data: {
    main: {},
    tab: 0,
    src: "",
    rec: {},
    loading: true,
    offset: 0,
    limit: 20,
    recid: 0,
    loading2: true,
    simi: {},
    id: ""
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      //获取MV详情
      url: bsurl + 'mv/detail',
      data: {
        mvid: options.id
      },
      success: function (res) {
        wx.getNetworkType({
          complete: function (r) {
            var src = res.data.data.brs;
            var wifi = r.networkType != 'wifi' ? false : true;
            var url = src[1080] || src[720] || src[480] || src[240]
            that.setData({
              id: options.id,
              main: res.data.data,
              wifi: wifi,
              src:url,
              loading: false,
              recid: res.data.data.commentThreadId
            });
          }
        })
        console.log("getMvPlayId__________________:" , options.id);
        wx.setNavigationBarTitle({
          title: res.data.data.name
        })
      }
    })

    wx.request({
      //获取MV播放地址
      url: bsurl + 'mv/url',
      data: {
        id: options.id,
        r:1080
      },
      success: function (res) {
        wx.getNetworkType({
          complete: function (r) {

            that.setData({
              id: options.id,
              main: res.data.data,
              src: res.data.data.url
            });

          }
        })
        console.log("getMvPlayurl__________________:" ,  res.data.data.url);
      }
    })
  },



  tab: function (e) {
    var t = e.currentTarget.dataset.tab;
    console.log("tab__________________");
    this.setData({
      tab: t
    });
    var that = this;
    if (this.data.tab == 1 && this.data.rec.code != 200) {
      common.loadrec(app.globalData.cookie, this.data.offset, this.data.limit, this.data.recid, function (data) {

        that.setData({
          loading: false,
          rec: data,
          offset: data.comments.length
        });
      }, 1)
    }
    if (this.data.tab == 2 && this.data.simi.code != 200) {
      that.setData({ loading: true });
      wx.request({
        url: bsurl + 'simi/mv',
        data: { mvid: that.data.id },
        success: function (res) {
          that.setData({
            loading: false,
            simi: res.data
          });
        }
      })
    }
  },
  loadmore: function () {
    console.log("loadmore__________________");
    if (this.data.rec.more && !this.data.loading) {
      var that = this;
      this.setData({
        loading2: true
      })
      common.loadrec(app.globalData.cookie, this.data.offset, this.data.limit, this.data.recid, function (data) {
        var rec = that.data.rec;
        var offset = that.data.offset + data.comments.length
        data.comments = rec.comments.concat(data.comments);
        data.hotComments = rec.hotComments;
        that.setData({
          loading2: false,
          rec: data,
          offset: offset
        });
      }, 1)
    }
  }
})