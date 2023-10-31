import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
import libraryRoutes from './routes/libRoutes.js'
let app = express()


app.use(cors())
app.use(express.json())
app.use("/", libraryRoutes)


mongoose.connect(process.env.MONGO_STRING, { dbName: "BrewApps" }).then(() => {
    console.log("Connected")
})


app.listen(process.env.PORT, () => {
    console.log("Connected to PORT", process.env.PORT)
})