const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://Userdb:O8eXEB7KC9Z20Ay4@cluster0.hj4tbay.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db("model-db");
    const modelcollection = db.collection("models");

    app.get("/models", async (req, res) => {
      const result = await modelcollection.find().toArray();
      res.send(result);
    });

    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}
run();

app.get("/", (req, res) => {
  res.send("Hello World hiiiii!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
