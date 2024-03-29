import Product from '../models/product.js';
import mongodb from 'mongodb'
import product from '../models/product.js';
import { validationResult } from 'express-validator';

export const getProducts = (req, res, next) => {
  Product
  .find({userId:req.user._id})
  // .select('title price')
  // .populate('userId','name')
  .then(products => {
    console.log(products)
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      isAuthenticated: req.session.isLoggedIn
    });
  })
  .catch(err => console.log(err))
};

export const getAddProduct = (req, res, next) => {
  if (!req.session.isLoggedIn){
    return res.redirect('/login')
  }
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError:false,
    errorMessage:null,
    isAuthenticated: req.session.isLoggedIn
  });
};

export const postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const imageUrl = req.body.image;
  const errors = validationResult(req)

  if(!errors.isEmpty()){
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: false,
      hasError:true,
      product: {
        title:title,
        imageUrl:imageUrl,
        price:price,
        description:description
      },
      errorMessage: errors.array()[0].msg,
      isAuthenticated: req.session.isLoggedIn
    })
  }
  const product = new Product({
    title:title,
    price:price,
    description:description,
    imageUrl:imageUrl,
    userId:req.user,
  })
  product
  .save()
  .then(result => {
      console.log("Created Product");
      res.redirect("/admin/products")
    })
    .catch(err => {
      error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
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
      product: product,
      hasError:false,
      errorMessage: null,
      isAuthenticated: req.session.isLoggedIn
    })
  })
  .catch(err => {
    error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  })
};

export const postEditProduct = (req, res, next) => {
  const prodId = req.body.productId
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;
  
  const errors = validationResult(req)

  if(!errors.isEmpty()){
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edir Product',
      path: '/admin/edit-product',
      editing: true,
      hasError:true,
      product: {
        title:updatedTitle,
        imageUrl:updatedImageUrl,
        price:updatedPrice,
        description:updatedDesc,
        _id:prodId
      },
      errorMessage: errors.array()[0].msg,
      isAuthenticated: req.session.isLoggedIn
    })
  }

  Product
    .findById(prodId)
      .then(product => {
        if(product.userId.toString() == req.user._id.toString()){
          product.title=updatedTitle
          product.price=updatedPrice
          product.imageUrl=updatedImageUrl
          product.descriptionupdatedDesc
          return product.save().then(result => {
            console.log("SUCCESSFULLY UPDATED!")
            res.redirect('/admin/products');
          })
        }
      })
      .catch(err => {
        error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })
};

export const postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product
    .deleteOne({_id:prodId, userId:req.user._id})
    .then(result => {
      console.log("SUCCESSFULLY DESTROYED")
      return res.redirect("/admin/products")
    })
    .catch(err => {
      error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
};
