const { customAlphabet } = require('nanoid');
const prisma = require('../prisma');

// Code validation regex: 6-8 alphanumeric characters
const codeRegex = /^[A-Za-z0-9]{6,8}$/;

// Custom alphabet for nanoid: A-Z, a-z, 0-9
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generates a unique code for a link.
 * If customCode is provided, validates it and checks if it's available.
 * Otherwise, generates a random code using nanoid with collision retry (6→7→8 length).
 * 
 * @param {string} [customCode] - Optional custom code to validate
 * @returns {Promise<string>} - A valid code (6-8 alphanumeric characters)
 * @throws {Error} - If customCode is invalid format or already taken
 */
async function generateUniqueCode(customCode) {
    // If custom code provided, validate format and check availability
    if (customCode) {
        if (!codeRegex.test(customCode)) {
            throw new Error('Custom code must be 6–8 alphanumeric characters');
        }
        
        // Check if custom code already exists
        const existing = await prisma.link.findUnique({
            where: { code: customCode }
        });
        
        if (existing) {
            throw new Error('Custom code already taken');
        }
        
        return customCode;
    }

    // Generate random code with collision retry: try length 6, then 7, then 8
    for (let length = 6; length <= 8; length++) {
        const nanoid = customAlphabet(alphabet, length);
        const code = nanoid();
        
        // Check for collision
        const existing = await prisma.link.findUnique({
            where: { code }
        });
        
        if (!existing) {
            return code;
        }
    }
    
    // Extremely unlikely: all attempts collided
    throw new Error('Failed to generate unique code after retries');
}

module.exports = { generateUniqueCode, codeRegex };


