'use strict';


const util = require('./util');
const fs = require('fs');

/**
 * @typedef {CommandManager} CommandManager
 */


/**
 * @class
 *
 * 命令管理类
 */
class CommandManager {

  /**
   *
   * @param {import('./pomeloManagerAgent').PomeloManagerAgent  } agent pomelo Manager Agent
   */
  constructor(agent) {
    /**
     * @type {import('./pomeloManagerAgent').PomeloManagerAgent}
     */
    this.agent = agent;
    this.client = agent.drv;

    this.commands = {};
    this.init();
  }

  init() {
    const self = this;
    fs.readdirSync(__dirname + '/commands').forEach(function(filename) {
      if (/\.js$/.test(filename)) {
        const name = filename.substr(0, filename.lastIndexOf('.'));
        const _command = require('./commands/' + name);
        self.commands[name] = _command;
      }
    });
  }


  handle(argv, msg, client, ctx) {
    const argvs = util.argsFilter(argv);
    const comd = argvs[0];
    let comd1 = argvs[1] || '';

    comd1 = comd1.trim();
    const m = this.commands[comd];
    if (m) {
      const _command = m(this);
      _command.handleFilter(ctx, comd1, argv, msg);
    } else {
      util.errorHandle(argv, this, ctx);
    }
  }
}


module.exports = CommandManager;

