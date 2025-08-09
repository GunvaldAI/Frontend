const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

// Initialize Express app and middleware
const app = express();
app.use(cors());
app.use(express.json());

// Initialize Prisma client
const prisma = new PrismaClient();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Helper to build a prompt for content generation.
 * Generates a JSON array of objects with fields: date, text, hashtags and image_prompt.
 */
function buildContentPrompt(companyName, industry, tone, campaign) {
  return `Create 8 social media posts for a company named ${companyName} in the ${industry} industry. The tone should be ${tone}. The campaign theme is: ${campaign}.\n` +
         `Return your answer as a JSON array with objects containing the fields: date, text, hashtags, and image_prompt.`;
}

/**
 * Generate content using ChatGPT and then generate images using DALL·E.
 * Limits the number of images generated per call to avoid long timeouts. Returns an
 * array of post objects with optional image_url fields.
 */
async function generateContentWithImages(companyName, industry, tone, campaign) {
  const contentPrompt = buildContentPrompt(companyName, industry, tone, campaign);
  // Generate the textual content first using ChatGPT
  const chatResponse = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are a helpful assistant that creates marketing content.' },
      { role: 'user', content: contentPrompt }
    ],
    max_tokens: 1000,
    temperature: 0.7
  });
  const jsonString = chatResponse.choices[0].message.content.trim();
  let posts;
  try {
    posts = JSON.parse(jsonString);
  } catch (err) {
    // fallback: if JSON parsing fails, return empty list
    console.error('Failed to parse JSON from OpenAI:', err);
    return [];
  }
  // Limit number of images to avoid long delays (max 2)
  const MAX_IMAGES = 2;
  for (const [index, post] of posts.entries()) {
    if (!post.image_prompt || index >= MAX_IMAGES) continue;
    try {
      const imageResp = await openai.images.generate({
        prompt: post.image_prompt,
        n: 1,
        size: '512x512'
      });
      if (imageResp && imageResp.data && imageResp.data.length > 0) {
        post.image_url = imageResp.data[0].url;
      }
    } catch (imgErr) {
      console.error('Image generation failed:', imgErr);
      // Image generation errors are non-fatal; continue without image
    }
  }
  return posts;
}

/**
 * Register a new user and create associated organization and brand profile.
 * Expected body: { email, password, name?, companyName?, tone?, industry? }
 */
app.post('/api/register', async (req, res) => {
  const { email, password, name, companyName, tone, industry } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user with nested organization and brand profile
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || companyName || email,
        organizations: {
          create: {
            organization: {
              create: {
                name: companyName || name || email,
                brandProfiles: {
                  create: {
                    name: companyName || name || email,
                    tone: tone || 'neutral',
                    description: industry || null
                  }
                }
              }
            },
            role: 'owner'
          }
        }
      }
    });
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * Login a user. Expected body: { email, password }
 * Returns basic user info on success.
 */
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    return res.json({ success: true, userId: user.id, email: user.email, name: user.name });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * Generate social media posts for a given company/profile.
 * Expected body: { companyName, industry, tone, campaign }
 */
app.post('/api/generate', async (req, res) => {
  const { companyName, industry, tone, campaign } = req.body;
  if (!companyName || !industry) {
    return res.status(400).json({ error: 'companyName and industry are required' });
  }
  try {
    const posts = await generateContentWithImages(companyName, industry, tone || 'neutral', campaign || 'general');
    // In future: store posts in DB associated with a brand profile
    return res.json({ content: posts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to generate content' });
  }
});

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  return res.json({ status: 'ok' });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Gunvald backend running on port ${PORT}`);
});