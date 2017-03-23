'use strict';

var fs          = require('fs');
var path        = require('path');
var winston     = require('winston');
var Gardens     = require('../lib');

exports.command = 'create-key [name]';
exports.desc = 'creates a new ssh key, pushes it to the cloud provider as an accepted key, and saves the private key locally to .keys';
exports.callback = function(name, key) {
    var keyPath = path.resolve(path.join(__dirname, '..', '.keys', name));
    fs.writeFile(keyPath, key, function(err) {
        if (err) return winston.error(err);
        fs.chmod(keyPath, '0600');
        winston.warn("IMPORTANT: new key has been saved to " + keyPath + ", make sure you put it in a safe place.  You won't be able to recover it.");
    });
};
exports.handler = function(argv) {
    if (argv.cloud != 'aws') {
        return winston.error("Only AWS is supported right now");
    }
    if (argv.cloud == 'aws') exports.awsHandler(argv);
};
exports.awsHandler = function(argv) {
    (new Gardens.Aws.Gardener(require('config'))).createKey(argv.name)
        .then(function(result) {
            exports.callback(argv.name, result)
        })
        .catch(function(result) {
            winston.error(result);
        });
};