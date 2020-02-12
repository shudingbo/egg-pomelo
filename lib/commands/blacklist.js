'use strict';

const util = require('../util');
const consts = require('../consts');

const CommandBase = require('../commandBase');

class CommandBlacklist extends CommandBase {

  constructor(cmdMgr) {
    super(cmdMgr);

    this.commandId = 'blacklist';
    this.helpCommand = 'help blacklist';
  }

  handle(comd, argv, msg) {
    const argvs = util.argsFilter(argv);
    this.cmdMgr.client.request(consts.CONSOLE_MODULE, {
      signal: 'blacklist',
      args: argvs.slice(1),
    }, (err, data) => {
      if (err) {
        this.sendErr(err);
      } else {
          this.sendOk(data.msg);
        }
    });
  }
}

module.exports = function(opts) {
  return new CommandBlacklist(opts);
};

