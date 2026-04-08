const { chromium } = require("playwright");
const prisma = require("../prisma");
const path = require("path");
const fs = require("fs");

const runAnalysis = async (id, url) => {
  const browser = await chromium.launch({ headless: true });
  // ✅ Set a consistent viewport so coordinates always match 1280px width
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  try {
    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;

    console.log(`🔍 Navigating to: ${formattedUrl}`);

    await page.goto(formattedUrl, {
      waitUntil: "domcontentloaded", // Wait for all images/scripts to load
      timeout: 30000,
    });

    // ✅ Trigger Lazy Loading: Scroll down and back up
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);

    const screenshotDir = path.resolve(__dirname, "../../screenshots");
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const fileName = `${id}.png`;
    const fullPath = path.join(screenshotDir, fileName);
    const relativePath = `screenshots/${fileName}`;

    // ✅ Take a full page screenshot
    await page.screenshot({
      path: fullPath,
      fullPage: true,
    });

    const title = (await page.title()) || "Untitled Website";

    // ✅ SMART EXTRACTION: Filter out invisible/utility elements
    // Replace the $$eval block in your runAnalysis function:

    // Inside your runAnalysis function in analysisService.js

    // Replace the elements extraction block in analysisService.js:

    const elements = await page.$$eval(
      "body *:not(script):not(style):not(link):not(noscript)",
      (els) => {
        return els
          .filter((el) => {
            const rect = el.getBoundingClientRect();
            const text = el.innerText?.trim();
            // ✅ Only grab "Visual" elements with content
            return (
              rect.width > 10 && rect.height > 10 && text && text.length > 0
            );
          })
          .map((el) => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            const tag = el.tagName;

            // ✅ Translate Tag to "Human" Category
            let role = "Text Block";
            if (["H1", "H2"].includes(tag)) role = "Main Heading";
            if (["H3", "H4", "H5", "H6"].includes(tag)) role = "Sub-Heading";
            if (
              tag === "BUTTON" ||
              (tag === "A" && el.classList.contains("btn"))
            )
              role = "Action Button";
            if (tag === "A") role = "Link";
            if (tag === "INPUT") role = "Input Field";
            if (tag === "IMG") role = "Image/Asset";

            return {
              role,
              tag,
              text: el.innerText?.slice(0, 60).trim(),
              x: rect.left + window.scrollX,
              y: rect.top + window.scrollY,
              width: rect.width,
              height: rect.height,
              fontSize: style.fontSize,
              color: style.color,
              fontFamily: style.fontFamily?.split(",")[0].replace(/"/g, ""),
            };
          })
          .filter((el) => el.role !== "Text Block" || el.text.length > 5) // Filter out tiny random characters
          .slice(0, 50); // Only the top 50 most important items
      },
    );

    const colors = await page.$$eval("*", (els) =>
      [...new Set(els.map((el) => getComputedStyle(el).color))].slice(0, 8),
    );

    await prisma.analysis.update({
      where: { id },
      data: {
        status: "completed",
        title,
        colors: JSON.stringify(colors),
        elements: JSON.stringify(elements),
        screenshot: relativePath,
      },
    });

    console.log(`✅ Analysis Success: ${title}`);
  } catch (error) {
    console.error("❌ Analysis Error:", error);
    await prisma.analysis.update({
      where: { id },
      data: { status: "failed" },
    });
  } finally {
    await browser.close();
  }
};

module.exports = { runAnalysis };
