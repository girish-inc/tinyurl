const express = require('express');
const {
    createLink,
    getAllLinks,
    getOneLink,
    deleteLink,
} = require('../controllers/linkController');

const router = express.Router();

// POST /api/links → create a new short link
router.post('/', createLink);

// GET /api/links → get all links
router.get('/', getAllLinks);

// GET /api/links/:code → get a single link by code
router.get('/:code', getOneLink);

// DELETE /api/links/:code → delete a link by code
router.delete('/:code', deleteLink);

module.exports = router;


