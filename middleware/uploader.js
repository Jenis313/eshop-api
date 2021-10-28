// Very Very important thing to notice
// If the content type is x-www-encoded no need to use third party middleware 
// If content type is multipart/form-data we need to use third party middleware so multer is one of them and it is not just for image upolad it will parse all the contents that is send as request and if you don't parse the content type multipart/form-data you will not get any object in request.

const path = require('path')
//we use multer here to use file upload tasks
const multer = require('multer'); //Multer is third party middleware and it is used to upload files(This only works for file encoded type: multipart/form-data)
// const upload = multer({
//     dest: 'uploads'
// //This is the default way of uploading file in server using multer but it keeps the name of file unreadable and we can't decide where to upload files multer decides by itself it is not really good approach to upload files but there is a method in multer which is shown below where we have full control of the name and location of uploaded files.
// })

function imageFilter(req, file, cb){
//2.) Multer gives a way to validate file and this function is for the file type validation before uploading to server so we don't have to remove form server like we did in the 1. way
        var mime_type = file.mimetype.split('/')[0];
        if(mime_type === 'image'){
            cb(null, true)
        }else{
            req.typeError = true;//we have the request object here so we are putting typeError in req object if the else block run which means type is invalid and we will use this typeError property(we just insert into req obj) to alert users about invalid files.
            cb(null, false)
        }
}
function pdfFilter(req, file, cb){
        if(file.mime_type === 'application/pdf'){
            cb(null, true)
        }else{
            req.typeError = true;
            cb(null, false)
        }
}
    
function sizeFilter(req, file, cb){
    if(file.size< 209){
        cb(null, true);
    }else{
        req.fileSizeError = true;
        cb(null, false);
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


module.exports = function (filterType){
    const MAP_FILTER = {
        image: imageFilter,
        pdf: pdfFilter,
        size: sizeFilter
    }
    const upload = multer({
        storage: file_storage,  //so instead of using multer default way now we use our own way sotrage and naming
        fileFilter: MAP_FILTER[filterType],
    })
    return upload
}