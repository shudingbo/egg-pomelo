'use strict';

const util = require('../util');
const consts = require('../consts');
const CommandBase = require('../commandBase');
class CommandDump extends CommandBase {

  constructor(cmdMgr) {
    super(cmdMgr);

    this.commandId = 'dump';
    this.helpCommand = 'help dump';
  }

  handle(comd, argv, msg) {
    const Context = this.getContext();
    if (Context === 'all') {
      this.sendErr('\n' + consts.COMANDS_CONTEXT_ERROR + '\n');
      return;
    }

    const argvs = util.argsFilter(argv);

    if (argvs.length < 3 || (comd === 'cpu' && argvs.length < 4)) {
      this.sendHelp(this.helpCommand, msg);
      return;
    }

    let param = {};

    if (comd === 'memory') {
      param = {
        filepath: argvs[2],
        force: (argvs[3] === '--force'),
      };
    } else if (comd === 'cpu') {
      param = {
        filepath: argvs[2],
        times: argvs[3],
        force: (argvs[4] === '--force'),
      };
    }

    this.cmdMgr.client.request('watchServer', {
      comd,
      param,
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
  return new CommandDump(opts);
};
