const express = require('express');
const { createCategoryController, updateCategoryController, categoryControlller, singleCategoryController, deleteCategoryController }= require ('../controllers/categoryControllers');
const  { requireSignIn, isAdmin }= require ('./../middlewares/authMiddle')

const router = express.Router();
//routes
//createCategory
router.post("/create-category", requireSignIn, isAdmin, createCategoryController);

// update category
router.put("/update-category/:id", requireSignIn, isAdmin, updateCategoryController);

//getAll category
router.get("/get-category", categoryControlller);

// single category
router.get("/single-category/:slug", singleCategoryController);

// delete category
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteCategoryController);

module.exports = router;