import express from 'express'
import userCtrl from '../controllers/userCtrl'

//middleware
import auth from '../middlewares/auth'

const router = express.Router()

router.patch('/user', auth, userCtrl.updateUser)
router.patch('/reset_password', auth, userCtrl.resetPassword)

//other user
router.get('/user/:id', userCtrl.getUser)
export default router
