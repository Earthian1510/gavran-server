const initializeDB = require('./db/db.connect');
const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

const categoryRoutes = require('./routes/category.routes')
const productRoutes = require('./routes/product.routes')
const authRoutes = require('./routes/auth.routes')
const cartRoutes = require('./routes/cart.routes')
const wishlistRoutes = require('./routes/wishlist.routes')
const userRoutes = require('./routes/user.routes')
const addressRoutes = require('./routes/address.routes')
const orderRoutes = require('./routes/order.routes')

initializeDB()

app.get('/', (req, res) => {
    res.send('Hello, Gavran Server')
})

app.use('/', categoryRoutes)
app.use('/', productRoutes)
app.use('/', authRoutes)
app.use('/', cartRoutes)
app.use('/', wishlistRoutes)
app.use('/', userRoutes)
app.use('/', addressRoutes)
app.use('/', orderRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`--------------------------------------------`)
    console.log(`Server running on port http://127.0.0.1:${PORT}`);
    console.log(`--------------------------------------------`)
})