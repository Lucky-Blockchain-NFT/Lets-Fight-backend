const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const {setNewUser, updateUser, checkUserExist} = require("./queries.js");
const {sendEmailNotification} = require("./email-notification.js");
const app = express()
const port = 4500

// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/health', cors({ origin: '*', credentials: true }), (request, response) => {
    response.json({ info: 'Working correct' })
})

app.post('/check/user', cors({ origin: '*', credentials: true }), checkUserExist)

app.post('/new', cors({ origin: '*', credentials: true }), setNewUser)

app.put('/update/:wallet', cors({ origin: '*', credentials: true }), updateUser)

app.post('/send-email', cors({ origin: '*', credentials: true }), sendEmailNotification)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
