const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function generatePrompt(companyName, industry, tone, campaign) {
  return `Create 8 social media posts for a company named ${companyName} in the ${industry} industry. Tone should be ${tone}. The campaign theme is ${campaign}. Return the posts in JSON array with fields: date, text, hashtags, image_prompt.`;
}

app.post('/api/generate', async (req, res) => {
  const { companyName, industry, tone, campaign } = req.body;
  try {
    const prompt = generatePrompt(companyName, industry, tone, campaign);
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful assistant for creating marketing content.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });
    const responseText = completion.data.choices[0].message.content;
    res.json({ posts: responseText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Gunvald backend running on port ${PORT}`);
});
