// module.exports = function(req, res, next){
// //     if(req.query.token == 'random'){
// //         next();
// //         return
// //     }
// //     next('Sorry you dont have access!!');
// // }
const JWT = require('jsonwebtoken');
const configs = require('./../cofigs/index');
const UserModel = require('./../models/user.model');

module.exports = function(req,res,next){
    let token;
    if (req.headers['authorization'])
        token = req.headers['authorization']
    if (req.headers['x-access-token'])
        token = req.headers['x-access-token']
    if (req.query['token'])
        token = req.query['token']

    
    if(!token){
        return next({
            msg: "Authentication Failed! Token not found",
            status: 401
        })
    }

    //Token available now
    JWT.verify(token, configs.JWT_SECRET, (err, result) => {
        if(err){
            return next(err);
        }
        console.log('Token verifaication successful');
        //Add client information in request when passing control
            /*req.user = result;//putting user's information in request object before passing the control.
            next();*/
        //We could write the above commented code where if the token is verified then whatever comes in token will be set to request object but there is a problem and the problem is token's information may not always true because some tokens don't expire and if the token is not expired and there is some changes made to the user/or deleted user of that token then that will not be reflected in token which means even if there changes have been made in the user's info., the token works like before and the same record will be set to request object as well. so to avoid that we need to verify that token's information matches with database information. 
        UserModel.findOne({_id: result._id}, (err, user) => {
            if(err){
                next(err);
                return
            }
            if(!user){
                //It means user is deleted from database and if we didn't verify it with database and rely on token only it would work and the deleted user would get access.
                next({
                    msg: 'User removed from the system',
                    status: 404
                })
                return
            }
            //If code comes till here which means the user still exist in the database and we set the fresh information from database to the request object so that everything works as we wanted and even some information is changed it will reflected in the request object.
            req.user = user;
            next();
        })
    })

}

//WHen someone logs in jwt will sign and generates the token and use that token to verify other requests this middleware is to verify the token and pass control to other middleware(routing level, application level etc) if the request has valid token. and also this middleware set the information of the user of the token to the request object so that if some next middlewares need information related of loggedin user they get that through req.user method 