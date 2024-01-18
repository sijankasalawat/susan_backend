const Product = require("../model/product");
const User = require("../model/userModel");
const cloudinary = require("cloudinary");

const createProduct = async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  try {
    // Extract product data from the request body
    const { category, brandName, details, contactNo, address, price } = req.body;
    const { productImage } = req.files;

    // Validate data
    if (!category || !brandName || !details || !contactNo || !address || !price || !productImage) {
      return res.status(400).json({
        success: false,
        message: "Please enter all fields",
      });
    }

    // Assuming you have the user's ID from the authentication token
    const userId = req.user.id; // You need to extract the user ID from the authentication token

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // upload image to Cloudinary
    const uploadedImage = await cloudinary.v2.uploader.upload(
      productImage.path,
      { folder: "products", crop: "scale" }
    );

    if (!uploadedImage || !uploadedImage.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload image to Cloudinary",
      });
    }

    // Create a new product
    const newProduct = new Product({
      owner: userId,
      category,
      brandName,
      details,
      contactNo,
      address,
      price,
      productImage: uploadedImage.secure_url,
    });

    // Save the product to the database
    await newProduct.save();

    // Add the product to the user's products array
    user.product.push(newProduct._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product: newProduct,
    });
  } catch (error) {
    console.error(error);

    // Handle specific error cases
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error. Please check your input.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = { createProduct };
