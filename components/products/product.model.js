const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reviewSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user' //name of an another collection
    },
    point:{
        type: Number,
        min: 1,
        max: 5
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})
const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    quantity: Number,
    modelNo: String,
    attribute: {
        type : String
    },
    category: {
        type: String,
        required: true
    },
    color: String,
    brand: String,
    price: Number,
    costPrice: Number,
    size: String,

    //Seller Info
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'user' //Name of an another collection
    },
            //     So while your schema says this:
            // vendor: {
            //     type: Schema.Types.ObjectId,
            //     ref: 'user'
            // },
            // Your actual stored property should read something like this:
            // 
            //   vendor: {
            //     "59ab1b43ea84486fb4ba9ef0",
            //      }
            //And after populating this we get all the information of vendor
    images:[String],
    sku: Number,
    rating: Number,
    stock_quantity: Number,
    status: {
        type: String,
        enum: ['available', 'out-of-stock', 'booked'],
        default: 'available'
    },
    reviews: [reviewSchema],
    manuDate: Date,
    expiryDate: Date,
    purchasedDate: Date,
    salesDate: Date,
    discount: {
        discountedItem: Boolean,
        discountType:{
            type: String,
            enum: ['percentage', 'quantity', 'value']
        },
        discountValue: String
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    isReturnEligible: Boolean,
    warrentyStatus: Boolean,
    warrentyPeriod: Number,
    origin: String,
    tags: [String],
    offers: [String],
    orderNumber: Number,
    
}, {
    timestamps: true
})
module.exports = mongoose.model('product', ProductSchema)