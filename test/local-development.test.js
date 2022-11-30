const { exec } = require('child_process');
const { configureToMatchImageSnapshot } = require('jest-image-snapshot');
const { openAddon } = require('./utils/open-addon');

require('dotenv').config();

const isExtended = `${process.env.IS_EXTENDED}` === 'true';

const toMatchImageSnapshot = configureToMatchImageSnapshot({
  failureThreshold: 0.04,
  failureThresholdType: 'percent',
  customDiffConfig: {
    threshold: 0.1,
  },
  blur: 2,
  allowSizeMismatch: true,
});
expect.extend({ toMatchImageSnapshot });
jest.setTimeout(180000);

const webpackDevServerReady = async (process) => {
  console.log('Waiting for Webpack Dev Server to finish loading...');
  return new Promise((resolve) => {
    process.stdout.on('data', (data) => {
      if (data.includes('DEVELOPMENT: CLIENT - Dialog Demo Bootstrap')) {
        resolve();
      }
    });
  });
};

describe(`Local setup ${isExtended ? '*extended*' : ''}`, () => {
  let page;
  let process;

  beforeAll(async () => {
    process = exec('npm run serve');
    page = await global.__BROWSER_GLOBAL__.newPage();

    await page.setViewport({
      width: 800,
      height: 800,
      deviceScaleFactor: 1,
    });

    await webpackDevServerReady(process);

    if (isExtended) {
      await openAddon(page);
    } else {
      await page.goto('https://localhost:3000/dialog-demo-bootstrap.html');
      await page.waitForTimeout(3000);
    }
  });

  afterAll(() => {
    process.kill();
  });
});
