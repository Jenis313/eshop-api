// VERY IMP CONCEPT
// app.use(middleware1, middleware3, middleware3) is equal to writing 3 function speperately like
//app.use(middlware1)
//app.use(middlware2)
//app.use(middlware3)


const router = require('express').Router();
const UserModel = require('./../models/user.model');
const path = require('path');
const fs = require('fs');
const MAP_USER_REQ = require('./../helpers/map_user_req');
const Uploader = require('./../middleware/uploader')('image');
const authorize = require('./../middleware/authorization');

router.route('/')
    .get((req,res,next) => {
        UserModel
        .find({})
        .sort({
            _id:-1 //IT reverses the data flow
        })
        // .limit(1) // it limits the result
        // .skip(2) //For skipping
        .exec((err, result) => {
            if(err){
                next(err);
                return
            }
            res.json(result);
        })
    })
    .post((req,res,next) => {

    })
    .put((req,res,next) => {

    })
    .delete((req,res,next) => {

    });

router.route('/search')
    .get((req,res,next) => {
        console.log('Hello from Search of user');
        UserModel
        .find({})
        .exec()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            next(err);
        })
    })
    .post((req,res,next) => {

    })
    .put((req,res,next) => {

    })
    .delete((req,res,next) => {

    });

router.route('/:id')
    .get((req,res,next) => {
        UserModel
        .findById(req.params.id, (err, result) => {
            if(err){
                next(err);
                return
            }
            if(!result){
                next({
                    msg: 'Not Found',
                    status: 404
                })
                return
            }
            res.json(result);
        })
    })
    .post((req,res,next) => {

    })
    .put(Uploader.single('image')/*review Concept section on top*/, (req,res,next) => {

        if(req.typeError){
            next({
                msg: 'Invalid Format || Please upload valid file',
                status: 406
            });
        }

        UserModel
        .findOne({
            _id : req.params.id
        }, (err, user) => {
            if(err) {
                next(err);
                return
            }
            if(!user){
                next({
                    msg: 'User Not Found',
                    status: 404
                })
                return
            }
            let oldImage = '';
            if(req.file){
                req.body.image = req.file.filename;
                oldImage = user.image;
            }
            var mappedUpdatedUser = MAP_USER_REQ(req.body, user);

            
            mappedUpdatedUser.save((err, result) => {
                if(err){
                    return next(err);
                }
                fs.unlink(path.join(process.cwd(),`uploads/images/${user.image}`), (err, result) => {
                  if(err){
                      console.log('Cant delete old file in server');
                  }  
                })
                res.json(result);
            })
        })
    })
    .delete(authorize, (req,res,next) => {
        UserModel
        .findById(req.params.id, (err, result) => {
            if(err){
                next(err)
                return
            }
            if(!result){
                next({
                    msg: 'Not Found',
                    status: 404
                })
                return
            }
            result.remove((err, removed) => {
                if(err){
                    return next(err);
                }
                res.json(removed)
            })
        })
    });    
module.exports = router;