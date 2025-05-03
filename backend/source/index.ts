import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

/* Route Imports */
import exampleRoutes from './routes/exampleRouter'
import companyRoutes from './routes/companyRouter'
import userRoutes from './routes/userRouter' 
import bossRoutes from './routes/bossRouter'
import adminRoutes from './routes/adminRouter'
import reviewRoutes from './routes/reviewRouter'

/* Configs */
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

/* Routes */
app.use("/example", exampleRoutes)
app.use("/company", companyRoutes)
app.use("/user", userRoutes)
app.use("/boss", bossRoutes)
app.use("/admin", adminRoutes)
app.use("/review", reviewRoutes)

/* Server */
const port = Number(process.env.PORT) || 3001
app.listen(port, "0.0.0.0", () => {
   console.log(`Server is running on port ${port}`)
})
