const { spawn } = require('child_process');
const top = spawn('git', ['log', '--date=format:%Y-%m', '--shortstat', '--format=%cd;', '--no-merges']);
// git log --date=format:%Y-%m --shortstat --format="%cd" --no-merges


// stats = { "YYYY-MM": { insertions: <int>, deletions: <int>, diff: <int> } }
var stats = {};

top.stdout.on('data', (data) => {
  var dataString = data.toString();
  var items = data.toString().replace(/\s/g, '').split(';');

  var yearMonth = items[0];

  var numberRegex = /\d+/g;
  var matches = items[1].match(numberRegex) || [];

  var insertions = parseInt(matches[1]) || 0; 
  var deletions = parseInt(matches[2]) || 0;

  var stat = stats[yearMonth] || { insertions: 0, deletions: 0, diff: 0 };

  stat.insertions += insertions;
  stat.deletions += deletions;
  stat.diff = stat.insertions - stat.deletions;
  stats[yearMonth] = stat;
});

top.stderr.on('data', (data) => {
  console.log(`--------ERROR!!!-------------`);
  console.log(`stderr: ${data}`);
  console.log(`--------ERROR!!!-------------`);
});

top.on('close', (code) => {
  console.log(JSON.stringify(stats, null, 4));
});

