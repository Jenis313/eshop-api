// VERY IMP CONCEPT
// app.use(middleware1, middleware3, middleware3) is equal to writing 3 function speperately like
//app.use(middlware1)
//app.use(middlware2)
//app.use(middlware3)


const express = require('express');
const router = express.Router();
const path = require('path');
const UserModel = require('./../models/user.model'); 
const MAP_USER_REQ = require('./../helpers/map_user_req'); //This is being used to reduce code duplication and purpose of helpers is nothing more than that.
const Uploader = require('./../middleware/uploader')('image');
const jwt = require('jsonwebtoken'); //Token creater package
const  configs = require('../cofigs/index');
const passwordHash = require('password-hash');//Password hasher package

function generateToken(data){
    return jwt.sign({
        _id: data._id,
        username: data.username,
        role : data.role
    }, configs.JWT_SECRET/*, {
        expiresIn: '1d'
    }*/)
    //Now this function will return token
}
// router.get('/login', (req,res,next) => {
//     res.render('login.pug');
// })
router.post('/login', (req, res, next) => {
    console.log(req.body.username);
    UserModel.findOne({
        username: req.body.username
    })
    .then((user) => {
        console.log('user ==> ',user)
        //Validate password
        //
        // if user is active
        //token generation
        //res end
        if(!user){
            return next({
                msg: 'Invalid Username!!!',
                status: 400
            })
        }
        //User found now verify password
        const isMatched = passwordHash.verify(req.body.password, user.password);
        if(!isMatched){
            return next({
                msg: 'Invalid Password',
                status: 400
            })
        }
        //Everything is fine with username and password 
        // if(result.status == 'inactive'){
        // }
        //Now generate token
        let token = generateToken(user);//It generates a token for the user
        res.json({
            user: user,
            token: token
        })

        /*
        what we were doing here was==>
        first is the login route of post request which means user wants to log in
        then there will be username and password in request object
        we try to run the Usermode.findone method to find user from database based on the username if that method is working it will enter into the then block. Once it is inside then callback we check if the user exist if it does then we verify the password with the help of password hash module. and if everything is fine we generate the token with the help of generateToken function(in which function we used jwt module).

        Now with the help of this token we can verify token that comes from other request so that client doesn't have to put login details each and every time they make a request
        */
    })
    .catch((err) => {
        next(err)
    })
})

// router.get('/register', (req,res,next) => {
//     res.render('register.pug');
// })
router.post('/register', Uploader.single('image')/*review concept section on top*/, (req,res,next) => {
    console.log('req file ==> ', req.file);
    console.log('req.body ==> ',req.body);
    if(req.typeError){
        next({
            msg: 'Invalid Format || Please enter valid file'
        })
    }
    

    if(req.file){
        //req.file is where file uploaded through multer comes like req.body in routher and req.params in application level middleware
        req.body.image = req.file.filename;

    }
    //Create instance of the database model
    const newUser = new UserModel({});
    
    var newMappedUser =  MAP_USER_REQ(req.body, newUser);//IT returns an object
    newMappedUser.password = passwordHash.generate(req.body.password);//hashing password before saving
    newMappedUser.save((err, result) => {
        if(err){
            console.log("failed", err);
            return next(err);
        }
        res.json(result);
    })

})
module.exports = router;