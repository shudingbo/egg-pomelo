'use strict';

const CommandBase = require('../commandBase');

class CommandUse extends CommandBase {
  constructor(cmdMgr) {
    super(cmdMgr);

    this.commandId = 'use';
    this.helpCommand = 'help use';
  }

  handle(comd, argv, msg) {
    this.sendErr('Use command not support in web');
  }

}

module.exports = function(opts) {
  return new CommandUse(opts);
};

