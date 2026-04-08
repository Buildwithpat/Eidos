const archiver = require("archiver");
const prisma = require("../prisma");

const exportData = async (req, res) => {
  try {
    const components = await prisma.component.findMany();
    const analyses = await prisma.analysis.findMany();

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=eidos-export.zip",
    );

    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.pipe(res);

    // Components JSON
    archive.append(JSON.stringify(components, null, 2), {
      name: "components.json",
    });

    // Analysis JSON
    archive.append(JSON.stringify(analyses, null, 2), {
      name: "design-system.json",
    });

    // HTML Export
    const html = components.map((c) => c.tailwind).join("\n");

    archive.append(html, {
      name: "components.html",
    });

    await archive.finalize();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Export failed" });
  }
};

module.exports = { exportData };
