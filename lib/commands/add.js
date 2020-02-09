'use strict';

const util = require('../util');
const consts = require('../consts');
const CommandBase = require('../commandBase');

class CommandAdd extends CommandBase {
  constructor(cmdMgr) {
    super(cmdMgr);

    this.commandId = 'add';
    this.helpCommand = 'help add';
  }

  handle(comd, argv, msg) {
    const argvs = util.argsFilter(argv);
    this.cmdMgr.client.request(consts.CONSOLE_MODULE, {
      signal: 'add',
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
  return new CommandAdd(opts);
};

