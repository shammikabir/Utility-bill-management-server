const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const modelcollection = db.collection("bills");

    app.get("/allbills", async (req, res) => {
      const result = await modelcollection.find().toArray();
      res.send(result);
    });
    app.get("/bills", async (req, res) => {
      const result = await modelcollection.find().limit(6).toArray();
      res.send(result);
    });

    app.get("/allbills/:id", async (req, res) => {
      const { id } = req.params;
      const objectId = new ObjectId(id);

      const result = await modelcollection.findOne({ _id: objectId });

      res.send({
        success: true,
        result,
      });
    });

    app.get("/bills/filter", async (req, res) => {
      try {
        const category = req.query.category; // URL theke category nilam

        let filter = {}; // empty filter object

        // jodi category thake, tahole filter e set korlam
        if (category) {
          filter.category = category;
        }

        // MongoDB theke oi category er bills gula niye aslam
        const result = await modelcollection.find(filter).toArray();

        res.send(result); // frontend e data pathailam
      } catch (error) {
        console.log("Filter error:", error);
        res.status(500).send({ message: "Something went wrong!" });
      }
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
