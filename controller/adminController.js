const db = require('../config/db'); 

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
    const product_image = req.file ? req.file.path.replace(/\\/g, '/') : null;  

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

// Get Edit Product Page
exports.getEditProductPage = async (req, res) => {
  const productId = req.params.id;
  try {
    const [product] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);

    if (product.length === 0) {
      return res.status(404).send('Product not found');
    }

    const errors = req.query.errors ? req.query.errors.split(',') : [];
    const success = req.query.success || null;

    res.render('admin/editProduct', { product: product[0], errors, success });
  } catch (error) {
    console.error('Error fetching product for edit:', error);
    res.status(500).send('Error fetching product for editing');
  }
};


// Post Edit Product
exports.postEditProduct = async (req, res) => {
  const productId = req.params.id;
  const { product_name, price, quantity } = req.body;
  let product_image = req.file ? req.file.path.replace(/\\/g, '/') : null;

  try {
    const [product] = await db.query('SELECT product_image FROM products WHERE id = ?', [productId]);

    if (product.length === 0) {
      return res.status(404).send('Product not found');
    }

    // If no new image was uploaded, keep the current image
    if (!product_image) {
      product_image = product[0].product_image;
    }

    const errors = [];
    if (!product_name) errors.push('Product name is required.');
    if (!price) errors.push('Price is required.');
    if (!quantity) errors.push('Quantity is required.');

    if (errors.length > 0) {
      return res.redirect(`/admin/edit-product/${productId}?errors=${encodeURIComponent(errors.join(','))}`);
    }
    await db.query(
      'UPDATE products SET product_name = ?, price = ?, quantity = ?, product_image = ? WHERE id = ?',
      [product_name, price, quantity, product_image, productId]
    );

    res.redirect('/admin/products?success=Product updated successfully.');
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).send('Error updating product');
  }
};


  
  
