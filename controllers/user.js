const User = require('../models/user')
const { comparePassword } = require('../helpers/bcrypt')
const { encodeToken } = require('../helpers/jwt')
const { OAuth2Client } = require('google-auth-library')
const {sendMail} = require('../helpers/sendMail')

class UserController {
    static login (req, res, next) {
        const { email, password } = req.body
        User.findOne({ email }).exec()
        .then(user => {
            if (!user) {
                next({ msg: 'User Is Not Registered' })
            } else if (user && comparePassword(password, user.password)) {
                const { _id, email, password } = user
                const token = encodeToken({ _id, email, password })
                res.status(200).json({
                    _id,
                    email,
                    token
                })
            } else {
                next({ msg: 'Incorrect E-mail / Password' })
            }
        })
    }
    static register (req, res, next) {
        const { email, password } = req.body
        User.findOne({ email }).exec()
        .then(user => {
            if (user) {
                next({ msg: 'E-mail Is Already Taken' })
            } else {
                User.create({ email, password })
                .then(user => {
                    const { _id, email, password } = user
                    const token = encodeToken({ _id, email, password })
                    sendMail(email,{ msg : `Hi! Thanks For Registering To Our Site!! Hope You Enjoy!!!
                    Your Email: ${email}
                    This Is An Automatically Generated E-Mail.` })
                    res.status(201).json({
                        _id,
                        email,
                        token
                    })
                })
                .catch(next)
            }
        })
    }
    static googleSignIn(req, res, next) {
        const client = new OAuth2Client(CLIENT_ID)
        client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID
        })
        .then(ticket => {
            const payload = ticket.getPayload()
            const { email } = payload
            User.findOne({ email }).exec()
            .then(user => {
                if (user) {
                    const { email, _id, password } = user
                    const token = encodeToken({ email, _id, password })
                    res.status(200).json({ _id, email, password, token })
                } else {
                    next({ msg: 'User Is Not Registered' })
                }
            })
            .catch(next)
        })
    }
}


module.exports = UserController