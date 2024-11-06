const productModel = require('../model/productModel'); 

//get shop page
exports.getShopPage = async (req, res) => {
    try {
        const products = await productModel.getAllProducts();
        console.log('Fetched products:', products);  
        const user = req.session.user || null; 
        res.render('shop', { products, user }); 
    } catch (error) {
        console.error('Error fetching products:', error);  
        res.status(500).send('Internal Server Error');
    }
};

