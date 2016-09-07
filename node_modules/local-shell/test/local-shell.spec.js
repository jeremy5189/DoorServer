'use strict';

const LocalShell = require('../');
const assert = require('assert');
const path = require('path');
const fs = require('fs');

describe('Local Shell', function(){
    var shell;
    var filename;

    before(function(){
        filename = path.basename(__filename);

        shell = new LocalShell({
            cwd: __dirname
        });
    });

    it('Should execute the code', function(){
        return shell.exec('ls -l')
        .then(function(result){
            var {code, io} = result;
            assert.equal(code, 0, 'Exit code is 0');
            assert.ok(io.toString().indexOf(path.basename(__filename)), 'Current file is in `ls -l` output');
        });
    });

    it('Should use variables', function(){
        shell.set('VAR', 1);
        return shell.exec('echo Hello $VAR')
        .then(function(result){
            var {code, io} = result;
            assert.equal(code, 0, 'Exit code is 0');
            assert.equal(io.toString(), 'Hello 1\n', 'Variable works fine');
        });
    });

    describe('Upload/Download', function(){
        var ssh, dir, filepath;

        before(function(){
            dir = path.resolve(__dirname + '/../tmp');
            filepath = path.join(dir, filename);
            ssh = new LocalShell({
                cwd: dir
            });
        });

        it('Should upload file', function(){
            return ssh.uploadFile(__filename)
            .then(function(){
                assert.ok(fs.existsSync(filepath));
            });
        });

        it('Should download file', function(){
            return ssh.downloadFile(filename, path.join(dir, filename + '.download'))
            .then(function(){
                assert.ok(fs.existsSync(filepath + '.download'));
            });
        });

        after(function(){
            fs.unlinkSync(path.join(dir, filename))
            fs.unlinkSync(path.join(dir, filename + '.download'));
        });
    });

});
