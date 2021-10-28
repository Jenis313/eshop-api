//WE could write the whole code of authentication in here and also validate token and check the role of user from database(based on the token's id of request) and if the role is correct we pass the control else we don't pass the control. But we don't have to do that  authorization's order comes after authentication so  middleware after 
module.exports = function(req, res, next){
    if(req.user.role === 1){
        next();
    }
    else{
        next({
            msg: 'Authorization failed! You dont have access',
            status: 401
        })
    }
}