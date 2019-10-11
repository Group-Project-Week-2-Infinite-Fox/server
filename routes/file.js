const router = require('express').Router()
const fileController = require('../controllers/file')
const { authentication, authorization } = require('../middlewares/auth')
const images = require('../helpers/images')


router.get('/find', fileController.findAll)
router.post('/rate/:id', fileController.addRating)

router.use(authentication, authorization)
router.post('/upload', images.multer.single('image'), images.sendUploadToGCS, fileController.upload)

module.exports = router