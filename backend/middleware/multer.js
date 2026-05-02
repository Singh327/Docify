import multer from 'multer'


// creating configuration for disk storage
const storage = multer.diskStorage({
    filename : function(req,file,callback){
        callback(null,file.originalname)
    }
})
// creating instance of multer uisng disk storage
const upload = multer({storage});

export default upload;