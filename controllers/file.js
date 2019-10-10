const File = require('../models/file')

class FileController {
    static findAll (req, res, next) {
        let filesData = []
        File.find().exec()
        .then(files => {
            files.forEach(file => {
                const { url, user_id, rating } = file
                let averageRating = null
                rating.forEach(number => {
                    averageRating += number
                })
                averageRating = averageRating / rating.length
                filesData.push({ url, user_id, averageRating })
            })
            res.status(200).json(filesData)
        })
        .catch(next)
    }
    static upload (req, res, next) {
        const url = req.file.cloudStoragePublicUrl
        const { user_id } = req.body
        File.create({ url, user_id })
        .then(file => {
            res.status(200).json(file)
        })
        .catch(next({ msg: 'Failed To Upload' }))
    }
}

module.exports = FileController