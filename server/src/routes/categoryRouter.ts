import express from 'express'
import categoryCtrl from '../controllers/categoryCtrl'
import auth from '../middlewares/auth'

const router = express.Router()

router.get('/category', categoryCtrl.getCategories)
router.get('/category/:id', categoryCtrl.getCategory)
router.post('/category', auth, categoryCtrl.createCategory)
router.patch('/category/:id', auth, categoryCtrl.updateCategory)
router.delete('/category/:id', auth, categoryCtrl.deleteCategory)

export default router
