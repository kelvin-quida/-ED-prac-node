import Product from '../models/product.js';
import mongodb from 'mongodb'

export const getProducts = (req, res, next) => {
  Product
  .find({})
  .then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err => console.log(err))
};

export const getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

export const postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;
  const product = new Product({
    title:title,
    price:price,
    description:description,
    imageUrl:imageUrl
  })
  product
  .save()
  .then(result => {
      console.log("Created Product");
      res.redirect("/admin/products")
    })
    .catch(err => {
      console.log(err);
    })
};

export const getEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  Product
  .findById(prodId)
  .then( product => {
    console.log(product)
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    })
  })
  .catch(err => console.log(err))
};

export const postEditProduct = (req, res, next) => {
  const prodId = req.body.productId
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  
  Product
    .findByIdAndUpdate(prodId,{
      $set:{
        title:updatedTitle,
        price:updatedPrice,
        imageUrl:updatedImageUrl,
        description:updatedDesc  
      }
    })
    .then(result => {
      console.log("SUCCESSFULLY UPDATED!")
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err))
};

export const postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product
    .deleteOne({_id:prodId})
    .then(result => {
      console.log("SUCCESSFULLY DESTROYED")
      return res.redirect("/admin/products")
    })
    .catch(err => {
      console.log(err)
    })
};
