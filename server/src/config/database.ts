import mongoose, { ConnectOptions } from 'mongoose'

import '../models/User'
import '../models/Blog'

const URL = process.env.MONGO_URL

mongoose.connect(
  `${URL}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as ConnectOptions,
  (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Connected to MongoDB')
    }
  }
)
