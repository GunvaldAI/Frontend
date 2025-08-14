// updateAllowedOrigins.js
// This script updates the allowed_origins for your Clerk instance using the Backend API.
// Set the CLERK_SECRET environment variable to your Clerk secret key before running.
// Optionally set ALLOWED_ORIGINS (comma-separated) to customize domains; defaults to gunvald.fi and www.gunvald.fi.

const secret = process.env.CLERK_SECRET;
if (!secret) {
  console.error('Missing CLERK_SECRET environment variable.');
  process.exit(1);
}

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim())
  : ['https://gunvald.fi', 'https://www.gunvald.fi'];

async function updateAllowedOrigins() {
  try {
    const response = await fetch('https://api.clerk.com/v1/instance', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({
        allowed_origins: allowedOrigins,
      }),
    });

    const text = await response.text();
    console.log('Status:', response.status);
    console.log(text);
  } catch (err) {
    console.error('Error updating allowed origins:', err);
  }
}

updateAllowedOrigins();
