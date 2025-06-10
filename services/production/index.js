const express = require('express')

const router = require('./routes')

const bodyParser = require('body-parser')

const app = express()

const port = 3000;

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json());

app.use('/api', router)

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})