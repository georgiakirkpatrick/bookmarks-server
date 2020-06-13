require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const bookmarksRouter = require('./bookmarks/bookmarks-router')
const logger = require('./logger.js')

const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common'

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    // const authToken = req.get('Authorization')
    const authToken = '631ba05c-ab6f-11ea-bb37-0242ac130002'
    console.log(apiToken)
    console.log(authToken)

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        logger.error(`Unauthorized request to path: ${req.path}`)
      return res.status(401).json({ error: 'Unauthorized request' })
    }

    next()
})

app.use(bookmarksRouter)

app.get('/', (req, res) => {
    res.status(200).send('Hello, world!')
})

app.use(function errorHandler(err, req, res, next) {
    let response
    if (process.env.NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(err)
        response = { error: { message: 'server error' } }
    }
    res.status(500).json(response)
})

module.exports = app