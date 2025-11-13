const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URI
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.hj4tbay.mongodb.net/model-db?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    // await client.connect();
    console.log("Connected to MongoDB Atlas");

    const db = client.db("model-db");
    const modelcollection = db.collection("bills");
    const myBillsCollection = db.collection("myBills");

    //  Get all bills
    app.get("/allbills", async (req, res) => {
      const result = await modelcollection.find().toArray();
      res.send(result);
    });

    //  Get limited bills (for home)
    app.get("/bills", async (req, res) => {
      const result = await modelcollection.find().limit(6).toArray();
      res.send(result);
    });

    //  Get bill details by ID
    app.get("/allbills/:id", async (req, res) => {
      const { id } = req.params;
      const objectId = new ObjectId(id);
      const result = await modelcollection.findOne({ _id: objectId });
      res.send({ success: true, result });
    });

    //  Filter bills by category
    app.get("/bills/filter", async (req, res) => {
      const category = req.query.category;
      const filter = category ? { category } : {};
      const result = await modelcollection.find(filter).toArray();
      res.send(result);
    });

    //  POST → Add new bill (My Bills)
    app.post("/myBills", async (req, res) => {
      const data = req.body;
      const result = await myBillsCollection.insertOne(data);
      res.send({ success: true, result });
    });

    //  GET → Get bills by user email
    app.get("/myBills/:email", async (req, res) => {
      const email = req.params.email;
      const result = await myBillsCollection.find({ email }).toArray();
      res.send({ success: true, result });
    });

    // Update bill by ID
    app.put("/myBills/:id", async (req, res) => {
      const { id } = req.params;
      const data = req.body;
      const result = await myBillsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
      );
      res.send({ success: true, result });
    });

    //  DELETE  Delete bill by ID
    app.delete("/myBills/:id", async (req, res) => {
      const { id } = req.params;
      const result = await myBillsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send({ success: true, result });
    });
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

// Run DB connection
run().catch(console.dir);

// Root route
app.get("/", (req, res) => {
  res.send("Hello World!  Server is running smoothly.");
});

// Start server
app.listen(port, () => {
  console.log(` Server running on http://localhost:${port}`);
});
