
'use strict';

const util = require('../util');
const consts = require('../consts');

const CommandBase = require('../commandBase');


class CommandMonitorLog extends CommandBase {

  constructor(cmdMgr) {
    super(cmdMgr);

    this.commandId = 'monitorLog';
    this.helpCommand = 'help monitorLog';
  }

  handle(comd, argv, msg) {
    const Context = this.getContext();
    if (Context === 'all') {
      this.sendErr('\n' + consts.COMANDS_CONTEXT_ERROR + '\n');
      return;
    }

    const argvs = util.argsFilter(argv);
    if (argvs.length !== 3) {
      this.sendHelp(this.helpCommand, msg);
      return;
    }

    const logfile = argvs[1];
    let number = parseInt(argvs[2]);
    if (Number.isInteger(number) === false) {
      number = 100;
    } else {
      if (number < 0 || number > 1000) {
        number = 1000;
      }
    }


    this.cmdMgr.client.request('monitorLog', {
      number,
      logfile,
      serverId: Context,
      context: Context,
    }, (err, data) => {
      console.log('-- ', err, data);
      if (err) {
        this.sendErr(err);
      } else {
        this.sendOk(data);
      }
    });
  }


}


module.exports = function(cmdMgr) {
  return new CommandMonitorLog(cmdMgr);
};

