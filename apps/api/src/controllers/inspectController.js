const { runInspection } = require("../services/inspectService");
const { generateTailwind } = require("../services/codeGenerator");

const inspectElement = async (req, res) => {
  try {
    const { url, selector } = req.body;

    const data = await runInspection(url, selector);

    const tailwind = generateTailwind(data);

    res.json({
      ...data,
      tailwind,
    });
  } catch (error) {
    res.status(500).json({ error: "Inspection failed" });
  }
};

module.exports = { inspectElement };
