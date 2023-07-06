require('./setupDotenv');

const {mkdir, writeFile} = require('fs').promises;
const os = require('os');
const path = require('path');
const puppeteer = require('puppeteer');
const options = require('./puppeteerOptions').launch;

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports = async function () {
  const browser = await puppeteer.launch(options);
  global.browser = browser

  await mkdir(DIR, {recursive: true});
  await writeFile(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
};
