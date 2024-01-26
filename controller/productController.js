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

const getProduct = async (req, res) => {
  console.log('req: ', req.query);
  try {
    const itemsPerPage = parseInt(req.query.itemsPerPage);
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * itemsPerPage;
    const allProducts = await Product.find().skip(startIndex ).limit(itemsPerPage);
    const totalItems = await Product.countDocuments();

    const metadata = {
      currentPage: page,
      itemsPerPage,
        totalPages: Math.ceil(totalItems / itemsPerPage),
    }
    res.json({
      success: true,
      message: 'All products have been fetched successfully',
      products: allProducts,
      metadata
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
};

const getProductsByUserId = async (req, res) => {
  console.log('req: ', req.query);
  try {
    const userId = req.params.userId;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Handle case where user has no associated products
    if (!user.product || user.product.length === 0) {
      return res.json({
        success: true,
        message: 'User has no associated products',
        products: [],
      });
    }

    // Fetch products by user ID and populate product details
    const userProducts = await Product.find({
      _id: Array.isArray(user.product) ? { $in: user.product } : user.product
    }).populate('owner', 'productName otherField'); 

    res.json({
      success: true,
      message: 'Products fetched successfully for the specified user ID',
      products: userProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    console.log(req.user)
    const productId = req.params.id;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }
    // Delete the product
    await product.deleteOne();
    console.log('Product ID to delete:', productId);
    res.json({
      success: true,
      message: 'Product deleted successfully.',
      deletedProduct: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};
module.exports = { createProduct, getProduct, getProductsByUserId,deleteProduct };
