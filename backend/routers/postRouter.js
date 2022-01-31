const Router = require('express')
const router = new Router()
const controller = require('../controllers/postController')
const checkAuth = require('../middleware/auth-middleware')
const extractFile = require('../middleware/file')

router.post('/create', checkAuth, extractFile, controller.createPost)
router.put('/update/:id',checkAuth, extractFile, controller.updatePost)
router.get('/get', controller.findPosts)
router.get('/:id', controller.findById)
router.delete('/:id', checkAuth, controller.deletePost)

module.exports = router