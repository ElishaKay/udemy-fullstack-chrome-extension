const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            min: 3,
            max: 160,
            required: true
        }, 
        body: {
            type: {},
            min: 200,
            max: 2000000
        },
        excerpt: {
            type: String,
            max: 1000
        },
        mtitle: {
            type: String
        },
        mdesc: {
            type: String
        },
        product_by: {
            type: String
        },
        product_cost: {
            type: String
        },
        product_link: {
            type: String
        },
        product_imgurl: {
            type: String
        },
        purchase_year: {
            type: Number
        },
        best_seller: { 
            type: Boolean, 
            default: false 
        }, 
        product_rating: {
            type: Number
        },
        total_ratings: {
            type: Number
        },
        main_format: {
            type: String
        },
        search_keyword:{
            type: String
        },
        asin: {
            type: String
        },
        product_summary: {
            type: String
        }, 
        product_reviews: {
            type: Array
        },
        postedBy: {
            type: ObjectId,
            ref: 'User'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
