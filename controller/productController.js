const Products = require("../model/product");
const User = require("../model/userModel");

const createProduct = async (req, res) => {
    try {
        // Step 1: Check incoming data
        console.log(req.body);
        console.log(req.files);

        // Step 2: Destructuring the data
        const { category, brandName, details, contactNo, address, time, price } = req.body;
        // const { productImage } = req.files;

        // Step 3: Validation 
        if (!brandName ||!category || !details || !contactNo || !address || !time || !price) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Step 4: Create a new product instance with the logged-in user's ID
        const newProduct = new Products({
            user: req.user._id, // Use the user ID from the token
            category,
            brandName,
            details,
            contactNo,
            address,
            time,
            price,
            // productImage: productImage.path, // Assuming the path to the image is stored in 'path' property
        });

        // Step 5: Save the product to the database
        await newProduct.save();

        // Step 6: Send a success response
        res.status(201).json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    createProduct,
};
