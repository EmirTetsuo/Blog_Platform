import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import fileUpload from 'express-fileupload'

import authRoute from './routes/auth.js'
import postRoute from './routes/posts.js'
import commentRoute from './routes/comments.js'

const app = express()
dotenv.config()

// Constants
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true,
}));

app.use(fileUpload({
  useTempFiles: true,
}));
app.use(express.json())

app.use(express.static('uploads'))
app.use('/uploads', express.static('uploads'));

// Routes
// http://localhost:3002
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)
app.use('/api/comments', commentRoute)

mongoose.set('strictQuery', true);


async function start() {
    try {
        await mongoose.connect(
            process.env.MONGO_URL,
        )
        console.log('mongDb connected')

        app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))
        
    } catch (error) {
        console.log(error)
    }
}
start()
