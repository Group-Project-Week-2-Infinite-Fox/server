const File = require('../models/file')

class FileController {
    static findAll (req, res, next) {
        let filesData = []
        File.find().exec()
        .then(files => {
            files.forEach(file => {
                const { _id, url, user_id, rating } = file
                let averageRating = null
                rating.forEach(number => {
                    averageRating += number
                })
                if (rating.length === 0) {
                    averageRating = 0
                } else {
                    averageRating = averageRating / rating.length
                }
                filesData.push({ _id, url, user_id, averageRating })
            })
            res.status(200).json(filesData)
        })
        .catch(next)
    }
    static upload (req, res, next) {
        const url = req.file.cloudStoragePublicUrl
        const user_id = req.loggedUser._id
        File.create({ url, user_id })
        .then(file => {
            res.status(200).json(file)
        })
        .catch(next)
    }
    static addRating(req, res, next) {
        const { rating } = req.body
        const { id } = req.params
        File.updateOne({ _id: id }, { $push: { rating } }).exec()
        .then(file => {
            res.status(200).json({ msg: 'Successfully Rated!' })
        })
        .catch(next)
    }
}

module.exports = FileController