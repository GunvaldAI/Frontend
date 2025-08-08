const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function generatePrompt(companyName, industry, tone, campaign) {
  return `Create 8 social media posts for a company named ${companyName} in the ${industry} industry. Tone should be ${tone}. The campaign theme is ${campaign}. Return the posts in JSON array with fields: date, text, hashtags, image_prompt.`;
}

app.post('/api/generate', async (req, res) => {
  const { companyName, industry, tone, campaign } = req.body;
  try {
    const prompt = generatePrompt(companyName, industry, tone, campaign);
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful assistant for creating marketing content.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });
    const content = completion.choices[0].message.content.trim();
    res.status(200).json({ content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
