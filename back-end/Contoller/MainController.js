const bcrypt = require('bcryptjs');
const Models = require('../Models/MainModel');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file , cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb ) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    }
});

const upload = multer({storage});

const main = {


}


module.exports = main;
