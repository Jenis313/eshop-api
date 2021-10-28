const router = require('express').Router();
const productCtrl = require('./product.controller');
const Uploader = require('./../../middleware/uploader')('image');
const authenticate = require('./../../middleware/authentication');
router.route('/')//home page for product route
    .get(authenticate, productCtrl.get) 
    .post(authenticate, Uploader.array('images'), productCtrl.post) 
    //another way of doing this is 
    //1). router.get('/', (req, res, next) => {
    // // send all the products but insted of doing this we just putting in route('/').get(inside it calling method which does same thing of this middleware)
    // })
    //2). router.post('/', (req, res, next) => {
        //handle post request for /product route but instead we just call productCtrl.get
    //})


router.route('/add_review/:productId')
    .post(authenticate, productCtrl.addReview)

router.route('/search')
    .post(productCtrl.search
        )
    .get(productCtrl.search)

router.route('/:id')
    .get(authenticate, productCtrl.getById)
    .put(authenticate, Uploader.array('images'), productCtrl.update)
    .delete(authenticate, productCtrl.remove)

module.exports = router;