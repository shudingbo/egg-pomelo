
let util = require('../util');
let consts = require('../consts');
let cliff = require('cliff');

module.exports = function(opts) {
	return new Command(opts);
};

module.exports.commandId = 'set';
module.exports.helpCommand = 'help set';

let Command = function(opt){

}

Command.prototype.handle = function(agent, comd, argv, rl, client, msg){
	if (!comd) {
		agent.handle(module.exports.helpCommand, msg, rl, client);
		return;
	}

	let Context = agent.getContext();
	if (Context === 'all') {
		util.log('\n' + consts.COMANDS_CONTEXT_ERROR + '\n');
		rl.prompt();
		return;
	}

	let argvs = util.argsFilter(argv);

	if(argvs.length < 3){
		agent.handle(module.exports.helpCommand, msg, rl, client);
		return;
	}

	let param = {
		key: argvs[1],
		value: argvs[2]
	};

	client.request('watchServer', {
		comd: module.exports.commandId,
		param: param,
		context: Context
	}, function(err, data) {
		if (err) console.log(err);
		else util.formatOutput(module.exports.commandId, data);
		rl.prompt();
	});
}