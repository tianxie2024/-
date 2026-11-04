/***********************************

> ScriptName  光鸭云盘 解锁本地会员[空间/流量]
> Author      参照 ddgksf2013 阿里云盘格式 / chxm1023 夸克格式
> UpdateTime  2026-11-04
> Attention   ⚠️仅供参考，🈲转载与售卖！仅改本地响应显示，服务端权限仍按真实会员校验。
> 依赖抓包    api.guangyapan.com/assets/v1/get_assets

[rewrite_local]
^https?:\/\/api\.guangyapan\.com\/assets\/v1\/get_assets url script-response-body https://raw.githubusercontent.com/你的仓库/guangya.js
^https?:\/\/api\.guangyapan\.com\/misc\/v1\/get_banner_list url script-response-body https://raw.githubusercontent.com/你的仓库/guangya.js
^https?:\/\/api\.guangyapan\.com\/misc\/v1\/get_inapp_msg_unread_count url script-response-body https://raw.githubusercontent.com/你的仓库/guangya.js

[mitm]
hostname = api.guangyapan.com

***********************************/

var body = $response.body;
var url = $request.url;

if (!body) {
  $done({});
} else {
  switch (true) {
    // 资产/会员/空间/高速流量 —— 核心接口
    case /\/assets\/v1\/get_assets/.test(url):
      try {
        var assets = JSON.parse(body);
        if (!assets.data) assets.data = {};
        assets.code = 0;
        assets.msg = "success";
        // 会员标记（抓包字段：vipStatus / svipStatus）
        assets.data.vipStatus = 1;
        assets.data.svipStatus = 1;
        // 总空间：500TB
        assets.data.totalSpaceSize = 549755813888000;
        // 高速流量：拉满 1TB
        assets.data.highSpeedTraffic = {
          total: 1099511627776,
          remained: 1099511627776
        };
        body = JSON.stringify(assets);
      } catch (e) {
        console.log("get_assets " + e);
      }
      break;

    // 横幅广告 —— 清空（参照阿里脚本净化 widgets/tools）
    case /\/misc\/v1\/get_banner_list/.test(url):
      try {
        var banners = JSON.parse(body);
        banners.code = 0;
        banners.msg = "success";
        banners.data = { list: [] };
        body = JSON.stringify(banners);
      } catch (e) {
        console.log("get_banner_list " + e);
      }
      break;

    // 站内消息未读 —— 置 0
    case /\/misc\/v1\/get_inapp_msg_unread_count/.test(url):
      try {
        var unread = JSON.parse(body);
        unread.code = 0;
        unread.msg = "success";
        if (unread.data && typeof unread.data === "object") {
          unread.data.count = 0;
          unread.data.unreadCount = 0;
        } else {
          unread.data = { count: 0 };
        }
        body = JSON.stringify(unread);
      } catch (e) {
        console.log("get_inapp_msg_unread_count " + e);
      }
      break;

    default:
      break;
  }
  $done({ body: body });
}
