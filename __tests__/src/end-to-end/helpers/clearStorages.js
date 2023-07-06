export default async function clearStorages(page) {
  await page.waitForTimeout(100);

  const totalLength = await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    return localStorage.length + sessionStorage.length;
  });

  return totalLength === 0;
}
