
let util = require('../util');
let consts = require('../consts');

let fs = require('fs');

module.exports = function(opts) {
	return new Command(opts);
};

module.exports.commandId = 'exec';
module.exports.helpCommand = 'help exec';

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

	if(argvs.length >2){
		agent.handle(module.exports.helpCommand, msg, rl, client);
		return;
	}

	let file = null;
	if(comd[0] !== '/'){
		comd = process.cwd() + '/' + comd;
	}

	try{
		file = fs.readFileSync(comd).toString();
	}catch(e){
		util.log(consts.COMANDS_EXEC_ERROR);
		rl.prompt();
		return;
	}

	client.request('scripts', {
		command: 'run',
		serverId: Context,
		script: file
	}, function(err, msg) {
		if (err) console.log(err);
		else {
			try{
				msg = JSON.parse(msg);
				util.formatOutput(module.exports.commandId, msg);	
			}catch(e){
				util.log('\n' + msg + '\n');
			}
		}
		rl.prompt();
	});
}
