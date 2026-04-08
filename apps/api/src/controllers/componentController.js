const prisma = require("../prisma");

// Save component

const saveComponent = async (req, res) => {
  try {
    console.log("BODY:", req.body); // 🔥 ADD THIS LINE HERE

    if (!req.body) {
      return res.status(400).json({ error: "No body received" });
    }

    const { tag, text, styles, tailwind } = req.body;

    const component = await prisma.component.create({
      data: {
        tag,
        text,
        styles: JSON.stringify(styles),
        tailwind,
      },
    });

    res.json(component);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get components
const getComponents = async (req, res) => {
  try {
    const components = await prisma.component.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(components);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch components" });
  }
};

module.exports = { saveComponent, getComponents };
