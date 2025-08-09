// Prisma client singleton

const { PrismaClient } = require('@prisma/client');

// Create a single PrismaClient instance to be shared across modules.
const prisma = new PrismaClient();

// Export the instance for use in routes and services.
module.exports = prisma;