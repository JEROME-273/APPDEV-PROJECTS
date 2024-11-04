const db = require('../db'); 

//get product page
exports.getProducts = async (req, res) => {
    try {
      const [products] = await db.query('SELECT * FROM products');
      products.forEach(product => {
        product.price = parseFloat(product.price);
      });
      res.render('admin/product', { products });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Error fetching products');
    }
  };
  

//get addProduct page
exports.getAddProductPage = (req, res) => {
    const errors = req.query.errors ? req.query.errors.split(',') : [];
    const success = req.query.success || null;
    res.render('admin/addProduct', { errors, success });
  };
  
  //add product to db
  exports.postAddProduct = async (req, res) => {
    const { product_name, price, quantity } = req.body;
    const product_image = req.file ? req.file.path : null;  
  
    const errors = [];
    if (!product_name) errors.push('Product name is required.');
    if (!price) errors.push('Price is required.');
    if (!quantity) errors.push('Quantity is required.');
  
    if (errors.length > 0) {
      return res.redirect(`/admin/add-product?errors=${encodeURIComponent(errors.join(','))}`);
    }
  
    try {
      await db.query(
        'INSERT INTO products (product_name, price, quantity, product_image) VALUES (?, ?, ?, ?)',
        [product_name, price, quantity, product_image]
      );
      res.redirect('/admin/products?success=Product added successfully.');
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).send('Error adding product');
    }
  };
  
  
