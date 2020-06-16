const express = require('express');
const router = express.Router();

// controllers
const { saveProducts, savePage, saveProductsFromSearch, savePageFromSearch } = require('../controllers/product');

router.post('/products-from-history', saveProducts, savePage);
router.post('/products-from-search', saveProductsFromSearch, savePageFromSearch);

module.exports = router; 
