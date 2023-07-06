import { app } from '../../config';
import selectors from '../../selectors';

export async function login(page) {
  await page.goto(app.baseURL);

  await page.waitForSelector(selectors.login.input.email);
  await page.waitForSelector(selectors.login.input.password);
  await page.waitForSelector(selectors.login.button.login);

  await page.click(selectors.login.input.email);
  await page.type(selectors.login.input.email, app.user.email);

  await page.click(selectors.login.input.password);
  await page.type(selectors.login.input.password, app.user.password);

  await page.click(selectors.login.button.login);
  return await page.waitForSelector(selectors.terrainTestId);
}

export async function logout() {
  return null;
}
