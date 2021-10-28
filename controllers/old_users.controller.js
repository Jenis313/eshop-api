const router = require('express').Router();
const UserModel = require('./../models/user.model');
const MAP_USER_REQ = require('./../helpers/map_user_req');
const Uploader = require('./../middleware/uploader');
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
    .put((req,res,next) => {
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
            }
            // //In here we cannot update directly without checking individual values, if we do so we may loose all the existing value. Like if user want to update just username and we update only username and values of all the properties will be set to null which we dont want and to avoid that we first check if the values coming in the request and we only update if it is coming 
            // if(req.body.name) user.name = req.body.name;
            // if(req.body.status) user.status = req.body.status;
            // if(req.body.role) user.role = req.body.name.role;
            // if(req.body.username) user.username = req.body.username;
            // if(req.body.password) user.password = req.body.password;
            // if(req.body.email) user.email = req.body.email;
            // if(req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber;
            // if(req.body.dob) user.dob = req.body.dob;
            // if(req.body.gender) user.gender = req.body.gender;
            // if(!user.address) user.address.temporaryAddress = typeof(req.body.temporaryAddress) === 'string' ? req.body.tempAddress.split(',') : req.body.tempAddress
            // if(req.body.permanentAddress) user.address.permanentAddress = req.body.permanentAddress;
            // if(req.body.country) user.country = req.body.country;
            // if(req.body.image) user.image = req.body.image;
            // // //if(req.body.isArchived) user.isArchived = req.body.isArchived;
            // //Here we have to notice something. req.body.isArchived contains bolean value so it is either true or false. But if we false comes the if(req.body.archived) shouldn't run but in the above case it runs because in wwwencoded file everything is converted to string and if block works which shouldn't work. well In this case everything works exactly same as we want but it shouldn't work in that way because the if block is suppose to check bolean value not the string.
            // //So to make sure everthing is right we set another if block to make false value
            // if(req.body.isArchived) user.isArchived = true;
            // if(req.body.setArchivedFalse) user.isArchived = false;
            // //Now result is same with above block but we are doing in the right way as well after handling the false block
            var mappedUpdatedUser = MAP_USER_REQ(req.body, user)
            
            mappedUpdatedUser.save((err, result) => {
                if(err){
                    return next(err);
                }
                res.json(result);
            })
        })
        // db_connect((err, db) => {
        //     if(err){
        //         return next(err);
        //     }
        //     db
        //     .collection('users')
        //     .update({
        //         _id: new dbConfig.OID(req.params.id)
        //     }, {
        //         $set: req.body
        //     })
        //     .then((data) => {
        //         res.json(data);
        //     })
        //     .catch((err) => {
        //         next(err);
        //     })
        // })
    })
    .delete((req,res,next) => {
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
        // db_connect((err, db) => {
        //     if(err){
        //         return next(err);
        //     }
        //     db
        //     .collection('users')
        //     .remove({
        //         _id: new dbConfig.OID(req.params.id)
        //     })
        //     .then((data) => {
        //         res.json(data);
        //     })
        //     .catch((err) => {
        //         next(err);
        //     })
        // })
    });    
module.exports = router;