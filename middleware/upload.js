const multer = require('multer')
const moment = require('moment')


const storage = multer.diskStorage({
    destination (req, file, cb){ // destination - пункт призначення, cb - функція, яка має виконатися, коли все завершиться
        cb(null, 'uploads/')
    },
    filename (req, file, cb){
        const date = moment().format('DDMMYYYY-HHmmss_SSS')
        cb(null, `${date}-${file.originalname}`)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){ // mimeType - перевірка, чи файл є картинкою
        cb(null, true)
    }
    else {
        cb(null, false)
    }
}

const limits = {
    fileSize: 1024*1024*5
}


module.exports = multer({
    storage, fileFilter, limits
})
