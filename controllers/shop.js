import Product from '../models/product.js'
// import Order from '../models/order'

export const getProducts = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  })
  .catch(err => {console.log(err)})
}

export const getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      })
    })
    .catch(err => console.log(err))
};

export const getIndex = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    })
  })
  .catch(err => {console.log(err)})
}

export const getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(products => {
      res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: products
      })
    })
    .catch(err => console.log(err))
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
      console.log(err)
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
      console.log(err)
    })
};

export const postOrder = (req,res,next) => {
  req.user
    .addOrder()
    .then(() => {
      res.redirect('/orders')
    })
    .catch(err => console.log(err))
}

export const getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      res.render('shop/orders',{
        path: '/orders',
        pageTitle: 'Your Orders',
        orders:orders
      })
    })
    .catch(err => {
      console.log(err)
    })
    
};
 