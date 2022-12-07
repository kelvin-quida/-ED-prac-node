import Product from '../models/product.js'
import Order from '../models/Order.js'

export const getProducts = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
      isAuthenticated: req.session.isLoggedIn
    });
  })
  .catch(err => {
    error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  })
}

export const getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => {
      error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
};

export const getIndex = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      isAuthenticated: req.session.isLoggedIn
    })
  })
  .catch(err => {
    error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  })
}

export const getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then(user => {
      const products = user.cart.items
      res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: products,
          isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => {
      error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}    

export const postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product
    .findById(prodId)
    .then(result => {
      req.user.addToCart(result)
      res.redirect('/cart')
    })
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

export const postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemfromCart(prodId)
    .then(result => {
      res.redirect('/cart')
    })
    .catch(err => {
      error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
};

export const getOrders = (req, res, next) => {
  Order
    .find({"user.userId":req.user._id})
    .then((orders) => {
      res.render('shop/orders',{
        path: '/orders',
        pageTitle: 'Your Orders',
        orders:orders,
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => {
      error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
    
};
 

export const postOrder = (req,res,next) => {
  req.user
    .populate("cart.items.productId")
    .then(user => {
      const products = user.cart.items.map(i => {
        return {product:i.productId._doc, quantity:i.quantity}
      })
      const order = new Order({
        user:{
          email:req.user.email,
          userId:req.user
        },
        products:products
      })
      return order.save()
    })
    .then(() => {
      req.user.clearCart()
    })
    .then(() => {
      res.redirect('/orders')
    })
    .catch(err => {
      error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

