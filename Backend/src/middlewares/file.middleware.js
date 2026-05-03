// const multer = require("multer")


// const upload = multer({
//     storage: multer.memoryStorage(),
//     limits: {
//         fileSize: 3 * 1024 * 1024 // 3MB
//     }
// })


// module.exports = upload


const multer = require("multer");

const allowedMimeTypes = new Set([
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (!allowedMimeTypes.has(file.mimetype)) {
            return cb(new Error("Only PDF or DOCX files are allowed."));
        }

        cb(null, true);
    }
});

module.exports = upload;
