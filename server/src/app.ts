import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 5000

// Routes here

// Routes
app.get('/', (req, res) => {
  res.send('Server running fine')
})

app.listen(PORT, () => {
  console.log(`Server is running on port localhost:${PORT}/`)
})
