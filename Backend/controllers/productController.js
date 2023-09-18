const productModel = require("../models/productModel.js");
const orderModel =require("../models/orderModel.js")
const categoryModel = require("../models/categoryModel.js")
const  slugify  = require("slugify");
const fs = require("fs");
const braintree = require("braintree")
require('dotenv').config();

//payment gateway
let gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
})

const createProductController = async(req, res) =>{
    try {
        const{name, description, price, category, quantity, shipping, avgRating, rating, badge, brand } = req.fields;
        const {photo} = req.files;
        //alidation
        switch (true){
            case !name:
                return res.status(500).send({error: "Name is Required"});
            case !description:
                return res.status(500).send({error: "Description is Required"});
            case !price:
                return res.status(500).send({error: "Price is Required"});
            case !quantity:
                return res.status(500).send({error: "Quantity is Required"});
            case !category:
                return res.status(500).send({error: "Category is Required"});
            case photo:
                return res.status(500).send({error: "Photo is Required"});
            case !avgRating:
                return res.status(500).send({error: "avgRating is Required"});
            case !rating:
                return res.status(500).send({error: "rating is Required"});
            case !badge:
                return res.status(500).send({error: "badge is Required"});
            case !brand:
                return res.status(500).send({error: "brand is Required"});
        }
        const products = new productModel({...req.fields, slug:slugify(name)});
        if (photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success:true,
            message: "Product is Created",
            products,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in Creating Product",
        });
    }
};
//get all products
const getProductController = async(req, res) =>{
    try {
        const products = await productModel
            .find({})
            .populate("category")
            .select("-photo")
            .limit(12)
            .sort({createdAt: -1});
            res.status(200).send({
                success: true,
                counTotal: products.length,
                message: "All products",
                products,
            });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in getting Products",
            error: error.message
        });
        
    }
};
//get single Product
const getSingleProductController = async (req, res) => {
    try {
      const product = await productModel
        .findOne({ slug: req.params.slug })
        .select("-photo")
        .populate("category");
      res.status(200).send({
        success: true,
        message: "Single Product Fetched",
        product,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Eror while getitng single product",
        error,
      });
    }
  };
//get photo
const productPhotoController = async(req, res) =>{
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if(product.photo.data){
            res.set("content-type", product.photo.contentType)
            return res.status(200).send(product.photo.data);
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message:"Error while getting product",
            error,
        });
        
    }
};
// delete controller
const deleteProductController = async(req, res) =>{
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success: true,
            message: "Product delected successfully",
        });
    } catch (error) {
        consoel.log(error)
        res.status(500).send({
            success: false,
            message: "Error while deleting Product",
            error,
        });
    }
};
// update products
const updateProductController = async(req, res) =>{
    try {
        const{name, description, price, category, quantity, shipping, avgRating, rating, badge, brand} = res.fields;
        const {photo} = res.files;
        //alidation
        switch (true){
            case !name:
                return res.status(500).send({error: "Name is Required"});
            case !description:
                return res.status(500).send({error: "Description is Required"});
            case !price:
                return res.status(500).send({error: "Price is Required"});
            case !quantity:
                return res.status(500).send({error: "Quantity is Required"});
            case !category:
                return res.status(500).send({error: "Category is Required"});
            case photo:
                return res.status(500).send({error: "Photo is Required"});
            case avgRating:
                return res.status(500).send({error: "avgRating is Required"});
            case !rating:
                return res.status(500).send({error: "rating is Required"});
            case !badge:
                return res.status(500).send({error: "badge is Required"});
            case !brand:
                return res.status(500).send({error: "brand is Required"});   
        }
        const products = await productModel.findByIdAndUpdate(
            req.params.pid,
            {...req.fields, slug: slugify(name)},
            {new: true}
            );
            if(photo){
                products.photo.data = fs.readFileSync(photo.path);
                products.photo.contentType = photo.type;
            }
            await products.save();
            res.status(201).send({
                success: true,
                message: "Updated successfully",
                products,
            });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "error in update product"
        });
    }
};
//filters
const productFilterController = async (req, res) => {
    try {
        const {checked, radio} = req.body;
        let args= {};
        if(checked.length > 0) args.category = checked;
        if(radio.length) args.price = {$gte: radio[0], $lte: radio[1]};
        const products = await productModel.find(args);
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:"Error while filtering products",
            error,
        });
    }
};
const productCountController = async (req, res) =>{
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message:"error in product count",
            error,
            success:false,
        });
    }
};

//product list base on page
const productListController = async (req, res) =>{
    try {
        const perPage = 12;
        const page = req.params.page ? req.params.page :1
        const products = await productModel
        .find({})
        .select("-photo")
        .skip((page - 1)*perPage)
        .limit(perPage)
        .sort({createdAt: -1});
        res.status(200).send({
            success: true,
            products,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message:"error in per page ",
            error,
        });
    }
};

//search product
const searchProductController = async (req, res) => {
    try {
        const { keyword} = req.params;
        const results = await productModel.find({
            $or: [
                { name: {$regex: keyword, $options: "i"}},
                { description: { $regex: keyword, $options: "i"}},
            ],
        })
        .select("-photo");
        res.json(results);
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "error in search product api",
            error,
        });
    }
};
// similar products
const realtedProductController = async (req, res) => {
    try {
      const { pid, cid } = req.params;
      const products = await productModel
        .find({
          category: cid,
          _id: { $ne: pid },
        })
        .select("-photo")
        .limit(3)
        .populate("category");
      res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "error while geting related product",
        error,
      });
    }
  };

  // get prdocyst by catgory
const productCategoryController = async (req, res) => {
    try {
      const category = await categoryModel.findOne({ slug: req.params.slug });
      const products = await productModel.find({ category }).populate("category");
      res.status(200).send({
        success: true,
        category,
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        error,
        message: "Error While Getting products",
      });
    }
  };
  //payment gateway api
//token
const braintreeTokenController = async (req, res) => {
    try {
      gateway.clientToken.generate({}, function (err, response) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(response);
        }
      });
    } catch (error) {
      console.log(error);
    }
};
//payment
const brainTreePaymentController = async (req, res) => {
    try {
      const { nonce, cart } = req.body;
      let total = 0;
      cart.map((i) => {
        total += i.price;
      });
      let newTransaction = gateway.transaction.sale(
        {
          amount: total,
          paymentMethodNonce: nonce,
          options: {
            submitForSettlement: true,
          },
        },
        function (error, result) {
          if (result) {
            const order = new orderModel({
              products: cart,
              payment: result,
              buyer: req.user._id,
            }).save();
            res.json({ ok: true });
          } else {
            res.status(500).send(error);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
};


module.exports ={createProductController, getSingleProductController ,getProductController, productPhotoController, deleteProductController, updateProductController, productFilterController, productCountController, productListController, searchProductController, realtedProductController, productCategoryController, braintreeTokenController, brainTreePaymentController}