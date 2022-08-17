import { Router } from 'express';
import { getProducts,getAddProduct,postAddProduct,getEditProduct, postEditProduct,postDeleteProduct } from '../controllers/admin.js';

const router = Router()

// // /admin/products => GET
router.get('/products',getProducts);

// // /admin/add-product => GET
router.get('/add-product', getAddProduct);

// // /admin/add-product => POST
router.post('/add-product', postAddProduct);

router.get('/edit-product/:productId', getEditProduct);

// router.post('/edit-product', postEditProduct);

// router.post('/delete-product', postDeleteProduct);

export default router;
