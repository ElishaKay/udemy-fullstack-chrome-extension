const Product = require('../model/product');
const Page = require('../model/page');

const { smartTrim, enlargePhoto } = require('../helpers/product');

exports.saveProducts = (req, res, next) => {

    let {_id, purchase_year, orderDetails} = req.body;

    for (let y = 0; y < orderDetails.length; y++) {
        let newProduct = new Product();
        let newKeys = orderDetails[y];

        Object.assign(newProduct, newKeys);
        newProduct.product_imgurl = enlargePhoto(newProduct.product_imgurl);

        newProduct.title = newProduct.product_title;
        
        newProduct.postedBy = _id;

        newProduct.save((err, result) => {
            if (err) {
                console.log('this is the error from the newProduct.save call:', err);
                return res.status(400).json({
                    error: `Something went wrong when trying to save the product titled ${newProduct.title}`
                });
            } else {
                console.log('product saved successfully');
            }
        });
    }

    //at end of for loop
    next(); 
};


exports.savePage = (req, res) => {
    const { purchase_year:purchaseYear, page_number:yearlyPageNumber, multi_page:multiPageYear, total_pages:totalPagesOfYear, _id:belongsTo } = req.body;
   
    let page = new Page({ purchaseYear, yearlyPageNumber, multiPageYear, totalPagesOfYear, belongsTo });

    page.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Something went wrong.'
            });
        }
        res.json(data);
    });
};


exports.saveProductsFromSearch = (req, res, next) => {

    // console.log('req.body in saveProductsFromSearch function', req.body);
    let {_id, searchKeyword, searchPageData, searchPageNumber, totalSearchPages} = req.body;
     
    if(searchPageData == null || searchPageNumber == totalSearchPages || searchPageNumber==75){
        return res.json({searchKeyword: searchKeyword, nextWhat:'nextKeyword'});
    } else {
        for (let y = 0; y < searchPageData.length; y++) {
            let newProduct = new Product();
            newProduct.search_keyword = searchKeyword;
            let newKeys = searchPageData[y];

            Object.assign(newPost, newKeys);
            newPost.product_imgurl = enlargePhoto(newPost.product_imgurl);

            newPost.title = newPost.product_title;
           
            // newPost.postedBy = req.user._id;
            // newPost.asin = newPost.product_link != null ? newPost.product_link.split('/dp/')[1].split('/')[0] : '';
            newPost.postedBy = _id;
            
            newPost.product_rating = isNaN(newPost.product_rating) ? delete newPost.product_rating : newPost.product_rating;
            
            newPost.save((err, newPostCreated) => {
                if (err) {
                    if(err.code == 11000){
                        console.log('duplicate key error:', err.errmsg);
                    } else {
                       console.log('this is the error from the newPost.save call:', err);                    
                    }
                    // return res.status(400).json({
                    //     error: errorHandler(err)
                    // });
                } else {
                    console.log('product saved successfully');
                }
            })
        }
    }
    //at end of for loop
    next(); 
};


exports.savePageFromSearch = (req, res) => {
    const {  _id:belongsTo, searchKeyword, totalSearchPages, searchPageNumber } = req.body;
    
    let page = new Page({ belongsTo, searchKeyword, totalSearchPages, searchPageNumber });

    page.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};




