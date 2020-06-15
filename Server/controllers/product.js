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



