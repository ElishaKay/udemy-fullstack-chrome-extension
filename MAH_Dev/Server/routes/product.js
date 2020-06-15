const express = require('express');
const router = express.Router();

// controllers
const { saveProducts, savePage, saveProductsFromSearch, savePageFromSearch } = require('../controllers/products');

router.post('/extension/products', saveProducts, savePage);
// router.post('/extension/products-from-search', saveProductsFromSearch, savePageFromSearch);

module.exports = router; 
