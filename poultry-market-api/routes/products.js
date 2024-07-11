const express = require('express');
const multer = require('multer');
const {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
} = require('../controllers/products');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

router
  .route('/')
  .get(getAllProducts)
  .post(upload.array('images'), createProduct)
  .delete(deleteAllProducts);
router.route('/:id').get(getProduct).patch(updateProduct).delete(deleteProduct);

module.exports = router;
