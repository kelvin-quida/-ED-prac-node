import Product from '../models/product.js'
import Order from '../models/order.js'

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
  .catch(err => {console.log(err)})
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
    .catch(err => console.log(err))
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
  .catch(err => {console.log(err)})
}

export const getCart = (req, res, next) => {
  req.session.user
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
    .catch(err => console.log(err))
}    

export const postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product
    .findById(prodId)
    .then(result => {
      req.session.user.addToCart(result)
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
  req.session.user
    .deleteItemfromCart(prodId)
    .then(result => {
      res.redirect('/cart')
    })
    .catch(err => {
      console.log(err)
    })
};

export const getOrders = (req, res, next) => {
  Order
    .find({"user.userId":req.session.user._id})
    .then((orders) => {
      res.render('shop/orders',{
        path: '/orders',
        pageTitle: 'Your Orders',
        orders:orders,
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => {
      console.log(err)
    })
    
};
 

export const postOrder = (req,res,next) => {
  req.session.user
    .populate("cart.items.productId")
    .then(user => {
      const products = user.cart.items.map(i => {
        return {product:i.productId._doc, quantity:i.quantity}
      })
      const order = new Order({
        user:{
          name:req.session.user.name,
          userId:req.session.user
        },
        products:products
      })
      return order.save()
    })
    .then(() => {
      req.session.user.clearCart()
    })
    .then(() => {
      res.redirect('/orders')
    })
    .catch(err => console.log(err))
}

