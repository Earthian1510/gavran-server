const initializeDB = require('./db/db.connect');
const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

const categoryRoutes = require('./routes/category.routes')
const productRoutes = require('./routes/product.routes')

initializeDB()

app.get('/', (req, res) => {
    res.send('Hello, Gavran Server')
})

app.use('/', categoryRoutes)
app.use('/', productRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`--------------------------------------------`)
    console.log(`Server running on port http://127.0.0.1:${PORT}`);
    console.log(`--------------------------------------------`)
})