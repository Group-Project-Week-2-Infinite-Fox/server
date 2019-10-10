const router = require('express').Router()
const fileController = require('../controllers/file')
const auth = require('../middlewares/auth')
const images = require('../helpers/images')


router.get('/find', fileController.findAll)
router.post('/upload', auth, images.multer.single('image'), 
images.sendUploadToGCS, fileController.upload)

module.exports = router