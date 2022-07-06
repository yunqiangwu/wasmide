// app.ts
App<IAppOption>({
  globalData: {},
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    // wx.login({
    //   success: res => {
    //     console.log(res.code)
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     // wx.request({
    //     //   url: `https://api.weixin.qq.com/sns/jscode2session?appid=xx&secret=ff&js_code=${res.code}&grant_type=authorization_code`,
    //     //   success (res) {
    //     //     console.log(res.data)
    //     //   },
    //     // });
    //   },
    // })
  },
})