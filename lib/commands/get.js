
let util = require('../util');
let consts = require('../consts');


module.exports = function(opts) {
	return new Command(opts);
};

module.exports.commandId = 'get';
module.exports.helpCommand = 'help get';

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

	if(argvs.length < 2){
		agent.handle(module.exports.helpCommand, msg, rl, client);
		return;
	}

	client.request('watchServer', {
		comd: module.exports.commandId,
		param: comd,
		context: Context
	}, function(err, data) {
		if (err) console.log(err);
		else util.formatOutput(module.exports.commandId, data);
		rl.prompt();
	});
}