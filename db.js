const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://dali2g:Youssef-2006@cluster0.nnyfcpy.mongodb.net/dalidbretryWrites=true&w=majority";

async function connectDB() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("Connected to database successfully!");
    const db = client.db('dalidb');
    const productsCollection = db.collection('products');
    return productsCollection;
  } catch (err) {
    console.log(err);
  } 
}

module.exports = connectDB;
