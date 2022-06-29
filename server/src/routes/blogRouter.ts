import express from 'express'
import blogCtrl from '../controllers/blogCtrl'
import auth from '../middlewares/auth'

const router = express.Router()

router.get('/home/blogs', blogCtrl.getHomeBlogs)

router.post('/blog', auth, blogCtrl.createBlog)

router.get('/blogs/category/:category_id', blogCtrl.getBlogsByCategory)

router.get('/blogs/user/:id', blogCtrl.getBlogsByUser)

router
  .route('/blog/:id')
  .get(blogCtrl.getBlog)
  .put(auth, blogCtrl.updateBlog)
  .delete(auth, blogCtrl.deleteBlog)

router.get('/search/blogs', blogCtrl.searchBlogs)
export default router
