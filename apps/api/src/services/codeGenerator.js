const generateTailwind = (data) => {
  if (!data) return null;

  const classes = [];

  // Padding
  if (data.padding) {
    const [py, px] = data.padding.split(" ");
    if (py === "8px") classes.push("py-2");
    if (px === "12px") classes.push("px-3");
  }

  // Border radius
  if (data.borderRadius === "9999px") {
    classes.push("rounded-full");
  }

  // Font size
  if (data.fontSize === "14px") {
    classes.push("text-sm");
  }

  // Font weight
  if (data.fontWeight === "400") {
    classes.push("font-normal");
  }

  return `<button class="${classes.join(" ")}">${data.text}</button>`;
};

module.exports = { generateTailwind };
