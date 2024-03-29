const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5001;
const app = express();

// middelwear
app.use(cors());
app.use(express.json());
// "myFirstDatabase"

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dci89.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("warehouseMenagement");
    const itemCollaction = db.collection("items");
    const extraCollaction = client
      .db("warehouseMenagement")
      .collection("extra");

    app.post("/login", async (req, res) => {
      const user = req.body;
      const accesstoken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.send(accesstoken);
    });

    app.get("/item", async (req, res) => {
      const query = {};
      const cursor = itemCollaction.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });

    app.get("/item/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const item = await itemCollaction.findOne(query);
      res.send(item);
    });

    // Delete
    app.delete("/item/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await itemCollaction.deleteOne(query);
      res.send(result);
    });

    app.post("/additem", async (req, res) => {
      const newInventory = req.body;
      const result = await itemCollaction.insertOne(newInventory);
      res.send(result);
    });

    // myItem
    app.get("/myitem", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = itemCollaction.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });

    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
          desc: updatedUser.desc,
          img: updatedUser.img,
          price: updatedUser.price,
          quantity: updatedUser.quantity,
          supplierName: updatedUser.supplierName,
        },
      };
      console.log(updatedDoc);
      const result = await itemCollaction.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.patch("/update/:id", async (req, res) => {
      const id = req.params.id;
      const updatedItem = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          quantity: updatedItem.total,
        },
      };
      console.log(updatedDoc);
      const result = await itemCollaction.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    // extra route
    app.get("/extra", async (req, res) => {
      const query = {};
      const cursor = extraCollaction.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });
  } finally {
  }
};
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("server is runing");
});

app.get("/varcel", (req, res) => {
  res.send("varcel is runing");
});

app.listen(port, () => {
  console.log("port number ", port);
});
