module.exports =
    (err, req, res, next) => {
        console.log(err.message)
        if (err.name === 'ValidationError') {
            const { message } = err
            let index = message.indexOf(':') + 1
            let errors = message.slice(index).split(',')
            let objErr = {}
            errors.forEach(err => {
                let key = err.slice(0, err.indexOf(':'))
                let value = err.slice(err.indexOf(':') + 2)
                objErr[key] = value
            })
            res.status(400).json(objErr)
        } else if (err.msg === 'Incorrect E-mail / Password') {
            res.status(400).json(err)
        } else if (err.msg === 'User Is Not Registered') {
            res.status(400).json(err)
        } else if (err.message === 'Please Sign In First!') {
            res.status(404).json(err)
        } else if (err.msg === 'E-mail Is Already Taken') {
            res.status(400).json(err)
        } else {
            console.log(err)
        }
    }