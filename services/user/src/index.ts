import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'


dotenv.config()
const app=express()
const PORT=process.env.PORT||5001
app.use(cors());
app.use(express.json())

app.listen(PORT,()=>{
console.log(`user service is litening to ${PORT}`)
});
