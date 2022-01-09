//app.js is the root file and everything go through here.
const express = require('express');
const PORT = 4070;
const app = express(); //all the express is accessed through this app variable now.
const morgan = require('morgan'); //load third party md
const path = require('path');
const cors = require('cors');
// user cors middleware
app.use(cors())

require('./db_init')
//This is like writing db_init js here to make code more cleaner we write it into another place and just require here. We don't save it into any other variables like we do other requires because we haven't imported it. 

//View Engine removed
//Middlewares removed can be used in api.routes.js

//Load third party middleware
app.use(morgan('dev'));



app.use(express.urlencoded(
    
//Incoming request(Post) must be parsed according to content type
//Note:: place this middleware before the request
//parser for z-www-form-urlencoded
//Load inbuilt middleware to parse z-www-form-urlencoded
    {
        extended: true
    }
))
app.use(express.json());
app.use('/api', require('./routes/api.routes')) //Loading all the routes(api)

// serve static files  
// app.use(express.static('uploads')) // serve for internal usage
app.use('/file', express.static(path.join(process.cwd(), 'uploads'))) // serve for external request



//Error handling middleware
//Error handling middleware must have 4 arguments
//1st argument is for error
//and rest of them are for request, response, and next
//error handling middleware will not come into action in between req-res cycle
//error handling middleware must be called 
//to call error handling middleware we call next with argument
//throughout the application wherever we have scope of next we can call next
app.use((req, res, next) => {
    //This middleware will send content inside next if  request can't find the route.
    res.status(400);
    next({
        msg: 'NOT FOUND',
        status: 404
    })
})
app.use((err, req, res, next) => {
    //This is error handling middleware
    console.log("I'm error handling middleware");
    res.status(err.status || 400)
    res.json({
        text: 'Error handling middleware',
        msg : err.msg || err,
        status: err.status || 400
    })
})


app.listen(PORT, function(err, done){
    if(err){
        console.log('Error in listening ', err)
        return 
    }
    console.log('Server listening at portt ' + PORT);
})