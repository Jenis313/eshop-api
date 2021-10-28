//Related with only core database tasks of product

const ProductModel = require('./product.model');

const map_product_req = function(productData, product){
    if(productData.name)
        product.name = productData.name;
    if(productData.category)
    //Why are we checking this if block here? So if we don't check the query it works perfectly for inserting but when it comes to updating the data we have to write update syntax for every elements that exist in a data model because we don't know which element is going to be updated by user so we have to be prepared for all elements so we write syntax for all the properties but user may not always update all the element and at that time if we don't check if that element exist in the request object(productData in our case here) the elements set to undefined because we have written syntax for all element and if value for that syntax doesn't exists in request object then value for that element will be set to undefined and we loose all the previous value for those elements as well. So if we check the condition before updating the values it will only updates the element if its value exists in the request object.
        product.category = productData.category;
    if(productData.description)
        product.description = productData.description;
    if(productData.qualtity)
        product.qualtity = productData.qualtity;
    if(productData.modelNo)
        product.modelNo = productData.modelNo;
    if(productData.color)
        product.color = productData.color;
    if(productData.brand)
        product.brand = productData.brand;
    if(productData.price)
        product.price = productData.price;
    if(productData.costPrice)
        product.costPrice = productData.costPrice;
    if(productData.size)
        product.size = productData.size;
    if(productData.vendor)
        product.vendor = productData.vendor;
    if(productData.images)
        product.images = productData.images;
    if(productData.sku)
        product.sku = productData.sku;
    if(productData.stockQuantity)
        product.stockQuantity = productData.stockQuantity;
    if(productData.status)
        product.status = productData.status;
    if(productData.manuDate)
        product.manuDate = productData.manuDate;
    if(productData.expiryDate)
        product.expiryDate = productData.expiryDate;
    if(productData.purchasedDate)
        product.purchasedDate = productData.purchaseDate;
    if(productData.salesDate)
        product.salesDate = productData.salesDate;
    if(productData.isReturnEligible)
        product.isReturnEligible = true;
    if(productData.setIsReturnEligibleFalse)
        product.isReturnEligible = false;
    if(productData.warrentyStatus)
        product.warrentyStatus = true;
    if(productData.setIsWarrentyStatusFalse)
        product.warrentyStatus = false;
    if(productData.warrentyPeriod)
        product.warrentyPeriod = productData.warrentyPeriod;
    if(productData.origin)
        product.origin = productData.origin;
    if(productData.tags)
        product.tags = typeof(productData.tags) === 'string' ? productData.tags.split(','): productData.tags;
    if(productData.offers)
        product.offers = typeof(productData.offers) === 'string' ? productData.offers.split(',') : productData.offers;
    if(productData.discountedItem)
        product.discount.discountedItem = true;
    if(productData.setDiscountedItemFalse)
        product.discount.discountedItem = false;
    if(productData.discountType)
        product.discount.discountType = productData.discountType;
    if(productData.discountValue)
        product.discount.discountValue = productData.discountValue;
    if(productData.origin)
        product.origin = productData.origin;
    
}

function map_review_data(reviewData, review){
    if(reviewData.user)
        review.user = reviewData.user
    if(reviewData.reviewPoint)
        review.point = reviewData.reviewPoint
    if(reviewData.message)
        review.message = reviewData.message
} 
//CRUD OPERATION
function find(condition){
    return new Promise((resolve, reject) => {
        ProductModel
        .find(condition, {name:1, vendor:1, _id: 1, token:1, reviews: 1 /*THis is just projection part and it is optional*/})
        .sort({
            _id: -1
        })
        .populate('vendor', {username:1, id: 1 })//while this READ function is called, This populate methods converts and gets all the information of the user id saved into the 'vendor' property of data model. So basically it is displaying users information instead of id. Even though we don't declare vendor as string type or something like that in the model, a string value(id of logged in user) is saved when a logged in user creates a product and the job of this populate is to display the whole users information of that saved id
        .populate('reviews.user', {username: 1, email: 1})//same thing but with reviews.user
        .exec((err, products) => {
            if(err){
                return reject(err);
            }
             resolve(products);
        })
    })
    //we dont have to use our own promise here because .exec returns promise so we can just return ProductModel.find().exec()
}
function insert(data){//This 'data' is 'req.body'
    const newProduct = new ProductModel({}); //Instance of product model and now we have to put data coming from request into this instance.
    map_product_req(data, newProduct);
    return newProduct.save() //Instead of saving the returnned value we saving directly newProduct here and it works because of object reference/mutation behavior of non primitive datatypes(object).
    //and about the return keyword, because the .save() returns a promise we don't again make our own promise to return promise, instead we return the promise retruned by .save()
    // we can do this same thing in above function as well.

}
function update(id, data){
    return new Promise((resolve, reject) => {
        ProductModel
        .findById(id, (err, product) => {
            if(err){
                return reject(err)
            }
            if(!product){
                return reject({
                    msg: 'Product Not found',
                    staus: 404
                })
            }
            //if product found Update
            map_product_req(data, product)
            if(data.newImages){
                //In here we can't directly update data.images it just replace previous one but if we create data.newImages in the controller and put the update images into that we can concat that array with the existing array(product.images)
                product.images = product.images.concat(data.newImages);
            }
            product.save((err, updated) => {
                if(err){
                    return reject(err);
                }
                resolve(updated);
            })
        })
    })

}
function remove(id){
   return ProductModel.findByIdAndRemove(id)
}
function addReview(productId, reviewData){
    return new Promise((resolve, reject) => {
        ProductModel
        .findById(productId, (err, product) => {
            if(err){
                return reject(err);
            }
            if(!product){
                return reject({
                    msg: 'Product not found',
                    status: 400
                })
            }
            //Map reviewData
            const newReview = {}
            map_review_data(reviewData, newReview)
            product.reviews.push(newReview);
            product.save((err, result) => {
                if(err){
                    return reject(err);
                }
                resolve(result);
            })
        })
    })
}
module.exports = {
    //We are using object shorthands here
    find,
    insert,
    update,
    remove,
    addReview
}