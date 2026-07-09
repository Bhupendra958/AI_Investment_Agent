const multer = require("multer");
const path = require("path");

// Storage

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "uploads");

    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 100000) +
            path.extname(file.originalname);

        cb(null, uniqueName);

    },

});

// File Filter

const fileFilter = (req, file, cb) => {

    if (file.mimetype.startsWith("image")) {

        cb(null, true);

    } else {

        cb(new Error("Only Images Allowed"), false);

    }

};

module.exports = multer({

    storage,

    fileFilter,

});