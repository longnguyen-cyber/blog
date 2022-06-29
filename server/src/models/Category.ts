import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add your category'],
      trim: true,
      unique: true,
      maxlength: [50, 'Category name must be less than 50 characters']
    }
  },
  { timestamps: true }
)

export default mongoose.model('category', categorySchema)
