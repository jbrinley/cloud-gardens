#!/usr/bin/env node
'use strict';

var pkgjson = require('./package.json');
var aws     = require('aws-sdk');
var config  = require('config');
var winston = require('winston');

winston.setLevels({
    error: 0, warn: 1, info: 2, verbose: 3, debug: 4
});
winston.addColors({
    error: 'red', warn: 'yellow', info: 'green', verbose: 'cyan', debug: 'blue'
});
winston.remove(winston.transports.Console)
winston.add(winston.transports.Console, {
    level: config.log.level,
    prettyPrint: true,
    colorize: true,
    silent: false,
    timestamp: false
});
winston.add(winston.transports.File, {
    prettyPrint: false,
    level: config.log.level,
    silent: false,
    colorize: false,
    timestamp: true,
    filename: './logs/' + pkgjson.name + '.log',
    maxsize: 40000,
    maxFiles: 10,
    json: false
});

var argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .commandDir('commands')
    .demandOption(['profile', 'region', 'cloud'])
    .alias('region', 'r')
    .nargs('region', 1)
    .describe('region', 'AWS region')
    .default('region', (!config.aws.region ? undefined : config.aws.region))
    .alias('profile', 'p')
    .nargs('profile', 1)
    .describe('profile', 'AWS named profile to use for credentials')
    .default('profile', (!config.aws.profile ? undefined : config.aws.profile))
    .alias('cloud', 'c')
    .nargs('cloud', 1)
    .describe('cloud', 'The cloud where the garden lives')
    .choices('cloud', ['aws', 'digitalocean'])
    .default('cloud', config.cloud)
    .option('dryrun', {
        alias: 'd',
        describe: 'If present and if the operation supports it, a dry run of the operation will be attempted',
        type: 'boolean'
    })
    .help('h')
    .alias('help', 'h')
    .demandCommand(1, 'you must include a command')

    .example('$0 --region=us-west-2 create-key mykey', 'creates a new ssh key named "mykey" in the us-west-2 region')
    .example('$0 --region=us-east-1 tend main-east', 'starts or maintains a garden named "main-east" in the us-east-1 region')

    .argv;
