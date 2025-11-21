const { PrismaClient } = require('@prisma/client');

// Create a single PrismaClient instance to be shared across the application
const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

module.exports = prisma;


