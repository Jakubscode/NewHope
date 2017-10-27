/* DEPENDENCIES */

const express = require('express');
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const multer = require('multer')
const imageType = require('image-type')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const cors = require('cors')
const formData = require("express-form-data");
// const multipartyOptions = {
//   autoFiles: true
// };
// // parse a data with connect-multiparty. 
// app.use(formData.parse(multipartyOptions));
// // clear all empty files (size == 0)
// app.use(formData.format());
// // change file objects to node stream.Readable 
// app.use(formData.stream());
// // union body and files
// app.use(formData.union());
// /* APP MODULES */

// app.use(cors())




/* CONFIG */

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ extended: true }))


// const multerStorage = multer.diskStorage({
//     destination: './uploads/',
//     filename: function(req, file, cb) {
//         crypto.pseudoRandomBytes(16, function(err, raw) {
//             if (err) return cb(err)

//             cb(null, raw.toString('hex') + path.extname(file.originalname))
//         })
//     }
// })

mongoose.Promise = global.Promise;

/* MODELS */

app.models = {
    

};


/* ROUTES */
const routes = {
    admin : require('./src/routes/admin.js')
}
app.use("/admin/", routes.admin())


/* MONGO CONNECT */
const port = 3000
mongoose.connect('mongodb://admin:TomeczekJestSuper1@ds137435.mlab.com:37435/newhope', { useMongoClient: true })
    .then((db) => {
        app.listen(port, () => {
            console.log(`listening on ${port}`)
        })
    })