const fs = require("fs");
const model = require("../config/gemini");

async function analyzeImage(imagePath, mimeType, prompt) {
  const base64Image = fs.readFileSync(imagePath).toString("base64");

  const result = await model.generateContent({
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    ],
  });

  const response = await result.response;
  return await response.text();
}

module.exports = {
  analyzeImage,
};