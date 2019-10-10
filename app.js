// DOTENV VARIABLE
if (process.env.NODE_ENV === 'development') {
    require('dotenv').config()
}

// STATE VARIABLES
const express = require('express')
const mongoose = require('mongoose')
const errorHandler = require('./middlewares/errorHandler')
const routes = require('./routes/index')
const cors = require('cors')
const logger = require('morgan')
const PORT = process.env.PORT
const app = express()

//CONNECTION
mongoose.connect(process.env.MONGOOSE_URL,
        { useNewUrlParser: true,
        useUnifiedTopology: true },
        (err => {
            err ? console.log(err) : console.log('connected to mongoose')
        }))

// MIDDLE WARES
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())
app.use(logger('dev'))

//ROUTE

app.use('/', routes)


//ERROR HANDLER MIDDLEWARE
app.use(errorHandler)

app.listen(PORT, () => console.log(`listening at port PORT`))
