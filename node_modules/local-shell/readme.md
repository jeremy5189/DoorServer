# Local Shell

Local shell is a util to manage shell commands in asynchronous way like it's
executed remotely. It has the same interface as Ssh-Shell to simplify usage.

## Installation

Install via npm

```
npm i local-shell
```

## Example

Example of variable usage:
```javascript
const LocalShell = require('local-shell');
const fs = require('fs');

const shell = new LocalShell({
    cwd: process.cwd(),
});

shell.set('NAME', 'World');
shell.exec('echo Hello $NAME')
.then(result => {
    var {code, io} = result;
    if (code) {
        throw new Error('Exit code is ' + code);
    }

    console.log(io.toString()); // -> Hello World
});
```

## API

### exec(cmd:String) -> Promise<{code,io},Error>

Execute command and return promised Result object.

### open()

_Added for compatibility with SshShell_

Start session. Emit `open` event.

### close()

_Added for compatibility with SshShell_

Stop session. Emit `close` event.

### uploadFile(source:String, [dest:String]) -> Promise(<null,Error>)

Upload file from source to destination. Destination is resolving from `cwd` value. If destination not set than it replaces with source's filename.

### uploadBuffer(source:Buffer, dest:string) -> Promise(<null,Error>)

Upload data from buffer to the server.

### downloadFile(source:String, [dest:String])

Download file from source into destination. If destination not set than it replaces with source's filename.
