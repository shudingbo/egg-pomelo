
let util = require('../util');
let consts = require('../consts');


module.exports = function(opts) {
	return new Command(opts);
};

module.exports.commandId = 'dump';
module.exports.helpCommand = 'help dump';

let Command = function(opt) {

}

Command.prototype.handle = function(agent, comd, argv, rl, client, msg) {
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

	if (argvs.length < 3 || (comd === 'cpu' && argvs.length < 4)) {
		agent.handle(module.exports.helpCommand, msg, rl, client);
		return;
	}

	let param = {};

	if (comd === 'memory') {
		param = {
			filepath: argvs[2],
			force: (argvs[3] === '--force' ? true: false)
		}
	} else if (comd === 'cpu') {
		param = {
			filepath: argvs[2],
			times: argvs[3],
			force: (argvs[4] === '--force' ? true: false)
		}
	}
	
	client.request('watchServer', {
		comd: comd,
		param: param,
		context: Context
	}, function(err, data) {
		if (err) console.log(err);
		else util.formatOutput(comd, data);
		rl.prompt();
	});
}