module.exports = {
  launch: {
    product: 'chrome',
    headless: process.env.HEADLESS !== 'false',
    devtools: process.env.DEVTOOLS === 'true',
    executablePath: process.env.CHROMIUM_BIN_PATH,
    args: [
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      "--window-size=1360,768",
    ],
  },
  connect: {
    slowMo: Number(process.env.SLOW_MOTION) ? Number(process.env.SLOW_MOTION) : 5,
    defaultViewport: { width: 1350, height: 638 },
    browserContext: 'default',
  },
  decoratedHandle: {
    timeout: 5000,
    elementProps: [
      'tagName',
      'id',
      'name',
      'className',
      'textContent',
      'disabled',
      'value',
      'type',
      'checked',
      'innerText',
    ],
  },
  factory: {
    testCoreOnly: {
      config: process.env.CORE_TESTS_ONLY_CONFIG_STEP !== 'false',
      terrainDetails: process.env.CORE_TESTS_ONLY_TERRAIN_DETAILS_STEP !== 'false',
      saleDetails: process.env.CORE_TESTS_ONLY_SALE_DETAILS_STEP !== 'false',
      installments: process.env.CORE_TESTS_ONLY_INSTALLMENTS_STEP !== 'false',
      buyers: process.env.CORE_TESTS_ONLY_BUYERS_STEP !== 'false',
    },
  },
};
