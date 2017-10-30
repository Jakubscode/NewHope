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
const bearerToken = require('express-bearer-token');

// /* APP MODULES */

app.use(cors())


/* CONFIG */

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit:'50mb', extended: true }))
app.use('/uploads', express.static('uploads'))
app.use(bearerToken());

mongoose.Promise = global.Promise;

/* MODELS */
Admin = require('./src/schemas/Admin.js')
User = require('./src/schemas/User.js')
Challenge = require('./src/schemas/Challenge.js')
Payment = require('./src/schemas/Payment.js')
Message = require('./src/schemas/Message.js')
UserChallenge = require('./src/schemas/UserChallenge.js')

app.models = {
    Admin : Admin(mongoose),
    User : User(mongoose),
    Challenge : Challenge(mongoose),
    Payment : Payment(mongoose),
    Message : Message(mongoose),
    UserChallenge : UserChallenge(mongoose),
};


/* ROUTES */
const routes = {
    admin : require('./src/routes/admin.js'),
    user : require('./src/routes/user.js'),
    users: require('./src/routes/users.js')
}
app.use("/admin/", routes.admin(app))
app.use("/user/", routes.user(app))
app.use("/users/", routes.users(app))


/* MONGO CONNECT */
const port = process.env.PORT || 3000
console.log(port)
mongoose.connect('mongodb://admin:TomeczekJestSuper1@ds137435.mlab.com:37435/newhope', { useMongoClient: true })
    .then((db) => {
        app.listen(port, () => {
            console.log(`listening on ${port}`)
        })
    })
