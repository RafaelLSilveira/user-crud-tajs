var fs = require('fs');
var util = require('util');
var log_file = undefined
var log_stdout = process.stdout;

fs.open(__dirname + '/debug.log', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'})
      return;
    }

    throw err;
  } else {
    log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'r+'})
  }

  try {
    console.log = function(d) { //
      log_file.write(util.format(d) + '\n');
      log_stdout.write(util.format(d) + '\n');
    };

  } finally {
    fs.close(fd, (err) => {
      if (err) throw err;
    });
  }
})