# 七牛上传插件

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![License](https://img.shields.io/npm/l/7niu-webpack-plugin.svg)](https://www.npmjs.com/package/7niu-webpack-plugin)
[![Downloads](https://img.shields.io/npm/dm/7niu-webpack-plugin.svg)](https://www.npmjs.com/package/7niu-webpack-plugin)

基于 webpack 3.x 新版 API 制作的七牛静态资源上传插件

## 环境要求

* node > 6.x
* webpack > 3.x

## 使用

```javascript
const Qiniu = require('7niu-webpack-plugin')

module.exports = {
   output:{
    // 用来和七牛的静态资源绑定的域名 
    publicPath:"https://attach.example.com/"
 },
  plugins: [
    new Qiniu({
      // 与七牛云设置一致
      accessKey: '<your access key>',
      secretKey: '<your secret key>',
      bucket: '<your bucket name>',
      // 存储的路径
      path: '<custom store path>',
      // 上传过滤用的属性，仅支持正则匹配
      include: /\.js/
      exclude: /\.html$/
    })
  ]
}
```

## 版权声明

`Qiniu` 是上海七牛信息技术有限公司的注册商标， `7niu-webpack-plugin` 是参考网上存在的相关插件修改的，非官方版 `webpack` 插件。

## 授权协议

MIT

[qiniu-webpack-plugin]: https://github.com/longtian/qiniu-webpack-plugin
