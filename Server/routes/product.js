const express = require('express');
const router = express.Router();

// controllers
const { saveProducts, savePage, saveProductsFromSearch, savePageFromSearch } = require('../controllers/product');

router.post('/', saveProducts, savePage);
// router.post('/extension/products-from-search', saveProductsFromSearch, savePageFromSearch);

module.exports = router; 
