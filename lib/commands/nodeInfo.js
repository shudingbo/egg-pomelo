
'use strict';

const util = require('../util');
const consts = require('../consts');

const CommandBase = require('../commandBase');


class CommandNodeInfo extends CommandBase {

  constructor(cmdMgr) {
    super(cmdMgr);

    this.commandId = 'nodeInfo';
    this.helpCommand = 'help nodeInfo';
  }

  handle(comd, argv, msg) {
    const argvs = util.argsFilter(argv);

    if (argvs.length >= 2) {
      this.sendErr(consts.COMANDS_UNKNOWN + argv);
      return;
    }

    this.cmdMgr.client.request('nodeInfo', {
      comd,
    }, (err, data) => {
      if (err) {
        this.sendErr(err);
      } else {
        this.sendOk(data);
      }
    });
  }


}


module.exports = function(cmdMgr) {
  return new CommandNodeInfo(cmdMgr);
};

