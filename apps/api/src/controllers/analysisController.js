const prisma = require("../prisma");
const { runAnalysis } = require("../services/analysisService");

// Create Analysis
const createAnalysis = async (req, res) => {
  try {
    const { url } = req.body;

    let formattedUrl = url;

    if (!url.startsWith("http")) {
      formattedUrl = "https://" + url;
    }

    const domain = new URL(formattedUrl).hostname;

    const analysis = await prisma.analysis.create({
      data: {
        url: formattedUrl,
        domain,
        status: "pending",
      },
    });

    // Trigger analysis async
    runAnalysis(analysis.id, formattedUrl); // ✅

    res.json(analysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create analysis" });
  }
};

// Get Analyses
const getAnalyses = async (req, res) => {
  try {
    const analyses = await prisma.analysis.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(analyses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analyses" });
  }
};

module.exports = { createAnalysis, getAnalyses };
