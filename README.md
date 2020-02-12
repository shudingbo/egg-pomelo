# egg-pomelo

[![NPM version][npm-image]][npm-url]


[npm-image]: https://img.shields.io/npm/v/egg-schex.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-schex
[sdb-schedule]: https://github.com/shudingbo/sdb-schedule#API
[sample]: https://github.com/shudingbo/egg-schex-sample.git


![Setting][idSet]

本插件用于为eggjs提供poemlo 管理功能


## 依赖说明
### 依赖的 egg 版本

egg-schex 版本 | egg 1.x
--- | ---
1.x | ��

### 依赖的插件

- ioredis

## 安装

```bash
$ npm i egg-schex --save
```

## 开启插件

```js
// config/plugin.js
exports.schex = {
  enable: true,
  package: 'egg-schex',
};
```
## 配置

```js
// {app_root}/config/config.default.js
exports.pomelo = {
  client: {
    master: {
      host: '192.168.3.5',
      port: 3005,
      username: 'admin',
      password: 'admin',
      autoConnect: true,
      reConnect: true,
    },
    port: 6379,
    host: '127.0.0.1',
    // password: null,
    db: 2,
    keyPre: 'sdb:schedule',
    checkInterval: 5000,
    // redisInstanseName: 'redis',
  },
};

```

## 详细配置

请到 [config/config.default.js](config/config.default.js) 查看详细配置项说明。


## API


## 更改记录

### 0.0.2
 1. 增加语法提示功能
 2. 增加 monitorLog,systemInfo,nodeInfo 功能接口

### 0.0.1
 1. 实现基本任务功能

## 提问交流

请到 [egg-schex issues](https://github.com/shudingbo/egg-pomelo/issues) 异步交流。

## License

[MIT](LICENSE)
