# egg-pomelo

[![NPM version][npm-image]][npm-url]


[npm-image]: https://img.shields.io/npm/v/egg-pomelo.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-pomelo
[sample]: https://github.com/shudingbo/sex-pomelo-web


本插件用于为eggjs提供poemlo管理功能（pomelo-cli web版本）


## 依赖说明
### 依赖的 egg 版本

egg-pomelo 版本 | egg 2.x

### 依赖的插件

- [@sex-pomelo/sex-pomelo-admin](https://github.com/sex-pomelo/sex-pomelo-admin)
- [@sex-pomelo/sex-pomelo-logger](https://github.com/sex-pomelo/sex-pomelo-logger)

## 安装

```bash
$ npm i egg-pomelo --save
```

## 开启插件

```js
// config/plugin.js
exports.pomelo = {
  enable: true,
  package: 'egg-pomelo',
};
```
## 配置

```js
// {app_root}/config/config.default.js
exports.pomelo = {
  client: {
    master: {
      host: '127.0.0.1',
      port: 3005,
      username: 'admin',
      password: 'admin',
    },
  },
};

```

## 详细配置

请到 [config/config.default.js](config/config.default.js) 查看详细配置项说明。


## API
### runAction
```js
/** 运行命令
   *
   * @param {string} cmd 命令对象
   * @param {string} context 上下文（服务器名称）
   *
   * @return {{status:boolean},{data:object}} data 返回数据
   */
  async runAction(cmd, context = 'all');
```
例子：
```JS
// get servers
const ret = await this.app.pomelo.runAction('show servers', 'all');

// get handler
const retHandler = await this.app.pomelo.runAction('show handler', 'chat-1');
```
### execStr
  运行字符串脚本

```js
/** 在指定的node 上执行脚本字符串
   *
   * @param {string} script 脚本内容
   * @param {string} context 执行上下文 serverId
   */
  async execStr(script, context);
```

例子:
```js
await this.app.pomelo.execStr('var cpus = os.cpus();result = util.inspect(cpus,true,null);','chat-1');
```


## 支持的命令

[**Command list**](https://github.com/sex-pomelo/sex-pomelo-cli/wiki/sex-pomelo-cli-man-page)

```js
consts.COMANDS_ALL = [
  [ 'command', '  description' ],
  [ '?', '  symbol for help' ],
  [ 'help', '  display the help' ],
  [ 'quit', '  quit pomelo-cli' ],
  [ 'kill', '  kill all servers' ],
  [ 'exec', '  exec script files' ],
  [ 'get', '  equal to app.get(key) ' ],
  [ 'set', '  equal to app.set(key, value)' ],
  [ 'add', '  add server to pomelo clusters' ],
  [ 'stop', '  stop server. Takes serverId as argument' ],
  [ 'show', '  show infos like : user, servers, connections, connectionInfo' ],
  [ 'use', '  use another server. Takes serverId as argument' ],
  [ 'enable', '  enable an admin console module or enable app settings' ],
  [ 'disable', '  disable an admin console module or disable app settings' ],
  [ 'addCron', '  add cron for server' ],
  [ 'removeCron', '  remove cron for server' ],
  [ 'blacklist', ' add blacklist for frontend server' ],
  [ 'run', ' run script in server' ],
  [ 'execStr', '  exec script String' ],
  [ 'systemInfo', ' show server systeminfo' ],
  [ 'nodeInfo', ' show node info' ],
  [ 'monitorLog', ' get Log' ],
];
```

## 更改记录
### 0.0.5
 1. 使用 sex-pomelo-admin 1.0.7;
 1. 实现确保多个命令并行执行时，返回数据顺序正确；

### 0.0.4
 1. 使用 sex-pomelo-admin 1.0.6
 1. 支持 show connectionInfo 命令
 
### 0.0.3
 1. 使用 sex-pomelo-admin 1.0.5


### 0.0.2
 1. 增加语法提示功能
 1. 增加 monitorLog,systemInfo,nodeInfo 功能接口

### 0.0.1
 1. 实现基本功能

## 提问交流

请到 [egg-pomelo issues](https://github.com/shudingbo/egg-pomelo/issues) 异步交流。

## License

[MIT](LICENSE)
