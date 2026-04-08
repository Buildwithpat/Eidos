const { chromium } = require("playwright");

const runInspection = async (url, selector) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(url);

  const data = await page.evaluate((selector) => {
    const el = document.querySelector(selector);
    if (!el) return null;

    const style = window.getComputedStyle(el);

    return {
      tag: el.tagName,
      text: el.innerText,

      font: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,

      color: style.color,
      background: style.backgroundColor,

      padding: style.padding,
      margin: style.margin,
      borderRadius: style.borderRadius,
    };
  }, selector);

  await browser.close();

  return data;
};

module.exports = { runInspection };
