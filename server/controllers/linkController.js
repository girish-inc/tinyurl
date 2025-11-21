const prisma = require('../prisma');
const { generateUniqueCode, codeRegex } = require('../utils/generateCode');

/**
 * Creates a new short link.
 * Validates URL and code format, handles custom code conflicts.
 */
async function createLink(req, res, next) {
    const { url, customCode } = req.body;

    // Validate URL
    try {
        new URL(url);
    } catch {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    // Generate or validate code
    let code;
    try {
        code = await generateUniqueCode(customCode);
    } catch (error) {
        if (error.message.includes('Custom code must be')) {
            return res.status(400).json({ error: error.message });
        }
        if (error.message.includes('Custom code already taken')) {
            return res.status(409).json({ error: error.message });
        }
        return next(error);
    }

    // Create link in database
    try {
        const link = await prisma.link.create({
            data: {
                code,
                target: url,
            },
        });
        return res.status(201).json(link);
    } catch (error) {
        if (error.code === 'P2002') { // Unique constraint violation
            return res.status(409).json({ error: 'Custom code already taken' });
        }
        return next(error);
    }
}

/**
 * Gets all links, ordered by creation date (newest first).
 */
async function getAllLinks(req, res, next) {
    try {
        const links = await prisma.link.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(links);
    } catch (error) {
        return next(error);
    }
}

/**
 * Gets a single link by code.
 */
async function getOneLink(req, res, next) {
    try {
        const { code } = req.params;
        const link = await prisma.link.findUnique({ where: { code } });

        if (!link) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.json(link);
    } catch (error) {
        return next(error);
    }
}

/**
 * Deletes a link by code.
 */
async function deleteLink(req, res, next) {
    const { code } = req.params;

    try {
        await prisma.link.delete({ where: { code } });
        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025') { // Record not found
            return res.status(404).json({ error: 'Link not found' });
        }
        return next(error);
    }
}

module.exports = {
    createLink,
    getAllLinks,
    getOneLink,
    deleteLink,
};


