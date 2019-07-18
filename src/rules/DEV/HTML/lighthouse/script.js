const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher
    .launch({ chromeFlags: opts.chromeFlags })
    .then(chrome => {
      opts.port = chrome.port;
      return lighthouse(url, opts, config).then(results => {
        // use results.lhr for the JS-consumeable output
        // https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
        // use results.report for the HTML/JSON/CSV output as a string
        // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
        return chrome.kill().then(() => results.lhr);
      });
    });
}

const opts = {
  chromeFlags: ['--show-paint-rects'],
};

if (process.argv[2] === undefined) {
  console.log('Please provide an url');
} else {
  const url = process.argv[2];

  // Usage:
  launchChromeAndRunLighthouse(url, opts)
    .then(results => {
      Object.values(results.categories).forEach(category => {
        console.log(category.title, category.score);
        if (category.score < 0.49) {
          process.exit(1);
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
}
