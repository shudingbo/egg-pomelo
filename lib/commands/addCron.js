'use strict';

const util = require('../util');
const consts = require('../consts');

const CommandBase = require('../commandBase');


class CommandCron extends CommandBase {

  constructor(cmdMgr) {
    super(cmdMgr);

    this.commandId = 'addCron';
    this.helpCommand = 'help addCron';
  }

  handle(comd, argv, msg) {
    const argvs = util.argsFilter(argv);

    this.cmdMgr.client.request(consts.CONSOLE_MODULE, {
      signal: 'addCron',
      args: argvs.slice(1),
    }, (err, data) => {
      if (err) {
        this.sendErr(err);
      } else {
        if (data === undefined) {
          this.sendErr('the addCron error');
        } else {
          this.sendOk(data.msg);
        }
      }
    });
  }

}

module.exports = function(opts) {
  return new CommandCron(opts);
};

