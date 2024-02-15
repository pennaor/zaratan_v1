const { readFile } = require('fs').promises;
const os = require('os');
const path = require('path');
const puppeteer = require('puppeteer');
const NodeEnvironment = require('jest-environment-node');
const options = require('./puppeteerOptions').connect;
const mysql = require('mysql2/promise');
const { connectionConfig } = require('../database')

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

class CustomEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
    this.failedTest = false;
  }

  async handleTestEvent(event, state) {
    if (this.failedTest) {
      if (event.name === 'test_start') {
        event.test.mode = 'skip';
      }
      if (event.name === 'hook_start' && event.hook.type === 'beforeAll') {
        event.hook.fn = () => undefined;
      }
    }

    if (event.name === 'hook_failure') {
      console.error(`${event.hook.type} ${event.error}`);
      this.failedTest = true;
    }
    if (event.name === 'test_fn_failure') {
      this.failedTest = true;
    }

    if (super.handleTestEvent) {
      await super.handleTestEvent(event, state);
    }
  }

  async setup() {
    await super.setup();

    const wsEndpoint = await readFile(path.join(DIR, 'wsEndpoint'), 'utf8');
    if (!wsEndpoint) {
      throw new Error('wsEndpoint not found');
    }

    this.global.browser = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
      ...options,
    });
    const pages = await this.global.browser.pages();
    if (pages.length === 2) {
      await pages[1].close();
    }
    this.global.page = await this.global.browser.newPage();
    this.global.page.setDefaultTimeout(5000);
    await this.global.page.setCacheEnabled(false);

    this.global.dbPool = await mysql.createPool(connectionConfig);
  }

  async teardown() {
    if (this.global.browser) {
      this.global.browser.disconnect();
    }
    if (this.global.dbPool) {
      this.global.dbPool.end();
    }
    await super.teardown();
  }

  getVmContext() {
    return super.getVmContext();
  }
}

module.exports = CustomEnvironment;
