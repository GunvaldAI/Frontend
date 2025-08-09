const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper to build the prompt for content generation
function buildContentPrompt(companyName, industry, tone, campaign) {
  return `Create 8 social media posts for a company named ${companyName} in the ${industry} industry. The tone should be ${tone} and the campaign theme is ${campaign}. ` +
         `Return your answer as a JSON array with objects containing the fields: date, text, hashtags, and image_prompt. Each date field should be unique and the format should be YYYY-MM-DD. Do not wrap your answer in markdown backticks.`;
}

// Generate content using ChatGPT and then generate images using DALL·E
async function generateContentWithImages(companyName, industry, tone, campaign) {
  // First, create the content via ChatGPT
  const contentPrompt = buildContentPrompt(companyName, industry, tone, campaign);
  const chatResponse = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are a helpful assistant that creates marketing content.' },
      { role: 'user', content: contentPrompt },
    ],
    max_tokens: 1000,
    temperature: 0.7,
  });
  const jsonString = chatResponse.choices[0].message.content.trim();
  let posts;
  try {
    posts = JSON.parse(jsonString);
  } catch (err) {
    throw new Error('Failed to parse content from ChatGPT: ' + err.message);
  }

  // Now, loop through each post and generate an image for its prompt
  for (const post of posts) {
    if (!post.image_prompt) continue;
    try {
      const imgResponse = await openai.images.generate({
        prompt: post.image_prompt,
        n: 1,
        size: '512x512',
      });
      // The new OpenAI Node client returns the images in data array
      if (imgResponse && imgResponse.data && imgResponse.data.length > 0) {
        post.image_url = imgResponse.data[0].url;
      }
    } catch (err) {
      // If image generation fails, continue without it
      console.error('Image generation error:', err.message);
    }
  }

  return posts;
}

// POST endpoint to generate content and images
app.post('/api/generate', async (req, res) => {
  const { companyName, industry, tone, campaign } = req.body;
  if (!companyName || !industry || !tone || !campaign) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const posts = await generateContentWithImages(companyName, industry, tone, campaign);
    res.json({ content: posts });
  } catch (err) {
    console.error('Generation error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate content' });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Gunvald API server running on port ${PORT}`);
});