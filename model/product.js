const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
    },
    category: {
        type: String,
        enum: ['Electronic', 'Automobile'], 
    },
    brandName: {
        type: String,
        require: true,
    },
    details: {
        type: String,
        require: true,
    },
    contactNo: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        require: true,
    },
    time: {
        type: String,
        require: true,
    },  
    price: {
        type: String,
        require: true,
    },
    productImage: {
        type: String,
        require: true,
    },
});

module.exports = mongoose.model('Product', productSchema);
