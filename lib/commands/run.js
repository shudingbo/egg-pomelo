'use strict';

const util = require('../util');
const consts = require('../consts');

const CommandBase = require('../commandBase');

class CommandRun extends CommandBase {

  constructor(cmdMgr) {
    super(cmdMgr);

    this.commandId = 'run';
    this.helpCommand = 'help run';
  }

  handle(comd, argv, msg) {
    if (!comd) {
      this.sendHelp(this.helpCommand, msg);
      return;
    }

    const Context = this.getContext();
    if (Context === 'all') {
      this.sendErr('\n' + consts.COMANDS_CONTEXT_ERROR + '\n');
      return;
    }

    const argvs = util.argsFilter(argv);

    if (argvs.length < 2) {
      this.sendHelp(this.helpCommand, msg);
      return;
    }

    this.cmdMgr.client.request('watchServer', {
      comd: this.commandId,
      param: comd,
      context: Context,
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
  return new CommandRun(opts);
};
