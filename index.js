const express = require('express');;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000

// modelwear
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dci89.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {

        await client.connect()
        const itemCollaction = client.db('warehouseMenagement').collection('items')

        app.get('/item', async (req, res) => {
            const query = {}
            const cursor = itemCollaction.find(query)
            const items = await cursor.toArray()
            res.send(items)
        })

        app.get('/item/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const item = await itemCollaction.findOne(query)
            res.send(item)
        })








    } finally {

    }


}

run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('server is runing')
})

app.listen(port, () => {
    console.log('port number ', port);
})
