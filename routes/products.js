const router = require("express").Router();
const Product = require("../models/Product");
const bcrypt = require("bcrypt");

//Create
router.post("/products/create", async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const saveProduct = await newProduct.save();
    res.status(200).send(saveProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

//Read
router.get("/products", async (req, res) => {
    console.log("read test");
  try {
    const products = await Product.find({});
    res.send(products);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Update
router.put("/products/:id", async (req, res) => {
  if (req.body.userId == req.params.id) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(500).json(updatedProduct);
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.status(401).send("You can only Update your Profile");
  }
});

//Delete
router.delete('/products/:id',async(req,res)=>{
    try {
        const products = await Product.findByIdAndDelete(req.params.id)
        if(!products){
            return res.status(404).send();
        }
        res.status(200).send(user);
        
    } catch (e) {
        res.status(500).send();
    }
})

module.exports = router;
