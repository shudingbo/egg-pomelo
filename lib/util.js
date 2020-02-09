'use strict';

const crypto = require('crypto');
const consts = require('./consts');

const util = {};

module.exports = util;

const serverMap = {};

function log(str) {
  process.stdout.write(str + '\n');
}

function formatStr(str) {
  return `<p>${str}</p>`;
}

function help() {
  let szOut = '';
  for (const it of consts.HELP_INFO_1) {
    szOut += util.formatStr(it);
  }

  for (const it of consts.COMANDS_ALL) {
    szOut += util.formatStr(`${it[0]} ${it[1]}`);
  }

  for (const it of consts.HELP_INFO_2) {
    szOut += util.formatStr(it);
  }

  return szOut;
}

function errorHandle(comd, cli, ctx) {
  log('\nunknow command : ' + comd);
  log('type help for help infomation\n');

  cli.agent.messenger.sendTo(ctx.pid, 'egg-pomelo', {
    comd,
  });

}

function argsFilter(argv) {
  let lines;
  if (argv.indexOf('\'') > 0) {
    lines = argv.split('\'');
  }
  const getArg = function(argv) {
    const argvs = argv.split(' ');
    for (let i = 0; i < argvs.length; i++) {
      if (argvs[i] === ' ' || argvs[i] === '') {
        argvs.splice(i, 1);
      }
    }
    return argvs;
  };
  if (lines) {
    let head = getArg(lines[0]);
    for (let i = 1; i < lines.length - 1; i++) {
      head = head.concat(lines[i]);
    }
    const bottom = getArg(lines[lines.length - 1]);
    return head.concat(bottom);
  }
  return getArg(argv);

}


function format_date(date, friendly) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();

  if (friendly) {
    const now = new Date();
    const mseconds = -(date.getTime() - now.getTime());
    const time_std = [ 1000, 60 * 1000, 60 * 60 * 1000, 24 * 60 * 60 * 1000 ];
    if (mseconds < time_std[3]) {
      if (mseconds > 0 && mseconds < time_std[1]) {
        return Math.floor(mseconds / time_std[0]).toString() + ' 秒前';
      }
      if (mseconds > time_std[1] && mseconds < time_std[2]) {
        return Math.floor(mseconds / time_std[1]).toString() + ' 分钟前';
      }
      if (mseconds > time_std[2]) {
        return Math.floor(mseconds / time_std[2]).toString() + ' 小时前';
      }
    }
  }

  // month = ((month < 10) ? '0' : '') + month;
  // day = ((day < 10) ? '0' : '') + day;
  hour = ((hour < 10) ? '0' : '') + hour;
  minute = ((minute < 10) ? '0' : '') + minute;
  second = ((second < 10) ? '0' : '') + second;

  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
}

function getColor(len) {
  const color = [];
  for (let i = 0; i < len; i++) {
    color.push('blue');
  }
  return color;
}

function md5(str) {
  const md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
}

function tabComplete(hits, line, map, comd) {
  if (hits.length) {
    return hits;
  }

  if (comd === 'enable' || comd === 'disable') {
    map = {
      app: 1,
      module: 1,
    };
  }

  if (comd === 'dump') {
    map = {
      memory: 1,
      cpu: 1,
    };
  }

  if (comd === 'use' || comd === 'stop') {
    map = serverMap;
  }

  // let _hits = [];
  for (const k in map) {
	  let t = k;
	  if (comd !== 'complete') {
	    t = comd + ' ' + k;
	  }
    if (t.indexOf(line) === 0) {
      hits.push(t);
    }
  }

  hits.sort();
  return hits;
}

util.log = log;
util.md5 = md5;
util.help = help;
util.tabComplete = tabComplete;
util.argsFilter = argsFilter;
util.format_date = format_date;
util.errorHandle = errorHandle;
util.formatStr = formatStr;
