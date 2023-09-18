const express = require ('express')
const { createProductController, deleteProductController, getProductController, getSingleProductController, productPhotoController, updateProductController, productFilterController, productCountController, productListController, searchProductController, realtedProductController, braintreeTokenController, brainTreePaymentController, productCategoryController } = require ('../controllers/productController')
const { isAdmin, requireSignIn } = require ('../middlewares/authMiddle')
const formidable = require ('express-formidable')

const router = express.Router();

//routes
router.post("/create-product", requireSignIn, isAdmin, formidable(), createProductController);

//routes
router.put("/update-product/:pid", requireSignIn, isAdmin, formidable(), updateProductController);

//get product
router.get("/get-product", getProductController);

//single product
router.get("/get-product/:slug", getSingleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete product
router.delete("/delete-product/:pid", deleteProductController);

//filter product
router.post("/product-filters", productFilterController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController)

//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

module.exports = router;

