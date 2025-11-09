const express = require('express');
const router = express.Router();
const bookshelfController = require('../controllers/bookshelfController');
const requireLogin = require('../middleware/requireLogin');

router.post('/api/bookshelf', requireLogin, bookshelfController.addBook);
router.get('/api/bookshelf', requireLogin, bookshelfController.getBooks);
router.put('/api/bookshelf', requireLogin, bookshelfController.moveBooks);

module.exports = router;