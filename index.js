const express = require('express');;
const cors = require('cors');
require('dotenv').config();
const app = express()


const port = process.env.PORT || 5000

// modelwear
app.use(cors())
app.use(express.json())
















app.get('/', (req, res) => {
    res.send('server is runing')
})

app.listen(port, () => {
    console.log('port number ', port);
})
