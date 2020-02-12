/// <reference types="node" />

import {
  Application,
  Context,
  Agent,
} from 'egg';

import { EggLogger, EggLoggers, LoggerLevel as EggLoggerLevel, EggLoggersOptions, EggLoggerOptions, EggContextLogger } from 'egg-logger';



export class PomeloManagerAgent {
  /** Egg Application */
  agent: Agent
  logger: EggLogger
  drv: Object
}

export type CmdRet = {
  /** Job name */
  status: Boolean

  /** retData */
  data : Object
};


export class PomeloManagerApp {
  /** Egg Application */
  app: Application
  logger: EggLogger

  /** 执行命令 */
  runAction( cmd:String, context:String ): CmdRet

  /** 执行脚本字符串 */
  execStr( script:String, context:String ): CmdRet
}


type MasterCfg = {
  /** master server host */
  host: String;

  /** master server port */
  port: Number;

  /** master login username */
  username: String;

  /** master login password */
  password: String;
}

/** pomelo 配置选项 */
type EggPomeloOption = {
  /** master cfg */
  master: MasterCfg,

  /** redis server host */
  host: String;

  /** redis server port */
  port: Number;

  /** redis server password */
  password: String;

  /** redis server db index */
  db: Number;

  /** redis schex key pre */
  keyPre: String;

  /** schex check job status interval( ms ) */
  checkInterval: Number;
}

interface EggPomeloOptions {
  client: EggPomeloOption;
}


declare module 'egg' {
  interface Application {
    pomelo: PomeloManagerApp;
  }

  interface EggAppConfig {
    pomelo: EggPomeloOptions;
  }
}
