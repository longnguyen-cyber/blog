import Slider from 'react-slick'
import { IBlog, ICategory } from '../../utils/types'
import CardVert from '../cards/CardVert'
interface IProps {
  cate: ICategory
  blogs: IBlog[]
}
const Sliders = ({ cate, blogs }: IProps) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
  }

  return (
    <Slider {...settings} className="slider">
      {blogs.filter((blog) => blog.category === cate._id).length > 2 &&
        blogs
          .filter((blog) => blog.category === cate._id)
          .map((blog) => <CardVert blog={blog} key={blog._id} />)}
    </Slider>
  )
}

export default Sliders
