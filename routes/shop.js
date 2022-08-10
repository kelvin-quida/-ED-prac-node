import { Router } from 'express';
import { getIndex, getProducts,getProduct,postCart } from '../controllers/shop.js';

const router = Router()

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/products/:productId', getProduct);

// router.get('/cart', getCart);

router.post('/cart', postCart);

// router.post('/cart-delete-item', shopController.postCartDeleteProduct);

// router.post('/create-order', shopController.postOrder)

// router.get('/orders', shopController.getOrders);

export default router