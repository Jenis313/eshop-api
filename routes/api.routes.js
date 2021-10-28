const router = require('express').Router();
//This is the part of app.js file but as soon as there is a lot of routes there will be lot more code and the app.js file will not look clean so for the seperation of concern we just put all the routing  middlewares here so that the code will be much more cleanear

//We are calling it  api because api is application programming interface and it gives the response/result back for the  routes and point of using express is also to make an api. No styling and stuff like that in api.

//Import routing level middleware
const authRouter = require('./../controllers/auth.controller');
const userRouter = require('./../controllers/users.controller');
const productRouter = require('./../components/products/product.router')

//Load Middleware
const Authentication = require('./../middleware/authentication');


//load routing level middleware
router.use('/auth', authRouter);
router.use('/users', Authentication, userRouter);
router.use('/product', productRouter);
module.exports = router;