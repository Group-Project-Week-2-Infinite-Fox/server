const { decodeToken } = require('../helpers/jwt')
const User = require('../models/user')

const authentication = (req, res, next) => {
    try {
        const { token } = req.headers
        const loggedUser = decodeToken(token)
        req.loggedUser = loggedUser
        next()
    } catch (err) {
        next({ status: 401, message: 'You Must Sign In First!' })
    }
}

const authorization = (req, res, next) => {
        User.findOne(
            {
                where: { _id: req.loggedUser._id }
            }
        )
        .then(next())
        .catch(next)
    }

module.exports = { authentication, authorization }