const productQuery = require('./product.query');

function getImageName(imgUrl){
    return imgUrl.split('images/')[1]
}

function get(req, res, next){
    console.log('Hi from get data middleware')
    const condition = {}
    // todo prepare condition
    if(req.user.role !== 1){
        //we are applying this condition before get request because we don't want anyone else except superadmin to access all the product information instead they should only get whatever they have created.
        condition.vendor = req.user._id;
        //what it is doing is it is applying the condition to the query for database operation like we would do Model.find({some condition})
        //Here's is a bit confusing thing and that is vendor doesnot sotre all the users information itself it just store reference(id because we have put in it while making post request or creating product) and refers the user when we populate and when we use this condition(vendor:req.user._id) it just query with what is in the database not with what we get after populate method.  
    }
    productQuery
    .find(condition)
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        next(err);
    })
}
function post(req, res, next){
    console.log('Hi from post middleware')
    const data = req.body;//This function will be in some method of router like router.post router .get etc so we can have req.body here. In other words it this function is just a middleware that would be inside router.post router.get etc.
    console.log('data is ==> ',data)
    console.log('Images ==> ',req.files);//This will work only if there is multer becouse req.files is the method of multer where we can upload files as well.

    //append necessary properites in data

    //images
    if(req.files&&req.files.length){
        data.images = req.files.map((item) => {
            return item.filename;
        })//we are adding the value in the request body object because this is a middleware and it can add update and delete request.
    }

    //vender
    data.vendor = req.user._id;//req.user is set  by the authenticate middleware.
    //If we call this middleware without 'authentication middleware' before it, we can't set the value of vender. 
    /*vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
      }*///Even though schema is declared like this but we have to put the id of user so that we can later populate and get the user's information of that user.


    productQuery.insert(data)
    .then((result) => {
        res.json(result);
    })
    .catch((err) => {
        next(err);
    })
}
function getById(req, res, next){
    console.log('Hi from getById Middleware')
    const condition = {
        _id : req.params.id
    }
    //todo prepare condition
    productQuery
    .find(condition)
    .then((data) => {
        res.json(data[0]);
    })
    .catch((err) => {
        next(err);
    })
}
function update(req, res, next){
    const data = req.body;
    console.log(req.files)
    if(req.files && req.files.length){
        data.newImages = req.files.map((item) => {
            return item.filename;
        })
    }
    console.log('data is ==> ',data)
    //todo prepare data

    delete data.images; //to avoid if statement in query

    // console.log('files to remove --> ', data.filesToRemove);

    // convert strings to array
    const filesToRemove = data.filesToRemove.split(',').map((item) => {
        return getImageName(item);
    })

    data.filesToRemove = filesToRemove;

    productQuery
    .update(req.params.id, data)
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        next(err);
    })
}
function remove(req, res, next){
    console.log("HI form remove middleware");
    productQuery
    .remove(req.params.id)
    .then((data) => {
        if(!data){
            next({
                msg: "Product Not Found",
                status: 404
            })
            return
        }
        res.json(data)
    })
    .catch((err) => {
        next(err);
    })
}
function search(req, res, next){
    console.log('Hi from gSearch middleware')
    const condition = {}
    //todo prepare condition
    productQuery
    .find(condition)
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        next(err);
    })
}
function addReview(req, res, next){
    console.log('Hi from addReview middleware');
    //TODO add Loggedin user
    const data = req.body;

    data.user = req.user._id;
    productQuery
    .addReview(req.params.productId, data)
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        next(err);
    })
}

module.exports = {
    get,
    post,
    getById,
    update,
    remove,
    search,
    addReview
}