'use strict';

const util = require('../util');
const consts = require('../consts');


const CommandBase = require('../commandBase');


class CommandConfig extends CommandBase {

  constructor(cmdMgr) {
    super(cmdMgr);

    this.commandId = 'config';
    this.helpCommand = 'help config';
  }

  handle(comd, argv, msg) {

    const Context = this.getContext();
    const argvs = util.argsFilter(argv);

    if (argvs.length > 2) {
      this.sendHelp(this.helpCommand, msg);
      return;
    }

    const user = msg.user || 'admin';

    if (Context === 'all') {
      this.sendErr('\n' + consts.COMANDS_CONTEXT_ERROR + '\n');
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
        this.sendOk(data);
      }
    });
  }
}


module.exports = function(opts) {
  return new CommandConfig(opts);
};

