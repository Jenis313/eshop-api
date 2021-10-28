//This is an example of a controller which means it handles all the request related with '/auth'. We use routing level middleware to deal with it.
const express = require('express');
const router = express.Router();
const UserModel = require('./../models/user.model'); //We've created database schema for user registration using mongoose so we can easily use that in here. 
const MAP_USER_REQ = require('./../helpers/map_user_req'); //This is being used to reduce code duplication and purpose of helpers is nothing more than that.
const path = require('path');

const multer = require('multer'); //Multer is third party middleware and it is used to upload files(This only works for file encoded type: multipart/form-data)
// const upload = multer({
//     dest: 'uploads'
// //This is the default way of uploading file in server using multer but it keeps the name of file unreadable and we can't decide where to upload files multer decides by itself it is not really good approach to upload files but there is a method in multer which is shown below where we have full control of the name and location of uploaded files.
// })

function custom_type_filter(type){
//2.) Multer gives a way to validate file and this function is for the file type validation before uploading to server so we don't have to remove form server like we did in the 1. way
    return function type_filter(req, file, cb){
        var mime_type = file.mimetype.split('/')[0];
        if(mime_type === type){
            cb(null, true)
        }else{
            req.typeError = true;//we have the request object here so we are putting typeError in req object if the else block run which means type is invalid and we will use this typeError property(we just insert into req obj) to alert users about invalid files.
            cb(null, false)
        }
    }
}


const file_storage = multer.diskStorage({
    //This is decides where to store the uploaded files in the server with the name we wanted to keep. And don't forget it is a method of multer which is a third party middleware 
    // filename: (req, file, cb) => {
    //     cb(null, file.originalname);
    // }, //In this case everything works fine but if we upload two or more files with same name then the last one will replace previous one(s). So to avoid this situation we just have to think of a solution
    filename: (req, file, cb) => {
        cb(null, Date.now()+ '-' + file.originalname);
        //If we put the date.now method before all the files will have unique name
        //If the size is even large we can use 'tmp' package which can be downloaded form npmjs
    },
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), 'uploads/images'));
    } 
})
const upload = multer({
    storage: file_storage,  //so instead of using multer default way now we use our own way sotrage and naming
    fileFilter: custom_type_filter('image')
})

router.get('/login', (req,res,next) => {
    res.render('login.pug');
})
router.post('/login', (req, res, next) => {
    console.log(req.body.username);
    UserModel.findOne({
        username: req.body.username
    })
    .then((result) => {
        //Validate password
        if(result.status == 'inactive'){
        }
        // if user is active
        //token generation
        //res end

        res.json(result);
    })
    .catch((err) => {
        next(err)
    })
})

router.get('/register', (req,res,next) => {
    res.render('register.pug');
})
router.post('/register', upload.single('image'), (req,res,next) => {
    console.log('req file ==> ', req.file);
    console.log('req.body ==> ',req.body);
    if(req.typeError){
        next({
            msg: 'Invalid Format || Please enter valid file'
        })
    }
    // //Well, While uploading files we may encounter two possible problem the first is the one is we just saw above which is if two or more files with same name are uploaded and last file will replace all. We already fixed that and the next one is file type validation, what that means is we have to restict user from uploading file type other than what he/she is supposed to uppload. Like user shouldn't be able to upload  images where the server needs only pdfs and vice versa.

    // //To validate files we can either do it before uploading to server or after uploading to server.
    // //1.) After uploading to server
    // if(req.file){
    //     var mime_type = req.file.mimetype.split('/')[0];
    //     //req.file.mimetype will have the type of file(like image/png for images, application/js for js files etc) and we can split it by / and it's 0 index will be the type

    //     if(mime_type !== image){
    //         next({
    //             msg: 'Invalid File Format',
    //             status: 406 
    //         })
    //     }
    //     //Now at this point data is validated it will not be put into db but it is already uploaded in the server so we have to remove it as well
    //     //To remove it we have to use fs.unlink


    //     //

    // }
    // //(see at the top for the second way of doing )

    if(req.file){
        //req.file is where file uploaded through multer comes like req.body in routher and req.params in application level middleware
        req.body.image = req.file.filename;

    }
    //Create instance of the database model
    const newUser = new UserModel({});
    // //newUser is mongoose's object
    // // newUser.name = req.body.name;
    // // newUser.email = req.body.emailaddress;
    // // newUser.username = req.body.username;
    // // newUser.password = req.body.password;
    // // newUser.phoneNumber = req.body.phoneNumber;
    // // newUser.gender = req.body.gender;
    // // newUser.dob = req.body.dob;
    // // newUser.address = {};
    // // newUser.address.temporaryAddress = req.body.tempAddress;
    // // newUser.address.permanentAddress = req.body.permanentAddress;
    // we could have used above code but same code exist in user controller so we are just using a function from helper
    var newMappedUser =  MAP_USER_REQ(req.body, newUser);
    newMappedUser.save((err, result) => {
        if(err){
            console.log("failed");
            return next(err);
        }
        res.json(result);
    })
//     //req.body will have data from client
//     //database operation
//     // MongoClient.connect(conxnURL, { useUnifiedTopology: true }, (err, client) => {
//     //     if(err){
//     //         next(err);
//     //         return
//     //     }
//     //     console.log("Databse connection successfull");
//     //     const selectDb = client.db(dbName);
//     //     selectDb.collection('users')
//     //     .insert(req.body)
//     //     .then((data) => {
//     //         res.json(data);
//     //         client.close();
//     //     })
//     //     .catch((err) => {
//     //         next(err);
//     //     })
//     // })
//     db_connect((err, db) => {
//         if(err){
//             console.log('Error in connection')
//             return next(err);
//         }
//         db.collection('users')
//         .insert(req.body)
//         .then((data) => {
//             res.json(data);
//             client.close();
//         })
//         .catch((err) => {
//             next(err);
//         })
//     })
})

module.exports = router;